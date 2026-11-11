export type User = {
  readonly id: string;
  readonly groupId: string;
  readonly firstName: string;
  readonly lastName: string | null;
  readonly email: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export type NewUser = {
  readonly firstName: string;
  readonly lastName: string | null;
  readonly email: string;
  readonly passwordHash: string | null;
  readonly groupId?: string;
};

export type NewUserFields = Omit<NewUser, 'groupId'>;

export type UserChanges = {
  readonly firstName?: string;
  readonly lastName?: string | null;
  readonly email?: string;
  readonly groupId?: string;
};

export type UserFields = Omit<UserChanges, 'groupId'>;

export type PasswordCredentials = {
  readonly userId: string;
  readonly passwordHash: string;
};
