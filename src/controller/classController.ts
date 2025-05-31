import e, { Request, Response } from "express";
import {
  createClass,
  getAllClass,
  updateClass,
  deleteClass,
} from "services/classService";

export const createClassController = async (req: Request, res: Response) => {
  try {
    const { tenlop, siso, makv } = req.body;
    if (!tenlop || !siso || !makv) {
      res.status(400).json({
        errorCode: 1,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }
    if (siso < 0) {
      res.status(400).json({
        errorCode: 2,
        message: "Sĩ số không hợp lệ",
      });
    }
    const newClass = await createClass({ tenlop, siso, makv });
    res.status(201).json({
      message: "Tạo lớp thành công",
      data: {
        tenlop: newClass.tenlop,
        siso: newClass.siso,
        makv: newClass.makv,
      },
    });
  } catch (error: any) {
    if (error.message === "Lớp đã tồn tại") {
      res.status(400).json({
        errorCode: 1,
        message: "Lớp đã tồn tại trong hệ thống",
      });
    }
    console.error(error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

export const getAllClassController = async (req: Request, res: Response) => {
  try {
    const page = +(req.query.current || 1);
    const pageSize = +(req.query.pageSize || 5);
    const { result: classes, total } = await getAllClass(page, pageSize);
    const pages = Math.ceil(total / pageSize);
    // const classCount = classes.length;
    res.status(200).json({
      message: "Lấy danh sách lớp thành công",
      data: {
        meta: {
          current: page,
          pageSize: pageSize,
          pages: pages,
          total: total,
          result_count: classes.length,
        },
        classes: classes,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateClassController = async (req: Request, res: Response) => {
  try {
    const { malop, tenlop, siso, makv } = req.body;
    if (!malop || !tenlop || !siso || !makv) {
      res.status(400).json({
        errorCode: 1,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }
    if (siso < 0) {
      res.status(400).json({
        errorCode: 2,
        message: "Sĩ số không hợp lệ",
      });
    }
    const updatedClass = await updateClass(malop, {
      tenlop,
      siso,
      makv,
    });
    res.status(200).json({
      message: "Cập nhật lớp thành công",
      data: {
        tenlop: updatedClass.tenlop,
        siso: updatedClass.siso,
        makv: updatedClass.makv,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteClassController = async (req: Request, res: Response) => {
  try {
    const { malop } = req.params;
    if (!malop) {
      res.status(400).json({
        errorCode: 1,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }
    const deletedClass = await deleteClass(malop);
    res.status(200).json({
      message: "Xóa lớp thành công",
      data: deletedClass,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
