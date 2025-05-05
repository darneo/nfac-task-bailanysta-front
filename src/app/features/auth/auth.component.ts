import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthModel } from '../../core/models';
import { PostsService } from '../../core/services/posts.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  authModel: AuthModel;
  isVisible: boolean = true;
  authError: string = '';

  constructor(private postService: PostsService, private router: Router) {
    this.authModel = {} as AuthModel;
  }

  login() {
    this.authError = ''; // Сброс перед каждой попыткой

    this.postService.login(this.authModel).subscribe(
      (token) => {
        localStorage.setItem('access', token.access);
        localStorage.setItem('refresh', token.refresh);
        localStorage.setItem('username', this.authModel.username);

        this.router.navigate(['/home']).then(() => window.location.reload());
      },
      (error) => {
        console.error('Ошибка входа:', error);
        this.authError = 'Неверное имя пользователя или пароль';
      }
    );
  }

  hideForm() {
    this.isVisible = false;
  }

  showForm() {
    this.isVisible = true;
  }
}
