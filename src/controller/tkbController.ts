import { Request, Response } from "express";
import {
  createTKB,
  getAllTKB,
  updateTKB,
  deleteTKB,
} from "services/tkbService";

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const createTKBController = async (req: Request, res: Response) => {
  try {
    const { thu, ngay, tietBD, tietKT, mamh, mgv, sop } = req.body;

    // Validate required fields
    if (!thu || !ngay || !tietBD || !tietKT || !mamh || !mgv || !sop) {
      res.status(400).json({
        errorCode: 1,
        message: "Vui lòng điền đầy đủ thông tin",
      });
      return;
    }

    // Validate và chuyển đổi ngày tháng
    let inputDate: Date;
    try {
      // Hỗ trợ cả 2 format DD/MM/YYYY và YYYY-MM-DD
      const dateParts = ngay.includes("/") ? ngay.split("/") : null;
      if (dateParts) {
        const [day, month, year] = dateParts;
        inputDate = new Date(`${year}-${month}-${day}`);
      } else {
        inputDate = new Date(ngay);
      }

      if (isNaN(inputDate.getTime())) {
        res.status(400).json({
          errorCode: 1,
          message: "Ngày tháng năm không hợp lệ",
        });
        return;
      }
    } catch (error) {
      res.status(400).json({
        errorCode: 1,
        message:
          "Định dạng ngày tháng không hợp lệ (DD/MM/YYYY hoặc YYYY-MM-DD)",
      });
      return;
    }

    // Kiểm tra ngày không được là ngày trong quá khứ
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (inputDate < today) {
      res.status(400).json({
        errorCode: 1,
        message: "Không thể tạo lịch học cho ngày trong quá khứ",
      });
      return;
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
      return;
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
      return;
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
      return;
    }

    // Format lại ngày tháng để lưu vào database
    const formattedDate = new Date(ngay);
    formattedDate.setHours(0, 0, 0, 0);

    const newTKB = await createTKB({
      thu,
      ngay: inputDate,
      tietBD: parseInt(tietBD),
      tietKT: parseInt(tietKT),
      mamh,
      mgv,
      sop,
    });

    // Format ngày trong response về dạng DD/MM/YYYY
    const responseData = {
      ...newTKB,
      ngay: formatDate(new Date(newTKB.ngay)),
    };

    res.status(201).json({
      errorCode: 0,
      message: "Tạo thời khóa biểu thành công",
      data: responseData,
    });
    return;
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
      return;
    }
    res.status(500).json({
      errorCode: 1,
      message: "Internal server error",
    });
    return;
  }
};

export const getAllTKBController = async (req: Request, res: Response) => {
  try {
    const tkbs = await getAllTKB();
    const formattedTkbs = tkbs.map((tkb) => ({
      ...tkb,
      ngay: formatDate(new Date(tkb.ngay)),
    }));

    res.status(200).json({
      errorCode: 0,
      message: "Lấy danh sách thời khóa biểu thành công",
      data: {
        tkbCount: tkbs.length,
        tkbs: formattedTkbs,
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
      return;
    }

    let inputDate: Date | undefined;
    if (ngay) {
      try {
        const dateParts = ngay.includes("/") ? ngay.split("/") : null;
        if (dateParts) {
          const [day, month, year] = dateParts;
          inputDate = new Date(`${year}-${month}-${day}`);
        } else {
          inputDate = new Date(ngay);
        }

        if (isNaN(inputDate.getTime())) {
          res.status(400).json({
            errorCode: 1,
            message: "Ngày tháng năm không hợp lệ",
          });
          return;
        }
      } catch (error) {
        res.status(400).json({
          errorCode: 1,
          message: "Định dạng ngày tháng không hợp lệ",
        });
        return;
      }
    }

    const updatedTKB = await updateTKB(id, {
      thu,
      ngay: inputDate,
      tietBD: tietBD ? parseInt(tietBD) : undefined,
      tietKT: tietKT ? parseInt(tietKT) : undefined,
      mamh,
      mgv,
      sop,
    });

    // Format ngày trong response về dạng DD/MM/YYYY
    const responseData = {
      ...updatedTKB,
      ngay: formatDate(new Date(updatedTKB.ngay)),
    };

    res.status(200).json({
      errorCode: 0,
      message: "Cập nhật thời khóa biểu thành công",
      data: responseData,
    });
  } catch (error: any) {
    if (
      error.message === "Thời khóa biểu không tồn tại" ||
      error.message === "Môn học không tồn tại" ||
      error.message === "Giảng viên không tồn tại" ||
      error.message === "Phòng học không tồn tại" ||
      error.message === "Thời gian này đã có lịch học"
    ) {
      res.status(400).json({
        errorCode: 1,
        message: error.message,
      });
      return;
    }
    res.status(500).json({
      errorCode: 1,
      message: "Lỗi hệ thống",
    });
    return;
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
    return;
  } catch (error: any) {
    if (error.message === "Thời khóa biểu không tồn tại") {
      res.status(404).json({
        errorCode: 1,
        message: error.message,
      });
      return;
    }
    res.status(500).json({
      errorCode: 1,
      message: "Internal server error",
    });
    return;
  }
};
