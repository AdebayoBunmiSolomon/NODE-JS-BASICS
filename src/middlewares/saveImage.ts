import multer from "multer";

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/images"); //save files in the uploads director
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file?.originalname}`;
    cb(null, uniqueName); //Ensure unique filenames
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});
