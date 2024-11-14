import { Role } from "../../../models";

export interface EditUserDto {
  cpf: string;
  newData: {
    name: string;
    password: string;
    role: Role;
    active: boolean;
    accessExpiration: Date;
  };
}
