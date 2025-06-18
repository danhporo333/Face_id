import {
  createUser,
  loginUser,
  getAllUsers,
  deleteUser,
} from "services/userService";
import { Request, Response, NextFunction } from "express";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password, role, mssv, mgv } = req.body;
    if (!email || !username || !password) {
      res.status(400).json({
        errorCode: 1,
        message: "vui lòng điền đầy đủ thông tin",
      });
    }
    const newUser = await createUser({
      email,
      username,
      password,
      role,
      mssv,
      mgv,
    });
    res.status(201).json({
      message: "User created successfully",
      data: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        sinhvien: newUser.sinhVien,
        giangvien: newUser.giangVien,
      },
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      errorCode: 1,
      message: error.message || "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    //delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

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

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const page = +(req.query.current || 1);
    const pageSize = +(req.query.pageSize || 5);
    const { result: users, total } = await getAllUsers(page, pageSize);
    const pages = Math.ceil(total / pageSize);
    // const userCount = users.length;

    res.status(200).json({
      errorCode: 0,
      message: "Lấy danh sách tài khoản thành công",
      data: {
        meta: {
          current: page,
          pageSize: pageSize,
          pages: pages,
          total: total,
          userCount: users.length,
        },
        users: users,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errorCode: 1,
      message: "Lỗi khi lấy danh sách tài khoản",
    });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUser(id);

    res.status(200).json({
      errorCode: 0,
      message: "Xóa tài khoản thành công",
      data: deletedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errorCode: 1,
      message: "Lỗi khi xóa tài khoản",
    });
  }
};
