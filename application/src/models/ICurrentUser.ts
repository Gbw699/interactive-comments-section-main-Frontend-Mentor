export interface ICurrentUser {
  currentUser: CurrentUser;
}

interface CurrentUser {
  image: Image;
  username: string;
}

interface Image {
  png: string;
  webp: string;
}
