import { ICurrentUser } from './ICurrentUser';
import { IComment } from './IComment';

export interface IData {
  currentUser: ICurrentUser;
  comments: IComment[];
}
