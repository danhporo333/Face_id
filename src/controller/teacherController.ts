import { Request, Response } from "express";
import {
  createTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
} from "services/teacherService";

const VN_PHONE_PREFIXES = [
  "086",
  "096",
  "097",
  "098", // Viettel
  "032",
  "033",
  "034",
  "035",
  "036",
  "037",
  "038",
  "039", // Viettel
  "088",
  "091",
  "094", // Vinaphone
  "081",
  "082",
  "083",
  "084",
  "085", // Vinaphone
  "089",
  "090",
  "093", // Mobifone
  "070",
  "079",
  "077",
  "076",
  "078", // Mobifone
];

const generateVNPhoneNumber = (): string => {
  // Chọn ngẫu nhiên đầu số từ danh sách
  const prefix =
    VN_PHONE_PREFIXES[Math.floor(Math.random() * VN_PHONE_PREFIXES.length)];

  // Thêm 7 số ngẫu nhiên để đủ 10 số
  let remainingDigits = "";
  for (let i = 0; i < 7; i++) {
    remainingDigits += Math.floor(Math.random() * 10);
  }

  return prefix + remainingDigits;
};

export const createTeacherController = async (req: Request, res: Response) => {
  try {
    const { hoGV, tenGV, dt_gv, donVi } = req.body;
    // console.log(req.body);

    if (!hoGV || !tenGV) {
      res.status(400).json({
        errorCode: 1,
        message: "Họ và tên giảng viên là bắt buộc",
      });
    }

    const phoneNumber = dt_gv || generateVNPhoneNumber();

    const newTeacher = await createTeacher({
      hoGV,
      tenGV,
      dt_gv: phoneNumber,
      donVi,
    });
    console.log(newTeacher);

    res.status(201).json({
      errorCode: 0,
      message: "Thêm giảng viên thành công",
      data: newTeacher,
    });
  } catch (error: any) {
    if (error.message === "Giảng viên đã tồn tại") {
      res.status(400).json({
        errorCode: 1,
        message: "giảng viên đã tồn tại trong hệ thống",
      });
    }
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      detail: error.message,
    });
  }
};

export const getAllTeachersController = async (req: Request, res: Response) => {
  try {
    const page = +(req.query.current || 1);
    const pageSize = +(req.query.pageSize || 5);
    const { result: teachers, total } = await getAllTeachers(page, pageSize);
    const pages = Math.ceil(total / pageSize);

    res.status(200).json({
      errorCode: 0,
      message: "Lấy danh sách giảng viên thành công",
      data: {
        meta: {
          current: page,
          pageSize: pageSize,
          pages: pages,
          total: total,
          result_count: teachers.length,
        },
        teachers: teachers,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      errorCode: 1,
      message: "Không thể lấy danh sách giảng viên",
    });
  }
};

export const updateTeacherController = async (req: Request, res: Response) => {
  try {
    const { mgv, hoGV, tenGV, dt_gv, donVi } = req.body;
    if (!mgv) {
      res.status(400).json({
        errorCode: 1,
        message: "Mã giảng viên là bắt buộc",
      });
    }

    const updatedTeacher = await updateTeacher(mgv, {
      hoGV,
      tenGV,
      dt_gv,
      donVi,
    });
    console.log("Update result:", updatedTeacher);

    res.status(200).json({
      message: "Cập nhật giảng viên thành công",
      data: updatedTeacher,
    });
  } catch (error: any) {
    if (error.message === "Giảng viên không tồn tại") {
      res.status(404).json({
        errorCode: 1,
        message: error.message,
      });
    }
    console.error("Update teacher error:", error);
    res.status(500).json({
      errorCode: 1,
      message: "Internal server error",
    });
  }
};

export const deleteTeacherController = async (req: Request, res: Response) => {
  try {
    const { mgv } = req.params;

    if (!mgv) {
      res.status(400).json({
        errorCode: 1,
        message: "Mã giảng viên là bắt buộc",
      });
    }

    const deletedTeacher = await deleteTeacher(mgv);

    res.status(200).json({
      message: "Xóa giảng viên thành công",
      data: deletedTeacher,
    });
  } catch (error: any) {
    if (error.message === "Giảng viên không tồn tại") {
      res.status(404).json({
        errorCode: 1,
        message: error.message,
      });
    }
    res.status(500).json({
      errorCode: 1,
      message: "Internal server error",
    });
  }
};
