export type UserResponseDto = {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string | null;
  readonly email: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};
