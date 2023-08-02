import { User } from 'src/models/user.model';

export const UserFormatter = (item: any): User => {
  const user: User = {
    userId: item.userId.S,
    name: item.name.S,
    isAdmin: item.admin.BOOL,
    hashedPassword: item.hashedPassword.S,
  };

  return user;
};
