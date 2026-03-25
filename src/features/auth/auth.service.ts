import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { redis } from '../../config/redis';
import { env } from '../../config/env';
import { RegisterInput, LoginInput } from './auth.schema';
import { JwtPayload } from '../../middleware/auth.middleware';
import * as authRepository from './auth.repository';

const SALT_ROUNDS = 12;

const generateTokens = (userId: string): { accessToken: string; refreshToken: string } => {
  const jti = uuidv4();
  const accessToken = jwt.sign(
    { sub: userId, jti } as JwtPayload,
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );
  const refreshToken = jwt.sign(
    { sub: userId, jti: uuidv4() },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );
  return { accessToken, refreshToken };
};

export const register = async (input: RegisterInput) => {
  const hashedPassword = await bcrypt.hash(input.contraseña, SALT_ROUNDS);
  const user = await authRepository.insertUsuario(input, hashedPassword);
  const tokens = generateTokens(user.id);
  return { user, ...tokens };
};

export const login = async (input: LoginInput) => {
  const user = await authRepository.findUsuarioByCorreo(input.correo);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const passwordMatch = await bcrypt.compare(input.contraseña, user.contraseña);
  if (!passwordMatch) {
    throw new Error('Invalid credentials');
  }

  await authRepository.insertLogLogin(user.correo);

  const tokens = generateTokens(user.id);
  const { contraseña: _, ...safeUser } = user;
  return { user: safeUser, ...tokens };
};

export const logout = async (token: string): Promise<void> => {
  const payload = jwt.decode(token) as JwtPayload;
  if (payload?.jti && payload?.exp) {
    const ttl = payload.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await redis.set(`blacklist:${payload.jti}`, '1', 'EX', ttl);
    }
  }
};

export const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string }> => {
  let payload: JwtPayload;
  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;
  } catch {
    throw new Error('Invalid refresh token');
  }

  const jti = uuidv4();
  const accessToken = jwt.sign(
    { sub: payload.sub, jti } as JwtPayload,
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );
  return { accessToken };
};
