import express from "express";
import "dotenv/config";
import path from "path";
import cors from "cors";
import apiRoutes from "./routes/api";
// import fileUpload from "express-fileupload";
const app = express();
const port = process.env.PORT || 8080;

//config file upload
// app.use(fileUpload());
app.use("/image", express.static(path.join(__dirname, "Public/image")));
app.use("/excel", express.static(path.join(__dirname, "Public/excel/imports")));
app.use(
  "/model",
  express.static(
    path.join(__dirname, "../../../face_id/frontend/src/Public/model")
  )
);
app.use(express.static(path.join(__dirname, "../../../face_id/frontend/src")));
//config req.body
app.use(
  cors({
    origin: "http://127.0.0.1:5501", // Thay thế bằng URL của frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Cho phép các phương thức HTTP cần thiết
    allowedHeaders: ["Content-Type", "Authorization"], // Cấu hình cho phép các header như Authorization (Token)
    credentials: true, // Cho phép gửi cookie trong các yêu cầu cross-origin
  })
);
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data

//khai báo routes
app.use("/v1/api/", apiRoutes);

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
