export type Role = "ADMIN" | "CUSTOMER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}
