import { Request, Response } from "express";
import { prisma } from "config/client";

export const diemDanhFaceIDController = async (req: Request, res: Response) => {
  try {
    const { mssv, tkbId } = req.body;
    if (!mssv || !tkbId) {
      res.status(400).json({ errorCode: 1, message: "Thiếu dữ liệu" });
    }

    const diemDanh = await prisma.diemDanh.update({
      where: { mssv_id: { mssv, id: tkbId } },
      data: { coMat: true },
    });

    res.status(200).json({
      errorCode: 0,
      message: "Điểm danh thành công",
      data: diemDanh,
    });
  } catch (error: any) {
    res.status(500).json({ errorCode: 1, message: error.message });
  }
};

export const diemDanhFaceID = async (req: Request, res: Response) => {
  const { mssv } = req.body;
  // Có thể nhận thêm id buổi học, thời gian, ...
  if (!mssv) {
    res.status(400).json({ message: "Thiếu mã số sinh viên" });
    return;
  }
  try {
    // Ví dụ: cập nhật trạng thái điểm danh cho sinh viên
    await prisma.diemDanh.create({
      data: {
        mssv,
        id: "id_buoi_hoc", // truyền từ frontend nếu cần
        coMat: true,
        diTre: false,
        lyDoKhac: null,
        faceID: null,
      },
    });
    res.json({ message: "Điểm danh thành công" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
