import path from "path";

export const uploadSingleFile = async (fileObject) => {
  // save => public/images/upload
  //remember to create the upload folder first
  let uploadPath = path.resolve(__dirname, "../Public/image/student");
  console.log("Upload path:", uploadPath);

  let extName = path.extname(fileObject.name);
  let baseName = path.basename(fileObject.name, extName);

  //create final path: eg: /upload/your-image.png
  let finalName = `${baseName}-${Date.now()}${extName}`;
  let finalPath = `${uploadPath}/${finalName}`;

  try {
    await fileObject.mv(finalPath);

    return {
      status: "success",
      name: finalName,
      path: finalPath,
      err: null,
    };
  } catch (error) {
    console.log(">>> check err: ", error);
    return {
      status: "failed",
      path: null,
      err: JSON.stringify(error),
    };
  }
};
