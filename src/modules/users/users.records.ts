export type UserRecord = {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string | null;
  readonly email: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly groupMembership: { readonly groupId: string } | null;
};
