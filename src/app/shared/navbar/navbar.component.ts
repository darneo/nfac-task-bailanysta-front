import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PostsService } from '../../core/services/posts.service';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { GeminiService } from '../../core/services/gemini.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, FormsModule], 
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username: string | null = null;
  showModal = false;
  postContent = '';
  prompt: string = '';
  response: string = '';
  loading = false;
  displayedText = '';
  typingSpeed: number = 30;


  constructor(private postService: PostsService, private geminiService: GeminiService) {}

  ngOnInit(): void {
    // Получаем имя пользователя из localStorage, если оно там есть
    this.username = localStorage.getItem('username');
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.response = '';
    this.prompt = '';
    this.postContent = '';
  }

  createPost() {
    if (this.postContent.trim()) {
      this.postService.createPost(this.username, this.postContent).subscribe({
        next: (res) => {
          this.closeModal(); // Закрыть модалку после успешной отправки
          this.postContent = ''; // Очистить поле ввода
          window.location.reload(); // 🔄 Перезагрузить страницу
        },
        error: (err) => {
          console.error('Ошибка при создании поста:', err);
        }
      });
    }
  }

  async askGemini() {
    this.loading = true;
    try {
      this.response = await this.geminiService.generateContent(
        `Создай короткий, интересный и легко читаемый текст по теме: "${this.prompt.trim()}". ` +
        `Используй дружелюбный тон, избегай сложных слов. Ограничь текст 70–80 словами. ` +
        `Добавь конкретную мысль или совет, который зацепит читателя. ` +
        `Заверши пост вопросом, чтобы вовлечь аудиторию.`
      );
      this.startTypingEffect();
    } catch (err) {
      this.response = 'Ошибка при обращении к Gemini API';
      this.displayedText = this.response;
      this.loading = false; 
    }
  }
  createPostFromGemini() {
    this.postContent = this.response;
  }
  startTypingEffect() {
    let index = 0;
    this.displayedText = '';
  
    const interval = setInterval(() => {
      if (index < this.response.length) {
        this.displayedText += this.response.charAt(index);
        index++;
      } else {
        this.loading = false;
        clearInterval(interval);
      }
    }, this.typingSpeed);
  }
}
