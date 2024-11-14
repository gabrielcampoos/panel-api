import { Base } from "./Base";

export interface UserJson {
  id: string;
  name: string;
  cpf: string;
  password: string;
  role: Role;
  active: boolean;
  accessExpiration: Date;
}

export type Role = "admin" | "user";

export class User extends Base {
  constructor(
    _id: string,
    private _name: string,
    private _cpf: string,
    private _password: string,
    private _role: Role = "user",
    private _active: boolean = true,
    private _accessExpiration: Date
  ) {
    super(_id);
    this._active = true;
    this._accessExpiration = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  }

  toJson(): UserJson {
    return {
      id: this._id,
      name: this._name,
      cpf: this._cpf,
      password: this._password,
      role: this._role,
      active: this._active,
      accessExpiration: this._accessExpiration,
    };
  }

  getId(): string {
    return this._id;
  }

  setId(id: string): void {
    this._id = id;
  }

  getName(): string {
    return this._name;
  }

  setName(name: string): void {
    this._name = name;
  }

  getCpf(): string {
    return this._cpf;
  }

  setCpf(cpf: string): void {
    this._cpf = cpf;
  }

  getPassword(): string {
    return this._password;
  }

  setPassword(password: string): void {
    this._password = password;
  }

  getRole(): Role {
    return this._role;
  }

  setRole(role: Role): void {
    this._role = role;
  }

  isActive(): boolean {
    return this._active && new Date() < this._accessExpiration;
  }

  deactivate(): void {
    this._active = false;
  }

  checkExpiration(): void {
    if (new Date() > this._accessExpiration) {
      this._active = false;
    }
  }

  getAccessExpiration(): Date {
    return this._accessExpiration;
  }

  setAccessExpiration(date: Date): void {
    this._accessExpiration = date;
  }
}
