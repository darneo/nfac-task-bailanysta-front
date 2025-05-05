import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Post } from '../../core/models';
import { PostsService } from '../../core/services/posts.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-detail',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post!: Post;
  comments: any[] = [];
  loading = true;
  currentUsername: string = localStorage.getItem('username') || '';
  editingPost: boolean = false;
  editedPostContent: string = '';
  showCommentModal: boolean = false;
  commentContent: string = '';
  currentPost: Post | null = null;

  constructor(
    private route: ActivatedRoute,
    private postService: PostsService,
    private router: Router
  ) {}

  isPostAuthor(): boolean {
    return this.post?.user?.username === this.currentUsername;
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPostAndComments(id);
  }

  loadPostAndComments(postId: number): void {
    this.loading = true;
    this.postService.getPostById(postId).subscribe({
      next: (post) => {
        this.post = post;
        this.loadComments(postId);
      }
    });
  }

  loadComments(postId: number): void {
    this.postService.getPostComments(postId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.loading = false;
      }
    });
  }

  submitComment(): void {
    const trimmed = this.commentContent.trim();
    if (!trimmed) return;

    this.postService.addComment(this.post.id, trimmed).subscribe({
      next: (comment) => {
        this.comments.push(comment);
        this.commentContent = '';
      },
      error: (err) => {
        console.error('Ошибка при добавлении комментария', err);
      }
    });
  }

  startEditingPost(): void {
    this.editedPostContent = this.post.content;
    this.editingPost = true;
  }

  cancelEditingPost(): void {
    this.editingPost = false;
    this.editedPostContent = '';
  }

  saveEditedPost(): void {
    const trimmed = this.editedPostContent.trim();
    if (!trimmed) return;

    this.postService.updatePost(this.post.id, trimmed).subscribe({
      next: (updatedPost) => {
        this.post.content = updatedPost.content;
        this.cancelEditingPost();
      },
      error: (err) => {
        console.error('Ошибка при редактировании поста', err);
      }
    });
  }

  deletePost(): void {
    if (!confirm('Удалить пост?')) return;

    this.postService.deletePost(this.post.id).subscribe({
      next: () => {
        alert('Пост удалён');
      },
      error: (err) => {
        console.error('Ошибка при удалении поста', err);
      }
    });
    this.router.navigate(['/profile', this.currentUsername]);
  }

  deleteComment(commentId: number): void {
    if (!confirm('Удалить комментарий?')) return;

    this.postService.deleteComment(this.post.id, commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c.id !== commentId);
      },
      error: (err) => {
        console.error('Ошибка при удалении комментария', err);
      }
    });
  }

  toggleCommentModal(postId: number): void {
    this.showCommentModal = !this.showCommentModal;
    if (this.showCommentModal) {
      this.currentPost = this.post;
    }
  }

  closeCommentModal(): void {
    this.showCommentModal = false;
    this.commentContent = '';
  }

  preventDrag(event: Event) {
    event.preventDefault();
  }
}
