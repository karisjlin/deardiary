export interface User {
  id: number;
  username: string;
  email: string;
  bio: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  community: string[];
  created_at: string;
  author_id: number;
  author_username: string;
  likes_count: number;
  favourites_count: number;
  comments_count: number;
  liked_by_me: boolean;
  favourited_by_me: boolean;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  author_username: string;
  body: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
