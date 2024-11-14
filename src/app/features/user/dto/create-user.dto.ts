import { Role } from "../../../models";

export interface CreateUserDto {
  name: string;
  cpf: string;
  password: string;
  role: Role;
  active: boolean;
  accessExpiration: Date;
}
