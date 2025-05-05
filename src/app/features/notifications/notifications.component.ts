import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../core/services/posts.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule, RouterModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(private postService: PostsService) {}

  ngOnInit(): void {
    this.postService.getNotifications().subscribe({
      next: (data) => this.notifications = data
    });
  }
}

