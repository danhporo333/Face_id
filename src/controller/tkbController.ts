import { Request, Response } from "express";
import {
  createTKB,
  getAllTKB,
  updateTKB,
  deleteTKB,
} from "services/tkbService";

export const createTKBController = async (req: Request, res: Response) => {
  try {
    const { thu, ngay, tietBD, tietKT, mamh, mgv, sop } = req.body;

    // Validate required fields
    if (!thu || !ngay || !tietBD || !tietKT || !mamh || !mgv || !sop) {
      res.status(400).json({
        errorCode: 1,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }

    // Validate ngày tháng năm
    const inputDate = new Date(ngay);
    if (isNaN(inputDate.getTime())) {
      res.status(400).json({
        errorCode: 1,
        message: "Ngày tháng năm không hợp lệ",
      });
    }

    // Kiểm tra ngày không được là ngày trong quá khứ
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (inputDate < today) {
      res.status(400).json({
        errorCode: 1,
        message: "Không thể tạo lịch học cho ngày trong quá khứ",
      });
    }

    // Validate tiết học
    if (
      tietBD < 1 ||
      tietBD > 15 ||
      tietKT < 1 ||
      tietKT > 15 ||
      tietBD > tietKT
    ) {
      res.status(400).json({
        errorCode: 1,
        message: "Tiết học không hợp lệ",
      });
    }

    // Validate thứ
    if (
      ![
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
        "Chủ nhật",
      ].includes(thu)
    ) {
      res.status(400).json({
        errorCode: 1,
        message: "Thứ không hợp lệ",
      });
    }

    // Validate thứ và kiểm tra khớp với ngày
    const weekDays = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    const dayOfWeek = weekDays[inputDate.getDay()];
    if (thu !== dayOfWeek) {
      res.status(400).json({
        errorCode: 1,
        message: "Thứ không khớp với ngày tháng năm đã chọn",
      });
    }

    // Format lại ngày tháng để lưu vào database
    const formattedDate = new Date(ngay);
    formattedDate.setHours(0, 0, 0, 0);

    const newTKB = await createTKB({
      thu,
      ngay: formattedDate,
      tietBD: parseInt(tietBD),
      tietKT: parseInt(tietKT),
      mamh,
      mgv,
      sop,
    });

    res.status(201).json({
      errorCode: 0,
      message: "Tạo thời khóa biểu thành công",
      data: newTKB,
    });
  } catch (error: any) {
    if (
      error.message === "Môn học không tồn tại" ||
      error.message === "Giảng viên không tồn tại" ||
      error.message === "Phòng học không tồn tại" ||
      error.message === "Thời gian này đã có lịch học"
    ) {
      res.status(400).json({
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

export const getAllTKBController = async (req: Request, res: Response) => {
  try {
    const tkbs = await getAllTKB();
    const tkbCount = tkbs.length;

    res.status(200).json({
      errorCode: 0,
      message: "Lấy danh sách thời khóa biểu thành công",
      data: {
        tkbCount,
        tkbs,
      },
    });
  } catch (error) {
    res.status(500).json({
      errorCode: 1,
      message: "Internal server error",
    });
  }
};

export const updateTKBController = async (req: Request, res: Response) => {
  try {
    const { id, thu, ngay, tietBD, tietKT, mamh, mgv, sop } = req.body;

    if (!id) {
      res.status(400).json({
        errorCode: 1,
        message: "Vui lòng cung cấp ID thời khóa biểu",
      });
    }

    // Validate tiết học nếu được cung cấp
    if (tietBD || tietKT) {
      if (
        tietBD < 1 ||
        tietBD > 12 ||
        tietKT < 1 ||
        tietKT > 12 ||
        tietBD > tietKT
      ) {
        res.status(400).json({
          errorCode: 1,
          message: "Tiết học không hợp lệ",
        });
      }
    }

    // Validate thứ nếu được cung cấp
    if (
      thu &&
      ![
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
        "Chủ nhật",
      ].includes(thu)
    ) {
      res.status(400).json({
        errorCode: 1,
        message: "Thứ không hợp lệ",
      });
    }

    const updatedTKB = await updateTKB(id, {
      thu,
      ngay: ngay ? new Date(ngay) : undefined,
      tietBD: tietBD ? parseInt(tietBD) : undefined,
      tietKT: tietKT ? parseInt(tietKT) : undefined,
      mamh,
      mgv,
      sop,
    });

    res.status(200).json({
      errorCode: 0,
      message: "Cập nhật thời khóa biểu thành công",
      data: updatedTKB,
    });
  } catch (error: any) {
    if (
      error.message === "Thời khóa biểu không tồn tại" ||
      error.message === "Môn học không tồn tại" ||
      error.message === "Giảng viên không tồn tại" ||
      error.message === "Phòng học không tồn tại"
    ) {
      res.status(400).json({
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

export const deleteTKBController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        errorCode: 1,
        message: "Vui lòng cung cấp ID thời khóa biểu",
      });
    }

    const deletedTKB = await deleteTKB(id);

    res.status(200).json({
      errorCode: 0,
      message: "Xóa thời khóa biểu thành công",
      data: deletedTKB,
    });
  } catch (error: any) {
    if (error.message === "Thời khóa biểu không tồn tại") {
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
