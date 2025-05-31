import { prisma } from "config/client";
import { paginate } from "utils/paginate";

interface IMonHoc {
  tenmh: string;
  tclt: number;
  tcth: number;
}

export const createMonHoc = async (monhoc: IMonHoc) => {
  // Kiểm tra xem môn học đã tồn tại chưa
  const existingSubject = await prisma.monHoc.findFirst({
    where: {
      tenmh: monhoc.tenmh,
    },
  });

  if (existingSubject) {
    throw new Error("Môn học đã tồn tại");
  }

  // Tạo mới môn học
  const newSubject = await prisma.monHoc.create({
    data: {
      tenmh: monhoc.tenmh,
      tclt: monhoc.tclt,
      tcth: monhoc.tcth,
    },
  });
  return newSubject;
};

export const getAllMonHoc = async (page: number, pageSize: number) => {
  // const subjects = await prisma.monHoc.findMany({
  //   include: {
  //     tkb: true,
  //   },
  // });
  // return subjects;
  return paginate(prisma.monHoc, page, pageSize, { tkb: true });
};

export const updateMonHoc = async (mamh: string, monhoc: Partial<IMonHoc>) => {
  // Kiểm tra xem môn học có tồn tại không
  const existingSubject = await prisma.monHoc.findUnique({
    where: { mamh },
  });

  if (!existingSubject) {
    throw new Error("Môn học không tồn tại");
  }

  const updatedSubject = await prisma.monHoc.update({
    where: { mamh },
    data: {
      tenmh: monhoc.tenmh,
      tclt: monhoc.tclt,
      tcth: monhoc.tcth,
    },
    include: {
      tkb: true,
    },
  });

  return updatedSubject;
};

export const deleteMonHoc = async (mamh: string) => {
  // Kiểm tra xem môn học có tồn tại không
  const existingSubject = await prisma.monHoc.findUnique({
    where: { mamh },
  });

  if (!existingSubject) {
    throw new Error("Môn học không tồn tại");
  }

  const deletedSubject = await prisma.monHoc.delete({
    where: { mamh },
    include: {
      tkb: true,
    },
  });

  return deletedSubject;
};

export const findMonHocByName = async (tenmh: string) => {
  const monhoc = await prisma.monHoc.findFirst({
    where: {
      tenmh: {
        equals: tenmh,
      },
    },
  });
  return monhoc;
};
