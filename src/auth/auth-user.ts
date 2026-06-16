export type UserRole = 'admin' | 'normal' | 'limited';

export type JwtPayload = {
  sub: number;
  username: string;
  role: UserRole;
};

export type AuthUser = {
  userId: number;
  username: string;
  role: UserRole;
};
