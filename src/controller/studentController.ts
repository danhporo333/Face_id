import { Request, Response } from "express";
import {
  createStudent,
  getAllStudents,
  updateStudent,
  deleteStudent,
} from "services/studentService";
import { uploadSingleFile } from "services/fileService";
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

export const createStudentController = async (req: Request, res: Response) => {
  try {
    const { malop, holot, ten, ntns, phai, dt_sv, emailSV, image } = req.body;
    if (!malop || !holot || !ten || !ntns || !phai) {
      res.status(400).json({
        errorCode: 1,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }
    const birthDate = new Date(ntns);
    if (isNaN(birthDate.getTime())) {
      res.status(400).json({
        errorCode: 1,
        message: "Ngày tháng năm sinh không hợp lệ",
      });
    }
    // Validate gender
    if (!["Nam", "Nữ"].includes(phai)) {
      res.status(400).json({
        errorCode: 1,
        message: "Giới tính không hợp lệ (Nam/Nữ)",
      });
    }

    const phoneNumber = dt_sv || generateVNPhoneNumber();

    let faceIDUrl = image || null;
    // 🛑 Kiểm tra nếu có file đính kèm
    if (req.files && req.files.image) {
      let result = await uploadSingleFile(req.files.image);
      faceIDUrl = result.name;
    }
    // Kiểm tra nếu không có file đính kèm
    if (!faceIDUrl) {
      res.status(400).json({
        errorCode: 1,
        message: "Image is required!",
      });
    }

    const svData = {
      malop,
      holot,
      ten,
      ntns: birthDate,
      phai,
      dt_sv: phoneNumber,
      emailSV,
      faceID: faceIDUrl,
    };
    const newStudent = await createStudent(svData);
    res.status(201).json({
      message: "Tạo sinh viên thành công",
      data: newStudent,
    });
  } catch (error: any) {
    if (error.message === "Lớp không tồn tại") {
      res.status(404).json({
        errorCode: 1,
        message: "Lớp không tồn tại trong hệ thống",
      });
    }
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAllStudentsController = async (req: Request, res: Response) => {
  try {
    const students = await getAllStudents();
    const studentCount = students.length;
    res.status(200).json({
      message: "Lấy danh sách sinh viên thành công",
      data: {
        studentCount,
        students,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateStudentController = async (req: Request, res: Response) => {
  try {
    const { mssv, malop, holot, ten, ntns, phai, dt_sv, emailSV, image } =
      req.body;
    if (!mssv) {
      res.status(400).json({
        errorCode: 1,
        message: "Vui lòng cung cấp mã số sinh viên",
      });
    }

    // Validate date if provided
    let birthDate;
    if (ntns) {
      birthDate = new Date(ntns);
      if (isNaN(birthDate.getTime())) {
        res.status(400).json({
          errorCode: 1,
          message: "Ngày tháng năm sinh không hợp lệ",
        });
      }
    }

    // Validate gender if provided
    if (phai && !["Nam", "Nữ"].includes(phai)) {
      res.status(400).json({
        errorCode: 1,
        message: "Giới tính không hợp lệ (Nam/Nữ)",
      });
    }

    let faceIDUrl = image;
    // Handle file upload if present
    if (req.files && req.files.image) {
      const result = await uploadSingleFile(req.files.image);
      faceIDUrl = result.name;
    }

    const updatedStudent = await updateStudent(mssv, {
      malop,
      holot,
      ten,
      ntns: birthDate,
      phai,
      dt_sv,
      emailSV,
      faceID: faceIDUrl,
    });

    res.status(200).json({
      message: "Cập nhật sinh viên thành công",
      data: updatedStudent,
    });
  } catch (error: any) {
    console.error("Error updating student:", error);
    if (error.message === "Sinh viên không tồn tại") {
      res.status(404).json({
        errorCode: 1,
        message: "Sinh viên không tồn tại trong hệ thống",
      });
    }
    if (error.message === "Lớp không tồn tại") {
      res.status(404).json({
        errorCode: 1,
        message: "Lớp không tồn tại trong hệ thống",
      });
    }
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteStudentController = async (req: Request, res: Response) => {
  try {
    const { mssv } = req.params;

    if (!mssv) {
      res.status(400).json({
        errorCode: 1,
        message: "Vui lòng cung cấp mã số sinh viên",
      });
    }

    //xóa sinh viên
    const deletedStudent = await deleteStudent(mssv);
    res.status(200).json({
      message: "Xóa sinh viên thành công",
      data: deletedStudent,
    });
  } catch (error: any) {
    console.error("Error deleting student:", error);
    if (error.message === "Sinh viên không tồn tại") {
      res.status(404).json({
        errorCode: 1,
        message: "Sinh viên không tồn tại trong hệ thống",
      });
    }
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
