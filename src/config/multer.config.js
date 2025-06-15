// -------------------- PACKAGE IMPORT FILES -------------------- //
import path from 'path';
import multer from 'multer';

// -------------------- Importing Other Files -------------------- //
import APIError from '../utilities/apiError.js';
import statusCodeUtility from '../utilities/statusCodeUtility.js';

const fileStorage = multer.memoryStorage({
  destination: (req, file, cb) => {
    const folderPath = path.resolve('./src/upload');
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const extension = file.originalname.split('.').pop();
    cb(null, `file-${Date.now()}.${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-powerpoint', // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
  ];

  const isValid = allowedTypes.some(type => file.mimetype.startsWith(type));

  if (isValid) {
    cb(null, true);
  } else {
    cb(
      new APIError(
        statusCodeUtility.BadRequest,
        "Only images, PDFs, Word, Excel, and PowerPoint files are allowed",
        null
      ),
      false
    );
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter,
});

export default upload;
