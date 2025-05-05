import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../core/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('access_token');

    let authReq = req;
    if (accessToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('/auth/login')) {
          // Токен просрочен, пробуем обновить
          return this.authService.refreshToken().pipe(
            switchMap((tokens: any) => {
              localStorage.setItem('access_token', tokens.access);
              // Повторяем оригинальный запрос с новым access токеном
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${tokens.access}`,
                },
              });
              return next.handle(newReq);
            }),
            catchError(err => {
              this.authService.logout(); // очищаем и редиректим
              return throwError(() => err);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
