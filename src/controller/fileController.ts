import { Request, Response } from "express";
import { uploadSingleFile } from "services/fileService";
import { fileUploadMiddleware } from "../Middleware/multer";
import path from "path";

// export const uploadFile = async (req: Request, res: Response) => {
//   try {
//     if (!req.files || Object.keys(req.files).length === 0) {
//       res.status(400).json({ message: "No file uploaded" });
//     }

//     let result = await uploadSingleFile(req.files.image);
//     res.status(200).json({
//       EC: 0,
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error in file upload:", error);
//     res.status(500).json({
//       errorCode: 1,
//       message: "Server error! Unable to upload file.",
//     });
//   }
// };

export const uploadFile = (req: Request, res: Response) => {
  const uploadMiddleware = fileUploadMiddleware("image", "uploads");

  uploadMiddleware(req, res, function (err: any) {
    if (err) {
      return res.status(400).json({
        errorCode: 1,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        errorCode: 1,
        message: "No file uploaded",
      });
    }

    return res.status(200).json({
      EC: 0,
      data: {
        status: "success",
        name: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  });
};
