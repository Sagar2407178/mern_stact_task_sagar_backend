import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";
import { RegisterInput, LoginInput } from "../validations/auth.validation";

export class AuthService {
  static async register(data: RegisterInput) {
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  static async login(data: LoginInput) {
    const user = await User.findOne({ where: { email: data.email } });
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  private static generateToken(userId: string): string {
    return jwt.sign({ id: userId }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
  }
}
