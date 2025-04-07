import { prisma } from "config/client";

interface IStudent {
  malop: string;
  holot: string;
  ten: string;
  ntns: Date;
  phai: string;
  dt_sv?: string;
  emailSV?: string;
  faceID?: string;
}

export const createStudent = async (student: IStudent) => {
  // kiểm tra xem lớp có tồn tại không
  const lop = await prisma.lop.findUnique({
    where: { malop: student.malop },
  });

  if (!lop) {
    throw new Error("Lớp không tồn tại");
  }
  // tạo sinh viên mới
  const newStudent = await prisma.sV.create({
    data: {
      malop: student.malop,
      holot: student.holot,
      ten: student.ten,
      ntns: student.ntns,
      phai: student.phai,
      dt_sv: student.dt_sv,
      emailSV: student.emailSV,
      faceID: student.faceID,
    },
    include: {
      lop: {
        include: {
          khoaVien: true,
        },
      },
    },
  });
  return newStudent;
};

export const getAllStudents = async () => {
  const students = await prisma.sV.findMany({
    include: {
      lop: {
        include: {
          khoaVien: true,
        },
      },
      diemDanh: true,
    },
    orderBy: {
      malop: "asc",
    },
  });
  return students;
};

export const updateStudent = async (
  mssv: string,
  student: Partial<IStudent>
) => {
  // kiểm tra xem sinh viên có tồn tại không
  const existingStudent = await prisma.sV.findUnique({
    where: { mssv },
  });

  if (!existingStudent) {
    throw new Error("Sinh viên không tồn tại");
  }

  // kiem tra xem lớp có tồn tại không
  if (student.malop) {
    const lop = await prisma.lop.findUnique({
      where: { malop: student.malop },
    });

    if (!lop) {
      throw new Error("Lớp không tồn tại");
    }
  }
  // cập nhật sinh viên
  const updatedStudent = await prisma.sV.update({
    where: { mssv },
    data: {
      malop: student.malop,
      holot: student.holot,
      ten: student.ten,
      ntns: student.ntns,
      phai: student.phai,
      dt_sv: student.dt_sv,
      emailSV: student.emailSV,
      faceID: student.faceID,
    },
    include: {
      lop: {
        include: {
          khoaVien: true,
        },
      },
    },
  });

  return updatedStudent;
};
