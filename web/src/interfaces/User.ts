export type Role = "ADMIN" | "CUSTOMER";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}
