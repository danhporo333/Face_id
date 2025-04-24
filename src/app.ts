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

//config req.body
app.use(cors()); //Cho phép tất cả nguồn gọi API
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data

//khai báo routes
app.use("/v1/api/", apiRoutes);

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
