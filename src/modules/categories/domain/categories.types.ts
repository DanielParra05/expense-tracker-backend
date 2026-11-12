export type Category = {
  readonly id: string;
  readonly groupId: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export type NewCategory = {
  readonly groupId: string;
  readonly name: string;
};

export type CategoryChanges = {
  readonly name?: string;
};
