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
  const updatedKhoaVien = await prisma.khoaVien.update({
    where: { makv: makv },
    data: {
      tenkv: khoavien.tenkv,
      dtkv: khoavien.dtkv,
      diaChi: khoavien.diaChi,
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
