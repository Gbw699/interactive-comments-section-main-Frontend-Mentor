export interface IComment {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  replyingTo?: string;
  user: User;
  replies?: IComment[];
}

interface User {
  image: Image;
  username: string;
}

interface Image {
  png: string;
  webp: string;
}
