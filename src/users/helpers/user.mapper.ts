import { UserDBType } from '../users.types';

export const userMapper = {
  returnForGame(user: UserDBType) {
    return {
      id: user.userId,
      login: user.login,
    };
  },
};
