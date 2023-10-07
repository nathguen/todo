import { client } from '@/database';
import { HttpException } from '@exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { hash } from 'bcrypt';
import { Service } from 'typedi';

@Service()
export class UserService {
  public async findAllUser(): Promise<User[]> {
    const { rows } = await client.query<User>('SELECT * FROM users');
    const users: User[] = rows;

    return users;
  }

  public async findUserById(userId: number): Promise<User> {
    const { rows } = await client.query<User>('SELECT * FROM users WHERE id = $1', [userId]);

    // if no user found, throw an error
    if (!rows[0]) throw new HttpException(404, "User doesn't exist");

    return rows[0];
  }

  public async createUser(userData: User): Promise<User> {
    // check for existing user
    const { rowCount } = await client.query<User>('SELECT * FROM users WHERE email = $1', [userData.email]);

    // if user found, throw an error
    if (rowCount > 0) throw new HttpException(409, `This email ${userData.email} is already taken`);

    // create new user
    await client.query('BEGIN');

    try {
      const hashedPassword = await hash(userData.password, 10);
      const createUserData: User = { ...userData, password: hashedPassword };

      const { rows } = await client.query(
        'INSERT INTO users (email, username, password, firstName, lastName, avatar) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          createUserData.email,
          createUserData.username,
          createUserData.password,
          createUserData.firstName,
          createUserData.lastName,
          createUserData.avatar,
        ],
      );
      await client.query('COMMIT');

      return rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }

  public async updateUser(userId: number, userData: User): Promise<User> {
    // check for existing user
    const { rows } = await client.query<User>('SELECT * FROM users WHERE id = $1', [userId]);
    if (!rows[0]) throw new HttpException(409, "User doesn't exist");

    // update user
    await client.query('BEGIN');

    try {
      const hashedPassword = await hash(userData.password, 10);
      const updateUserData: User = { ...userData, password: hashedPassword };

      await client.query('UPDATE users SET username = $1, email = $2, password = $3, firstName = $4, lastName = $5, avatar = $6 WHERE id = $7', [
        updateUserData.username,
        updateUserData.email,
        updateUserData.password,
        updateUserData.firstName,
        updateUserData.lastName,
        updateUserData.avatar,
        userId,
      ]);
      await client.query('COMMIT');

      return updateUserData;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }

  public async deleteUser(userId: number): Promise<User> {
    const { rows } = await client.query('SELECT FROM users WHERE id = $1', [userId]);
    if (!rows[0]) throw new HttpException(409, "User doesn't exist");

    const deleteUserData: User = rows[0];

    await client.query('BEGIN');

    try {
      await client.query('DELETE FROM users WHERE id = $1', [userId]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }

    return deleteUserData;
  }
}
