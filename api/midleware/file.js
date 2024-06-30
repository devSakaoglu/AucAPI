import multer from "multer";
import path from "path";

// Set storage engine to memory
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // limit file size to 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}
export default upload;
