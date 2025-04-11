import {
  createKhoaVien,
  getAllKhoaVien,
  updateKhoaVien,
  deleteKhoaVien,
} from "services/khoa_vien_Service";
import e, { Request, Response } from "express";

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

export const createKhoaVienController = async (req: Request, res: Response) => {
  try {
    const { tenkv, dtkv, diaChi } = req.body;
    if (!tenkv || !diaChi) {
      res.status(400).json({
        errorCode: 1,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }

    // Sử dụng số điện thoại từ request hoặc tạo mới
    const phoneNumber = dtkv || generateVNPhoneNumber();

    const newKhoaVien = await createKhoaVien({
      tenkv,
      dtkv: phoneNumber,
      diaChi,
    });
    res.status(201).json({
      message: "Khoa viện created successfully",
      data: {
        id: newKhoaVien.makv,
        tenkv: newKhoaVien.tenkv,
        dtkv: newKhoaVien.dtkv,
        diaChi: newKhoaVien.diaChi,
      },
    });
  } catch (error: any) {
    if (error.message === "Khoa viện đã tồn tại") {
      res.status(400).json({
        errorCode: 1,
        message: "Khoa viện đã tồn tại trong hệ thống",
      });
    }
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllKhoaVienController = async (req: Request, res: Response) => {
  try {
    const khoavien = await getAllKhoaVien();
    const khoavienCount = khoavien.length;
    res.status(200).json({
      message: "Lấy danh sách khoa viện thành công",
      data: {
        khoavienCount: khoavienCount,
        khoavien: khoavien,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateKhoaVienController = async (req: Request, res: Response) => {
  try {
    // Lấy makv từ params thay vì body
    const { makv, tenkv, dtkv, diaChi } = req.body;

    if (!makv) {
      res.status(400).json({
        errorCode: 1,
        message: "Không tìm thấy mã khoa viện",
      });
    }

    const updatedKhoaVien = await updateKhoaVien(makv, {
      tenkv,
      dtkv,
      diaChi,
    });
    res.status(200).json({
      errorCode: 0,
      message: "Cập nhật khoa viện thành công",
      data: updatedKhoaVien,
    });
  } catch (error: any) {
    console.error(error);
    if (
      error.message === "Khoa viện không tồn tại" ||
      error.message === "Tên khoa viện đã tồn tại"
    ) {
      res.status(400).json({
        errorCode: 1,
        message: error.message,
      });
    }
    res.status(500).json({
      errorCode: 1,
      message: "Lỗi hệ thống",
    });
  }
};

export const deleteKhoaVienController = async (req: Request, res: Response) => {
  try {
    const { makv } = req.params;
    if (!makv) {
      res.status(400).json({
        errorCode: 1,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }

    const deletedKhoaVien = await deleteKhoaVien(makv);
    res.status(200).json({
      errorCode: 0,
      message: "Khoa viện deleted successfully",
      data: deletedKhoaVien,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
