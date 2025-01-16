export interface IComment {
  id: number;
  content: string;
  createdAt: Date;
  score: number;
  replyingTo?: string;
  user: User;
  replies: IComment[];
  lastScoreInstruction?: string;
}

interface User {
  image: Image;
  username: string;
}

interface Image {
  png: string;
  webp: string;
}
