import { prisma } from "config/client";

interface ILop {
  tenlop: string;
  siso: number;
  makv: string;
}

export const findClassByName = async (tenlop: string) => {
  const lop = await prisma.lop.findFirst({
    where: {
      tenlop: {
        equals: tenlop,
      },
    },
  });
  return lop;
};

export const createClass = async (lop: ILop) => {
  const khoaVien = await prisma.khoaVien.findUnique({
    where: { makv: lop.makv },
  });
  if (!khoaVien) {
    throw new Error("Khoa viện không tồn tại");
  }
  // Kiểm tra xem lớp đã tồn tại chưa
  const existingClass = await findClassByName(lop.tenlop);
  if (existingClass) {
    throw new Error("Lớp đã tồn tại");
  }
  // Tạo mới lớp
  const newClass = await prisma.lop.create({
    data: {
      tenlop: lop.tenlop,
      siso: +lop.siso,
      makv: lop.makv,
    },
    include: {
      khoaVien: true,
    },
  });
  return newClass;
};

export const getAllClass = async () => {
  const lop = await prisma.lop.findMany({
    include: {
      khoaVien: true,
    },
  });
  return lop;
};

export const updateClass = async (malop: string, lop: ILop) => {
  const updatedClass = await prisma.lop.update({
    where: { malop: malop },
    data: {
      tenlop: lop.tenlop,
      siso: +lop.siso,
      makv: lop.makv,
    },
  });
  return updatedClass;
};

export const deleteClass = async (malop: string) => {
  const deletedClass = await prisma.lop.delete({
    where: { malop: malop },
  });
  return deletedClass;
};
