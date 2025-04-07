import { Request, Response } from "express";
import { uploadSingleFile } from "services/fileService";

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).json({ message: "No file uploaded" });
    }

    let result = await uploadSingleFile(req.files.image);
    res.status(200).json({
      EC: 0,
      data: result,
    });
  } catch (error) {
    console.error("Error in file upload:", error);
    res.status(500).json({
      errorCode: 1,
      message: "Server error! Unable to upload file.",
    });
  }
};
