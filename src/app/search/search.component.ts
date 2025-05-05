import { Component } from '@angular/core';
import { SearchService } from '../core/services/search.service';
import { ProfileService } from '../core/services/profile.service';  // Добавляем сервис для профиля
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./search.component.css'],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  query = '';
  results: any = { users: [], posts: [] };

  constructor(
    private searchService: SearchService,
    private profileService: ProfileService  // Используем профиль сервис
  ) {}

  ngOnInit(): void {
    this.searchService.getUsers().subscribe(data => {
      const shuffled = data.sort(() => 0.5 - Math.random());
      this.results.users = shuffled.slice(0, 5);
    });
  }

  onSearch() {
    if (this.query.trim()) {
      this.searchService.search(this.query).subscribe(data => {
        this.results = data;
      });
    }
  }

  toggleFollow(user: any): void {
    // Проверяем если пользователь подписан
    if (user.isFollowing) {
      this.profileService.unfollowUser(user.user.username).subscribe(() => {
        user.isFollowing = false;
        user.followers_count--;  
      });
    } else {
      this.profileService.followUser(user.user.username).subscribe(() => {
        user.isFollowing = true;
        user.followers_count++;  
      });
    }
  }
}
