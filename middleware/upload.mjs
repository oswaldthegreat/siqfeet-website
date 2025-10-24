import multer from "multer";
import path from "path";

//this is me setting up storage and file placement
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const fileExt = path.extname(file.originalname);
  const baseName = path.basename(file.originalname, fileExt);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + fileExt
    );
  },
});

// this is me Filtering file types to only accept images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

export { upload };
