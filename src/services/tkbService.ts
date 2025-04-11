import { prisma } from "config/client";

interface ITKB {
  thu: string;
  ngay: Date;
  tietBD: number;
  tietKT: number;
  mamh: string;
  mgv: string;
  sop: string;
}

export const createTKB = async (tkb: ITKB) => {
  // Kiểm tra môn học tồn tại
  const monHoc = await prisma.monHoc.findUnique({
    where: { mamh: tkb.mamh },
  });
  if (!monHoc) {
    throw new Error("Môn học không tồn tại");
  }

  // Kiểm tra giảng viên tồn tại
  const giangVien = await prisma.gV.findUnique({
    where: { mgv: tkb.mgv },
  });
  if (!giangVien) {
    throw new Error("Giảng viên không tồn tại");
  }

  // Kiểm tra phòng tồn tại
  const phong = await prisma.phong.findUnique({
    where: { sop: tkb.sop },
  });
  if (!phong) {
    throw new Error("Phòng học không tồn tại");
  }

  // Kiểm tra trùng lịch
  const existingTKB = await prisma.tKB.findFirst({
    where: {
      ngay: tkb.ngay,
      thu: tkb.thu,
      AND: [
        {
          OR: [
            {
              AND: [
                { tietBD: { lte: tkb.tietBD } },
                { tietKT: { gte: tkb.tietBD } },
              ],
            },
            {
              AND: [
                { tietBD: { lte: tkb.tietKT } },
                { tietKT: { gte: tkb.tietKT } },
              ],
            },
          ],
        },
        {
          OR: [{ sop: tkb.sop }, { mgv: tkb.mgv }],
        },
      ],
    },
  });

  if (existingTKB) {
    throw new Error("Thời gian này đã có lịch học");
  }

  // Tạo TKB mới
  const newTKB = await prisma.tKB.create({
    data: {
      thu: tkb.thu,
      ngay: tkb.ngay,
      tietBD: tkb.tietBD,
      tietKT: tkb.tietKT,
      mamh: tkb.mamh,
      mgv: tkb.mgv,
      sop: tkb.sop,
    },
    include: {
      monHoc: true,
      giangVien: true,
      phong: true,
      diemDanh: true,
    },
  });

  return newTKB;
};

export const getAllTKB = async () => {
  const tkbs = await prisma.tKB.findMany({
    include: {
      monHoc: true,
      giangVien: true,
      phong: true,
      diemDanh: true,
    },
  });
  return tkbs;
};

export const updateTKB = async (id: string, tkb: Partial<ITKB>) => {
  // Kiểm tra TKB tồn tại
  const existingTKB = await prisma.tKB.findUnique({
    where: { id },
  });
  if (!existingTKB) {
    throw new Error("Thời khóa biểu không tồn tại");
  }

  // Kiểm tra môn học nếu được cập nhật
  if (tkb.mamh) {
    const monHoc = await prisma.monHoc.findUnique({
      where: { mamh: tkb.mamh },
    });
    if (!monHoc) {
      throw new Error("Môn học không tồn tại");
    }
  }

  // Kiểm tra giảng viên nếu được cập nhật
  if (tkb.mgv) {
    const giangVien = await prisma.gV.findUnique({
      where: { mgv: tkb.mgv },
    });
    if (!giangVien) {
      throw new Error("Giảng viên không tồn tại");
    }
  }

  // Kiểm tra phòng nếu được cập nhật
  if (tkb.sop) {
    const phong = await prisma.phong.findUnique({
      where: { sop: tkb.sop },
    });
    if (!phong) {
      throw new Error("Phòng học không tồn tại");
    }
  }

  // Cập nhật TKB
  const updatedTKB = await prisma.tKB.update({
    where: { id },
    data: {
      thu: tkb.thu,
      ngay: tkb.ngay,
      tietBD: tkb.tietBD,
      tietKT: tkb.tietKT,
      mamh: tkb.mamh,
      mgv: tkb.mgv,
      sop: tkb.sop,
    },
    include: {
      monHoc: true,
      giangVien: true,
      phong: true,
      diemDanh: true,
    },
  });

  return updatedTKB;
};

export const deleteTKB = async (id: string) => {
  // Kiểm tra TKB tồn tại
  const existingTKB = await prisma.tKB.findUnique({
    where: { id },
  });
  if (!existingTKB) {
    throw new Error("Thời khóa biểu không tồn tại");
  }

  // Xóa TKB
  const deletedTKB = await prisma.tKB.delete({
    where: { id },
    include: {
      monHoc: true,
      giangVien: true,
      phong: true,
      diemDanh: true,
    },
  });

  return deletedTKB;
};
