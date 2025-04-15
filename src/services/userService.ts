import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "config/client";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface IUser {
  email: string;
  username: string;
  password: string;
  role?: Role;
  mssv?: string;
  mgv?: string;
}

export const createUser = async (user: IUser) => {
  // Kiểm tra sinh viên/giảng viên tồn tại
  if (user.mssv) {
    const sinhVien = await prisma.sV.findUnique({
      where: { mssv: user.mssv },
      include: { user: true },
    });

    if (!sinhVien) {
      throw new Error("Sinh viên không tồn tại");
    }
    if (sinhVien.user) {
      throw new Error("Sinh viên đã có tài khoản");
    }
  }

  if (user.mgv) {
    const giangVien = await prisma.gV.findUnique({
      where: { mgv: user.mgv },
      include: { user: true },
    });

    if (!giangVien) {
      throw new Error("Giảng viên không tồn tại");
    }
    if (giangVien.user) {
      throw new Error("Giảng viên đã có tài khoản");
    }
  }

  // Tự động gán role dựa vào mssv/mgv
  let role: Role = "ADMIN";
  if (user.mssv) role = "STUDENT";
  if (user.mgv) role = "TEACHER";

  const hashedPassword = await bcrypt.hash(user.password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      username: user.username,
      password: hashedPassword,
      role: role,
      mssv: user.mssv,
      mgv: user.mgv,
    },
    include: {
      sinhVien: true,
      giangVien: true,
    },
  });

  return newUser;
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: {
      sinhVien: true,
      giangVien: true,
    },
  });
  return users;
};

export const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("Người dùng không tồn tại");
  }

  const deleteuser = await prisma.user.delete({
    where: { id },
  });

  return deleteuser;
};

export const loginUser = async (username: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: { username },
    include: {
      sinhVien: true,
      giangVien: true,
    },
  });

  if (!user) {
    throw new Error("Tài khoản không tồn tại");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("Mật khẩu không đúng");
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "24h",
  });

  return { user, token };
};
