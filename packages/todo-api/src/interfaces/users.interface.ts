export interface User {
  id?: number;
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
