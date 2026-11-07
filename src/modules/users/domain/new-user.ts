export type NewUser = {
  readonly firstName: string;
  readonly lastName: string | null;
  readonly email: string;
  readonly passwordHash: string | null;
  readonly groupId?: string;
};
