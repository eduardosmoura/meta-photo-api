import { User } from './user.entity';

export interface Album {
  id: number;
  title: string;
  userId: number;
  user?: User;
}
