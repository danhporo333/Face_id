import {
  createMonHoc,
  getAllMonHoc,
  updateMonHoc,
  deleteMonHoc,
} from "services/monhocService";
import { Request, Response } from "express";

export const createMonHocController = async (req: Request, res: Response) => {
  try {
    const { tenmh, tclt, tcth } = req.body;
    if (
      !tenmh ||
      tclt === undefined ||
      tclt === null ||
      tcth === undefined ||
      tcth === null
    ) {
      res.status(400).json({
        errorCode: 1,
        message: "vui lòng điền đầy đủ thôn tin",
      });
      return;
    }

    if (tclt < 0 || tcth < 0) {
      res.status(400).json({
        errorCode: 1,
        message: "số tín chỉ không hợp lệ",
      });
      return;
    }

    const monhoc = await createMonHoc({
      tenmh,
      tclt: parseInt(tclt),
      tcth: parseInt(tcth),
    });

    res.status(200).json({
      message: "Tạo môn học thành công",
      data: monhoc,
    });
    return;
  } catch (error: any) {
    if (error.message === "Môn học đã tồn tại") {
      res.status(400).json({
        errorCode: 1,
        message: "Môn học đã tồn tại trong hệ thống",
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllMonHocController = async (req: Request, res: Response) => {
  try {
    const page = +(req.query.current || 1);
    const pageSize = +(req.query.pageSize || 5);
    const { result: monhoc, total } = await getAllMonHoc(page, pageSize);
    const pages = Math.ceil(total / pageSize);

    res.status(200).json({
      message: "Lấy danh sách môn học thành công",
      data: {
        meta: {
          current: page,
          pageSize: pageSize,
          pages: pages,
          total: total,
          count: monhoc.length,
        },
        monhoc: monhoc,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateMonHocController = async (req: Request, res: Response) => {
  try {
    const { mamh, tenmh, tclt, tcth } = req.body;
    if (!mamh) {
      res.status(400).json({
        errorCode: 1,
        message: "Vui lòng cung cấp mã môn học",
      });
    }

    if (tclt < 0 || tcth < 0) {
      res.status(400).json({
        errorCode: 1,
        message: "số tín chỉ không hợp lệ",
      });
    }

    const updatedSubject = await updateMonHoc(mamh, {
      tenmh,
      tclt: tclt ? parseInt(tclt) : tclt,
      tcth: tcth ? parseInt(tcth) : tcth,
    });

    res.status(200).json({
      message: "Cập nhật môn học thành công",
      data: updatedSubject,
    });
  } catch (error: any) {
    if (error.message === "Môn học không tồn tại") {
      res.status(404).json({
        errorCode: 1,
        message: "Môn học không tồn tại trong hệ thống",
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteMonHocController = async (req: Request, res: Response) => {
  try {
    const { mamh } = req.params;
    if (!mamh) {
      res.status(400).json({
        errorCode: 1,
        message: "Vui lòng cung cấp mã môn học",
      });
    }

    const deletedSubject = await deleteMonHoc(mamh);

    res.status(200).json({
      message: "Xóa môn học thành công",
      data: deletedSubject,
    });
  } catch (error: any) {
    if (error.message === "Môn học không tồn tại") {
      res.status(404).json({
        errorCode: 1,
        message: "Môn học không tồn tại trong hệ thống",
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
