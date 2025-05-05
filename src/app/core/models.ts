export interface User {
    id: number;
    username: string;
    email: string;
  }
  
  export interface Profile {
    id: number;
    user: User;
    bio: string;
    avatar_url: string | null;
    followers_count: number;  
    following_count: number;  
  }
  
  
  export interface Post {
    id: number;
    user: {
      id: number;
      username: string;
    };
    content: string;
    created_at: string;
    comments_count: number;  
    is_liked: boolean; 
  }

  export interface Comment {
    id: number;
    user: User;
    post: number;
    content: string;
    created_at: string;
  }

  export interface AuthModel {
    username : string ; 
    password : string ; 

  }
  export interface Token {
    refresh : string ; 
    access : string ; 
  }