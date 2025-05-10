import { prisma } from "config/client";
import { validatePhoneNumber } from "../utils/validator";
import { parseExcelFile } from "../utils/excelImport";
import fs from "fs";

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

// export const importClassesFromExcel = async (file: Express.Multer.File) => {
//   // Map tên cột excel về tên field DB (không phân biệt hoa thường, có dấu hoặc không dấu)
//   const columnMapping = {
//     tenlop: "tenlop",
//     "tên lớp": "tenlop",
//     "ten lop": "tenlop",
//     siso: "siso",
//     "sĩ số": "siso",
//     "si so": "siso",
//     makv: "makv",
//     "mã khoa viện": "makv",
//     "ma khoa vien": "makv",
//     "ma kv": "makv",
//   };

//   try {
//     const data = parseExcelFile<ILop>(file.path, columnMapping);

//     if (!Array.isArray(data) || data.length === 0) {
//       throw new Error("File Excel không có dữ liệu hoặc sai định dạng");
//     }

//     const results = [];
//     const errors = [];

//     for (const [index, row] of data.entries()) {
//       try {
//         // Validate required fields
//         if (!row.tenlop) throw new Error("Tên lớp không được để trống");
//         if (!row.siso) throw new Error("Sĩ số không được để trống");
//         if (!row.makv) throw new Error("Mã khoa viện không được để trống");

//         // Kiểm tra khoa viện tồn tại
//         const khoaVien = await prisma.khoaVien.findUnique({
//           where: { makv: row.makv },
//         });
//         if (!khoaVien) throw new Error("Khoa viện không tồn tại");

//         // Kiểm tra lớp đã tồn tại chưa
//         const existingClass = await prisma.lop.findFirst({
//           where: { tenlop: row.tenlop },
//         });
//         if (existingClass) throw new Error("Lớp đã tồn tại");

//         // Tạo mới lớp
//         const created = await prisma.lop.create({
//           data: {
//             tenlop: row.tenlop,
//             siso: +row.siso,
//             makv: row.makv,
//           },
//         });
//         results.push(created);
//       } catch (error: any) {
//         errors.push({ row: index + 2, error: error.message });
//       }
//     }

//     // Xóa file sau khi import xong nếu muốn
//     fs.unlinkSync(file.path);

//     return { imported: results.length, failed: errors.length, results, errors };
//   } catch (error: any) {
//     try {
//       fs.unlinkSync(file.path);
//     } catch {}
//     throw new Error(`Lỗi import: ${error.message}`);
//   }
// };
