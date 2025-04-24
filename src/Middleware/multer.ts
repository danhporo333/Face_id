import multer from "multer";
import path from "path";
import { v4 } from "uuid";
import fs from "fs";

const fileUploadMiddleware = (fieldName: string, dir: string = "student") => {
  // Create absolute path to the upload directory
  const uploadPath = path.resolve(__dirname, "../Public/image", dir);

  // Ensure the directory exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log(`Created directory: ${uploadPath}`);
  }

  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        console.log("File extension:", extension);
        cb(null, v4() + extension);
      },
    }),
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: (
      req: Express.Request,
      file: Express.Multer.File,
      cb: Function
    ) => {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Only JPEG and PNG images are allowed."), false);
      }
    },
  }).single(fieldName);
};

export default fileUploadMiddleware;
