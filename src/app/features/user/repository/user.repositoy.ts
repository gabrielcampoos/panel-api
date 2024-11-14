import { DatabaseConnection } from "../../../../main/database/typeorm.connection";
import { UserEntity } from "../../../shared/entities";
import { User } from "../../../models";
import { CreateUserDto, UpdateUserDto } from "../dto";

export class UserRepository {
  private _manager = DatabaseConnection.connection.manager;

  public async checkIfUserExistsById(
    userId: string
  ): Promise<UserEntity | null> {
    const user = await this._manager.findOne(UserEntity, {
      where: { id: userId },
    });
    return user;
  }

  public async checkIfUserExistsByCpf(cpf: string): Promise<User | null> {
    const existingUser = await this._manager.findOneBy(UserEntity, { cpf });

    if (!existingUser) return null;

    return this.entityToModel(existingUser);
  }

  public async register(user: CreateUserDto): Promise<User> {
    const userToCreate = this._manager.create(UserEntity, {
      ...user,
      id: undefined,
      accessExpiration: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    });

    const createdUser = await this._manager.save(userToCreate);

    const userModel = this.entityToModel(createdUser);

    userModel.checkExpiration();

    return userModel;
  }

  public async listUsers(): Promise<User[]> {
    const userList = await this._manager.find(UserEntity);

    return userList.map((u) => {
      const userModel = this.entityToModel(u);

      userModel.checkExpiration();

      return userModel;
    });
  }

  public async editUser(data: UpdateUserDto): Promise<User | null> {
    const { name, cpf, password, role, active, accessExpiration } = data;

    const result = await this._manager.update(
      UserEntity,
      { cpf },
      {
        name,
        cpf,
        password,
        role,
        active,
        accessExpiration,
      }
    );

    if (result.affected === 0) {
      return null;
    }

    const updatedUserEntity = await this._manager.findOneBy(UserEntity, {
      cpf,
    });

    if (updatedUserEntity) {
      const userModel = this.entityToModel(updatedUserEntity);

      userModel.checkExpiration();

      return userModel;
    }

    return null;
  }

  public async deleteUser(cpf: string): Promise<void> {
    const result = await this._manager.delete(UserEntity, { cpf });

    if (result.affected === 0) {
      throw new Error(`Failed to delete user with ID ${cpf}`);
    }
  }

  private entityToModel(dataFromDB: UserEntity): User {
    return new User(
      dataFromDB.id,
      dataFromDB.name,
      dataFromDB.cpf,
      dataFromDB.password,
      dataFromDB.role || "user",
      dataFromDB.active ?? true,
      dataFromDB.accessExpiration
    );
  }
}
