export type BreedType = { name: string; subBreeds: string[] };
export type BreedsAPIResponse = Record<string, string[]>;

export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
};

export type AuthResponse = User & {
  accessToken: string;
  refreshToken: string;
};