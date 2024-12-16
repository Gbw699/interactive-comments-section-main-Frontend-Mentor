import { ICurrentUser } from './ICurrentUser';
import { IComments } from './IComments';

export interface IData {
  currentUser: ICurrentUser;
  comments: IComments[];
}
