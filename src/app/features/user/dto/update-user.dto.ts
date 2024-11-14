import { Role } from "../../../models";

export interface UpdateUserDto {
  cpf: string;
  name: string;
  password: string;
  role: Role;
  active: boolean;
  accessExpiration: Date;
}
