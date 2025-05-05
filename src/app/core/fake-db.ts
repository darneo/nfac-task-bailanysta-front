import { Post } from "./models";

export const POSTS : Post[] = [];
    
for (let i = 1; i <= 10; i++) {
    POSTS.push({
      id: i,
      user: {
        id: i % 5 + 1,
        username: `user${i % 5 + 1}`,
        email: `user${i % 5 + 1}@example.com`
      },
      content: `This is a post by user${i % 5 + 1} number ${i}.`,
      created_at: new Date(2025, 3, i).toISOString() // месяц 3 = апрель
    });
  }