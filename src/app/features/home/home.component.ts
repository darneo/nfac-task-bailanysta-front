import { Component } from '@angular/core';
import { Post } from '../../core/models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Block } from '@angular/compiler';
import { PostsService } from '../../core/services/posts.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule , RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  
})
export class HomeComponent {
  posts!: Post[];  
  loaded:boolean = false; 
  selectedPostId: number | null = null;
  commentContent: string = '';
  showCommentModal: boolean = false;
  currentPost: any = null;
  
  constructor(private postService:PostsService){

  }
  ngOnInit() : void{
    this.getPosts()
  }
  getPosts(){
    this.postService.getPosts().subscribe((posts) => {
      this.posts = posts; 
      this.loaded = true ;
    })
  }  
  
  toggleLike(post: Post): void {
    if (post.is_liked) {
      this.postService.unlikePost(post.id).subscribe(() => {
        post.is_liked = false;
      });
    } else {
      this.postService.likePost(post.id).subscribe(() => {
        post.is_liked = true;
      });
    }
  }

  toggleCommentModal(postId: number): void {
    const found = this.posts.find(p => p.id === postId);
    if (found) {
      this.currentPost = found;
      this.commentContent = '';
      this.selectedPostId = postId;
      this.showCommentModal = true;

      setTimeout(() => {
        const modal = document.querySelector('.modal-content') as HTMLElement;
        if (modal) {
          modal.classList.remove('hide');
          modal.classList.add('show');
        }
      }, 10);
    }
  }
  
  
  closeCommentModal(): void {
    const modal = document.querySelector('.modal-content') as HTMLElement;
    if (modal) {
      modal.classList.remove('show');
      modal.classList.add('hide');
    }
    setTimeout(() => {
      this.showCommentModal = false;
      this.currentPost = null;
    }, 300); 
  }
  
  
  submitComment(): void {
    if (this.selectedPostId && this.commentContent.trim()) {
      this.postService.addComment(this.selectedPostId, this.commentContent).subscribe(() => {
        this.closeCommentModal();
      });
    }
  }

  
}
  
