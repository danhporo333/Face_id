import express, { Router } from "express";
import { auth } from "src/Middleware//auth";

import {
  register,
  login,
  getAllUsersController,
  deleteUserController,
} from "controller/userController";
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
  deleteStudentController,
} from "controller/studentController";
import {
  createMonHocController,
  getAllMonHocController,
  updateMonHocController,
  deleteMonHocController,
} from "controller/monhocController";
import {
  createTeacherController,
  getAllTeachersController,
  updateTeacherController,
  deleteTeacherController,
} from "controller/teacherController";
import {
  createRoomController,
  getAllRoomsController,
  updateRoomController,
  deleteRoomController,
} from "controller/RoomController";

import {
  createTKBController,
  getAllTKBController,
  updateTKBController,
  deleteTKBController,
} from "controller/tkbController";

const router: Router = express.Router();

//api user
router.post("/register", register);
router.post("/login", login);
router.get("/allusers", getAllUsersController);
router.delete("/deleteuser/:id", deleteUserController);

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
router.delete("/deletestudent/:mssv", deleteStudentController);

//api mon hoc
router.post("/createmonhoc", createMonHocController);
router.get("/allmonhoc", getAllMonHocController);
router.put("/updatemonhoc", updateMonHocController);
router.delete("/deletemonhoc/:mamh", deleteMonHocController);

//api teacher
router.post("/createteacher", createTeacherController);
router.get("/allteachers", getAllTeachersController);
router.put("/updateteacher", updateTeacherController);
router.delete("/deleteteacher/:mgv", deleteTeacherController);

//api room
router.post("/createroom", createRoomController);
router.get("/allrooms", getAllRoomsController);
router.put("/updateroom", updateRoomController);
router.delete("/deleteroom/:sop", deleteRoomController);

//api tkb
router.post("/createtkb", createTKBController);
router.get("/alltkb", getAllTKBController);
router.put("/updatetkb", updateTKBController);
router.delete("/deletetkb/:id", deleteTKBController);
export default router;
