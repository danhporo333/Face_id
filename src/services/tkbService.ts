import { prisma } from "config/client";
import { paginate } from "utils/paginate";

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

export const getAllTKB = async (page: number, pageSize: number) => {
  // const tkbs = await prisma.tKB.findMany({
  //   include: {
  //     monHoc: true,
  //     giangVien: true,
  //     phong: true,
  //     diemDanh: true,
  //   },
  // });
  // return tkbs;
  return paginate(prisma.tKB, page, pageSize, {
    monHoc: true,
    giangVien: true,
    phong: true,
    diemDanh: true,
  });
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

export const getTKBByStudentId = async (mssv: string) => {
  // Kiểm tra sinh viên tồn tại
  const student = await prisma.sV.findUnique({
    where: { mssv },
  });
  if (!student) {
    throw new Error("Sinh viên không tồn tại");
  }

  // Lấy thông tin lớp của sinh viên
  const studentWithClass = await prisma.sV.findUnique({
    where: { mssv },
    include: {
      lop: true,
    },
  });

  // Lấy tất cả TKB có liên quan đến sinh viên này (qua bảng DiemDanh)
  const tkbs = await prisma.tKB.findMany({
    where: {
      diemDanh: {
        some: {
          mssv: mssv,
        },
      },
    },
    include: {
      monHoc: true,
      giangVien: true,
      phong: true,
      diemDanh: {
        where: {
          mssv: mssv,
        },
      },
    },
    orderBy: [{ ngay: "asc" }, { tietBD: "asc" }],
  });
  return {
    student: {
      mssv: student.mssv,
      holot: student.holot,
      ten: student.ten,
      lop: studentWithClass?.lop?.tenlop || "N/A",
    },
    tkbs: tkbs,
  };
};

export const ganSinhVienVaoTKB = async (mssv: string, tkbId: string) => {
  // Kiểm tra sinh viên có tồn tại không
  const sinhVien = await prisma.sV.findUnique({
    where: { mssv },
  });

  if (!sinhVien) {
    throw new Error("Sinh viên không tồn tại");
  }

  // Kiểm tra TKB có tồn tại không
  const tkb = await prisma.tKB.findUnique({
    where: { id: tkbId },
  });

  if (!tkb) {
    throw new Error("Thời khóa biểu không tồn tại");
  }

  // Kiểm tra sinh viên đã được gán vào TKB này chưa
  const diemDanhDaTonTai = await prisma.diemDanh.findUnique({
    where: {
      mssv_id: {
        mssv: mssv,
        id: tkbId,
      },
    },
  });

  if (diemDanhDaTonTai) {
    throw new Error("Sinh viên đã được gán vào thời khóa biểu này");
  }

  // Tạo bản ghi điểm danh (với giá trị mặc định)
  const diemDanh = await prisma.diemDanh.create({
    data: {
      mssv: mssv,
      id: tkbId,
      coMat: false,
      diTre: false,
    },
    include: {
      sinhVien: true,
      tkb: {
        include: {
          monHoc: true,
          giangVien: true,
          phong: true,
        },
      },
    },
  });

  return diemDanh;
};

//chức năng gán nhiều sinh viên vào TKB
export const ganLopVaoTKB = async (maLop: string, tkbId: string) => {
  // Kiểm tra lớp có tồn tại không
  const lop = await prisma.lop.findUnique({
    where: { malop: maLop },
    include: {
      sinhVien: true,
    },
  });

  if (!lop) {
    throw new Error("Lớp không tồn tại");
  }

  // Kiểm tra TKB có tồn tại không
  const tkb = await prisma.tKB.findUnique({
    where: { id: tkbId },
  });

  if (!tkb) {
    throw new Error("Thời khóa biểu không tồn tại");
  }

  // Lấy tất cả sinh viên trong lớp
  const danhSachSinhVien = lop.sinhVien;

  if (danhSachSinhVien.length === 0) {
    throw new Error("Lớp không có sinh viên nào");
  }

  // Tạo bản ghi điểm danh cho tất cả sinh viên
  const ketQua = [];
  for (const sinhVien of danhSachSinhVien) {
    // Kiểm tra bản ghi đã tồn tại chưa
    const diemDanhDaTonTai = await prisma.diemDanh.findUnique({
      where: {
        mssv_id: {
          mssv: sinhVien.mssv,
          id: tkbId,
        },
      },
    });

    if (!diemDanhDaTonTai) {
      const diemDanh = await prisma.diemDanh.create({
        data: {
          mssv: sinhVien.mssv,
          id: tkbId,
          coMat: false,
          diTre: false,
        },
      });
      ketQua.push(diemDanh);
    }
  }

  return {
    tongSoSinhVien: danhSachSinhVien.length,
    soSinhVienDaGan: ketQua.length,
    thongBao: `Đã gán ${ketQua.length} sinh viên vào thời khóa biểu`,
  };
};

export const getTKBByUserId = async (userId: string) => {
  // Lấy thông tin người dùng kèm theo quan hệ với sinh viên
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      sinhVien: true,
    },
  });

  if (!user) {
    throw new Error("Không tìm thấy người dùng");
  }

  // Kiểm tra xem người dùng có phải là sinh viên không
  if (user.role !== "STUDENT" || !user.sinhVien) {
    throw new Error("Người dùng không phải là sinh viên");
  }

  // Sử dụng hàm hiện có để lấy thời khóa biểu của sinh viên
  return getTKBByStudentId(user.sinhVien.mssv);
};
// export const getCompleteStudentSchedule = async (mssv: string) => {
//   // Kiểm tra sinh viên có tồn tại không
//   const student = await prisma.sV.findUnique({
//     where: { mssv },
//     include: {
//       lop: {
//         include: {
//           khoaVien: true
//         }
//       },
//       diemDanh: {
//         include: {
//           tkb: {
//             include: {
//               monHoc: true,
//               giangVien: true,
//               phong: true
//             }
//           }
//         }
//       }
//     }
//   });

//   if (!student) {
//     throw new Error("Sinh viên không tồn tại");
//   }

//   // Trích xuất TKB từ các bản ghi điểm danh
//   const scheduledClasses = student.diemDanh.map(attendance => {
//     return {
//       ...attendance.tkb,
//       attendanceStatus: {
//         coMat: attendance.coMat,
//         diTre: attendance.diTre,
//         lyDoKhac: attendance.lyDoKhac
//       }
//     };
//   });

//   // Nhóm theo ngày để tổ chức tốt hơn
//   const scheduleByDay = scheduledClasses.reduce((acc, tkb) => {
//     const day = formatDate(new Date(tkb.ngay));
//     if (!acc[day]) {
//       acc[day] = [];
//     }
//     acc[day].push(tkb);
//     return acc;
//   }, {} as Record<string, any[]>);

//   return {
//     student: {
//       mssv: student.mssv,
//       holot: student.holot,
//       ten: student.ten,
//       hoTen: `${student.holot} ${student.ten}`,
//       lop: student.lop?.tenlop || 'N/A',
//       khoaVien: student.lop?.khoaVien?.tenkv || 'N/A',
//     },
//     lichTheoNgay: scheduleByDay,
//     tatCaLich: scheduledClasses.sort((a, b) => {
//       // Sắp xếp theo ngày trước, sau đó theo tiết bắt đầu
//       const dateCompare = new Date(a.ngay).getTime() - new Date(b.ngay).getTime();
//       if (dateCompare !== 0) return dateCompare;
//       return a.tietBD - b.tietBD;
//     })
//   };
// };
