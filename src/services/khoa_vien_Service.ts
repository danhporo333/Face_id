import { prisma } from "config/client";

interface IKhoaVien {
  tenkv: string;
  dtkv?: string;
  diaChi?: string;
}

export const findKhoaVienByName = async (tenkv: string) => {
  const khoavien = await prisma.khoaVien.findFirst({
    where: {
      tenkv: {
        equals: tenkv,
      },
    },
  });
  return khoavien;
};

export const createKhoaVien = async (khoaVien: IKhoaVien) => {
  // Kiểm tra xem khoa viện đã tồn tại chưa
  const existingKhoaVien = await findKhoaVienByName(khoaVien.tenkv);
  if (existingKhoaVien) {
    throw new Error("Khoa viện đã tồn tại");
  }
  // Tạo mới khoa viện
  const khoavien = await prisma.khoaVien.create({
    data: {
      tenkv: khoaVien.tenkv,
      dtkv: khoaVien.dtkv,
      diaChi: khoaVien.diaChi,
    },
  });
  return khoavien;
};

export const getAllKhoaVien = async () => {
  const khoavien = await prisma.khoaVien.findMany({
    include: {
      lop: true,
    },
  });
  return khoavien;
};

export const updateKhoaVien = async (makv: string, khoavien: IKhoaVien) => {
  // Kiểm tra xem khoa viện có tồn tại không
  const existingKhoaVien = await prisma.khoaVien.findUnique({
    where: { makv },
  });

  if (!existingKhoaVien) {
    throw new Error("Khoa viện không tồn tại");
  }

  // Kiểm tra xem tên mới có bị trùng với khoa viện khác không
  if (khoavien.tenkv !== existingKhoaVien.tenkv) {
    const duplicateKhoaVien = await prisma.khoaVien.findFirst({
      where: {
        tenkv: khoavien.tenkv,
        makv: { not: makv },
      },
    });

    if (duplicateKhoaVien) {
      throw new Error("Tên khoa viện đã tồn tại");
    }
  }

  // Cập nhật thông tin khoa viện
  const updatedKhoaVien = await prisma.khoaVien.update({
    where: { makv },
    data: {
      tenkv: khoavien.tenkv,
      dtkv: khoavien.dtkv,
      diaChi: khoavien.diaChi,
    },
    include: {
      lop: true, // Bao gồm thông tin các lớp thuộc khoa viện
    },
  });

  return updatedKhoaVien;
};

export const deleteKhoaVien = async (makv: string) => {
  const deletedKhoaVien = await prisma.khoaVien.delete({
    where: { makv: makv },
  });
  return deletedKhoaVien;
};
