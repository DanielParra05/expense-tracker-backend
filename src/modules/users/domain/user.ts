export type User = {
  readonly id: string;
  readonly groupId: string;
  readonly firstName: string;
  readonly lastName: string | null;
  readonly email: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};
