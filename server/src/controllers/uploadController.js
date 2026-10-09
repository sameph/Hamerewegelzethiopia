const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/books";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|pdf/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images (jpg/png) and PDFs only!");
  }
}

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Upload book files (thumbnail and pdf)
// @route   POST /api/v1/upload/book
// @access  Private (Admin)
exports.uploadBookFiles = (req, res) => {
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const files = {};
    if (req.files.thumbnail) {
      files.thumbnail = `${baseUrl}/uploads/books/${req.files.thumbnail[0].filename}`;
    }
    if (req.files.pdf) {
      files.pdf = `${baseUrl}/uploads/books/${req.files.pdf[0].filename}`;
    }

    res.status(200).json({
      success: true,
      data: files,
    });
  });
};

// @desc    General file upload
// @route   POST /api/v1/upload
// @access  Private
exports.uploadFile = (req, res) => {
  // Dynamic storage for general uploads
  const generalStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = "uploads/materials";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      cb(null, `file-${Date.now()}${path.extname(file.originalname)}`);
    },
  });

  const generalUpload = multer({
    storage: generalStorage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  }).single("file");

  generalUpload(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ success: false, message: err.message || err });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload a file" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    res.status(200).json({
      success: true,
      data: {
        name: req.file.originalname,
        url: `${baseUrl}/uploads/materials/${req.file.filename}`,
        fileType: path.extname(req.file.originalname).substring(1),
      },
    });
  });
};

// @desc    Upload lesson PDF materials (multiple files)
// @route   POST /api/v1/upload/lesson-materials
// @access  Private (Instructor/Admin)
exports.uploadLessonMaterials = (req, res) => {
  const lessonStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = "uploads/lesson-materials";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      cb(
        null,
        `lesson-${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}${path.extname(file.originalname)}`
      );
    },
  });

  // Only accept PDF files
  function checkPdfType(file, cb) {
    const pdfTypes = /pdf/;
    const extname = pdfTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = pdfTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Only PDF files are allowed!");
    }
  }

  const lessonUpload = multer({
    storage: lessonStorage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit per file
    fileFilter: function (req, file, cb) {
      checkPdfType(file, cb);
    },
  }).array("materials", 10); // Allow up to 10 files

  lessonUpload(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ success: false, message: err.message || err });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one PDF file",
      });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const uploadedFiles = req.files.map((file) => ({
      name: file.originalname,
      url: `${baseUrl}/uploads/lesson-materials/${file.filename}`,
      fileType: "pdf",
    }));

    res.status(200).json({
      success: true,
      count: uploadedFiles.length,
      data: uploadedFiles,
    });
  });
};
