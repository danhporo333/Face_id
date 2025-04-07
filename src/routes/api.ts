import express from "express";
import { auth } from "src/Middleware//auth";
import { register, login } from "controller/userController";
import { uploadFile } from "controller/fileController";
import {
  createKhoaVienController,
  getAllKhoaVienController,
  updateKhoaVienController,
  deleteKhoaVienController,
} from "controller/khoa_vien_Controller";
import {
  createClassController,
  getAllClassController,
  updateClassController,
  deleteClassController,
} from "controller/classController";
import {
  createStudentController,
  getAllStudentsController,
  updateStudentController,
  // deleteStudentController,
} from "controller/studentController";

const router = express.Router();

// Define routes
router.post("/register", register);
router.post("/login", login);

//api upload file
router.post("/upload", uploadFile);

//api khoa vien
router.post("/createkhoa_vien", createKhoaVienController);
router.get("/all", getAllKhoaVienController);
router.put("/updatekhoa_vien", updateKhoaVienController);
router.delete("/deletekhoa_vien/:makv", deleteKhoaVienController);

//api class
router.post("/createclass", createClassController);
router.get("/allclass", getAllClassController);
router.put("/updateclass", updateClassController);
router.delete("/deleteclass/:malop", deleteClassController);

//api student
router.post("/createstudent", createStudentController);
router.get("/allstudents", getAllStudentsController);
router.put("/updatestudent", updateStudentController);
export default router;
