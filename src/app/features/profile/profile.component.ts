import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PostsService } from '../../core/services/posts.service';
import { ProfileService } from '../../core/services/profile.service';
import { Profile } from '../../core/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string | null = null;
  profile!: Profile;
  posts: any[] = [];
  editingProfile: boolean = false;
  editedProfile: any = {};
  selectedAvatarFile: File | null = null;
  isOwner: boolean = false;
  isFollowing: boolean = false;
  avatarPreview: string | null = null;  // Добавление для предпросмотра аватара

  constructor(
    private profileService: ProfileService,
    private postsService: PostsService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    const loggedInUsername = localStorage.getItem('username');
  
    if (this.username) {
      this.isOwner = this.username === loggedInUsername; 
      this.getProfile();
      this.getUserPosts();
      this.authService.refreshToken().subscribe();
    }
    if (!this.isOwner) {
      this.checkFollowingStatus();
    }
  }

  getProfile(): void {
    if (this.username) {
      this.profileService.getProfileByUsername(this.username).subscribe(
        profile => {
          this.profile = profile;
        },
        error => {
          console.error('Ошибка при получении профиля:', error);
        }
      );
    }
  }

  getUserPosts(): void {
    if (this.username) {
      this.postsService.getUserPosts(this.username).subscribe(
        posts => {
          this.posts = posts;
        },
        error => {
          console.error('Ошибка при получении постов:', error);
        }
      );
    }
  }

  startProfileEdit(): void {
    this.editingProfile = true;
    this.editedProfile = { ...this.profile };
  }

  cancelProfileEdit(): void {
    this.editingProfile = false;
    this.editedProfile = {};
    this.selectedAvatarFile = null;
    this.avatarPreview = null;  // Сброс предпросмотра
  }

  onAvatarSelected(event: any): void {
    this.selectedAvatarFile = event.target.files[0];
    
    if (this.selectedAvatarFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedAvatarFile);
    }
  }

  saveProfile(): void {
    if (!this.avatarPreview || !this.editedProfile.bio) return;

    const formData = new FormData();
    formData.append('bio', this.editedProfile.bio);
    if (this.selectedAvatarFile) {
      formData.append('avatar', this.selectedAvatarFile);
    }

    this.profileService.updateProfile(this.username, formData).subscribe(updated => {
      this.profile = updated;
      this.editingProfile = false;
    }, error => {
      console.error('Ошибка при сохранении профиля:', error);
    });
  }

  checkFollowingStatus(): void {
    if (this.username) {
      this.profileService.checkIfFollowing(this.username).subscribe(res => {
        this.isFollowing = res.is_following;
      });
    }
  }
  
  toggleFollow(): void {
    if (this.username) {
      if (this.isFollowing) {
        this.profileService.unfollowUser(this.username).subscribe(() => {
          this.isFollowing = false;
          this.profile.followers_count--;
        });
      } else {
        this.profileService.followUser(this.username).subscribe(() => {
          this.isFollowing = true;
          this.profile.followers_count++;
        });
      }
    }
  }

  logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    window.location.href = '/auth';  
  }
}
