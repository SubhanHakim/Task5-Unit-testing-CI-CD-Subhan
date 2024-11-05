import { Request, Response } from 'express';
import {User, IUser} from '../models/auth.models';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface SignInRequest {
  name: string;
  password: string;
}

export const signin = async (
  req: Request<{}, {}, SignInRequest>, 
  res: Response
): Promise<Response> => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .json({ message: "Name dan password harus diisi!" });
    }

    const user: IUser | null = await User.findOne({ name });
    if (!user) {
      return res.status(401).json({ message: "user not found!" });
    }

    const isPasswordValid: boolean = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password!" });
    }

    const token: string = jwt.sign(
      { user: user.name }, 
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3600000,
      sameSite: "strict",
    });

    return res
      .header("Authorization", `Bearer ${token}`)
      .status(200)
      .json({ message: "Login Success!" });
      
  } catch (error) {
    return res
      .status(400)
      .json({ 
        message: "Login error", 
        error: 'Database error'
      });
  }
};
