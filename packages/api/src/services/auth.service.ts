import { client } from '@/database';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';

const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: user.id };
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
export class AuthService {
  public async login(userData: User): Promise<{ cookie: string; findUser: User }> {
    const { rows } = await client.query('SELECT * FROM users WHERE email = $1', [userData.email]);
    if (rows.length === 0) throw new HttpException(409, `The email ${userData.email} was not found`);

    const findUser: User = rows[0];

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    const { rows } = await client.query('SELECT * FROM users WHERE email = $1', [userData.email]);
    if (rows.length === 0) throw new HttpException(409, `The email ${userData.email} was not found`);

    return rows[0];
  }
}
