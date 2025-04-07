import { createUser, loginUser } from "services/userService";
import { Request, Response, NextFunction } from "express";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password, role } = req.body;
    if (!email || !username || !password || !role) {
      res.status(400).json({
        errorCode: 1,
        message: "vui lòng điền đầy đủ thông tin",
      });
    }
    const newUser = await createUser({ email, username, password, role });
    res.status(201).json({
      message: "User created successfully",
      data: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await loginUser(username, password);

    res.json({
      message: "Đăng nhập thành công",
      data: { user, token },
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
