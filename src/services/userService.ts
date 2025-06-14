import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "config/client";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
import { paginate } from "utils/paginate";

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
  if (user.mssv && user.mgv) {
    throw new Error(
      "Chỉ được tạo tài khoản sinh viên hoặc giảng viên, không thể cả hai"
    );
  }
  // Kiểm tra sinh viên tồn tại
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

  // Kiểm tra giảng viên tồn tại
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

export const getAllUsers = async (page: number, pageSize: number) => {
  // const users = await prisma.user.findMany({
  //   include: {
  //     sinhVien: true,
  //     giangVien: true,
  //   },
  // });
  // return users;
  return paginate(prisma.user, page, pageSize, {
    sinhVien: true,
    giangVien: true,
  });
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

  const isValidCredentials =
    user && (await bcrypt.compare(password, user.password));
  if (!isValidCredentials) {
    throw new Error("Thông tin tài khoản không chính xác");
  }

  // Xóa password trước khi trả về
  const { password: _, ...userWithoutPassword } = user;

  let holot, ten, hoGV, tenGV;
  if (user.role === "STUDENT" && user.sinhVien) {
    holot = user.sinhVien.holot;
    ten = user.sinhVien.ten;
  }
  if (user.role === "TEACHER" && user.giangVien) {
    hoGV = user.giangVien.hoGV;
    tenGV = user.giangVien.tenGV;
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      holot,
      ten,
      hoGV,
      tenGV,
    },
    JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );

  return { user: userWithoutPassword, token };
};
