import { prisma } from "config/client";
import { paginate } from "utils/paginate";

interface ITeacher {
  hoGV: string;
  tenGV: string;
  dt_gv?: string;
  donVi?: string;
}

export const createTeacher = async (teacher: ITeacher) => {
  try {
    // Kiểm tra xem giảng viên đã tồn tại chưa
    const existingTeacher = await prisma.gV.findFirst({
      where: {
        tenGV: teacher.tenGV,
      },
    });

    if (existingTeacher) {
      throw new Error("Giảng viên đã tồn tại");
    }

    // Tạo mới giảng viên
    const newTeacher = await prisma.gV.create({
      data: {
        hoGV: teacher.hoGV,
        tenGV: teacher.tenGV,
        dt_gv: teacher.dt_gv,
        donVi: teacher.donVi,
      },
    });
    return newTeacher;
  } catch (error) {
    throw new Error("Không thể tạo giảng viên mới hoặc giảng viên đã tồn tại");
  }
};

export const getAllTeachers = async (page: number, pageSize: number) => {
  try {
    // const teachers = await prisma.gV.findMany({
    //   include: {
    //     tkb: true,
    //     user: true,
    //   },
    // });
    // return teachers;
    return paginate(prisma.gV, page, pageSize, { tkb: true, user: true });
  } catch (error) {
    throw new Error("Không thể lấy danh sách giảng viên");
  }
};

export const updateTeacher = async (
  mgv: string,
  teacher: Partial<ITeacher>
) => {
  try {
    const existingTeacher = await prisma.gV.findUnique({
      where: { mgv },
    });

    if (!existingTeacher) {
      throw new Error("Giảng viên không tồn tại");
    }

    const updatedTeacher = await prisma.gV.update({
      where: { mgv },
      data: {
        hoGV: teacher.hoGV,
        tenGV: teacher.tenGV,
        dt_gv: teacher.dt_gv,
        donVi: teacher.donVi,
      },
      include: {
        tkb: true,
        user: true,
      },
    });
    return updatedTeacher;
  } catch (error) {
    throw error;
  }
};

export const deleteTeacher = async (mgv: string) => {
  try {
    const existingTeacher = await prisma.gV.findUnique({
      where: { mgv },
    });

    if (!existingTeacher) {
      throw new Error("Giảng viên không tồn tại");
    }

    const deletedTeacher = await prisma.gV.delete({
      where: { mgv },
      include: {
        tkb: true,
        user: true,
      },
    });
    return deletedTeacher;
  } catch (error) {
    throw error;
  }
};

export const findTeacherByName = async (tenGV: string) => {
  const name = await prisma.gV.findFirst({
    where: {
      tenGV: {
        equals: tenGV,
      },
    },
  });
  return name;
};
