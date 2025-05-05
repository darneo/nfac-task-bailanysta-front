import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule]
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  isFormVisible = false;
  isFormFadingOut = false;

  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.isFormVisible = true;
    }, 100);
  }

  register(form: NgForm) {
    this.errorMessage = ''; // Сброс ошибки

    if (form.invalid) {
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'Пароль должен содержать минимум 8 символов.';
      return;
    }

    const body = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.http.post<any>('http://127.0.0.1:8000/api/auth/register/', body).subscribe({
      next: (res) => {
        localStorage.setItem('access', res.access);
        localStorage.setItem('refresh', res.refresh);
        localStorage.setItem('username', res.user.username);

        this.isFormFadingOut = true;
        setTimeout(() => {
          this.router.navigate(['/auth']);
        }, 500);
      },
      error: (err) => {
        if (err.error.username) {
          this.errorMessage = 'Имя пользователя уже занято.';
        } else if (err.error.email) {
          this.errorMessage = 'Этот email уже используется.';
        } else {
          this.errorMessage = 'Ошибка регистрации: ' + JSON.stringify(err.error);
        }
      }
    });
  }
}
