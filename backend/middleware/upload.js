// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define upload directories
const uploadDirectories = {
  root: path.join(process.cwd(), 'uploads'),
  profiles: path.join(process.cwd(), 'uploads/profiles'),
  announcements: path.join(process.cwd(), 'uploads/announcements'),
  posts: path.join(process.cwd(), 'uploads/posts')
};

// Create all necessary directories
Object.values(uploadDirectories).forEach(dir => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log('Created directory at:', dir);
    } catch (error) {
      console.error('Error creating directory:', error);
    }
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine destination based on file type/usage
    let uploadPath = uploadDirectories.root;
    
    if (file.fieldname === 'profileImage') {
      uploadPath = uploadDirectories.profiles;
    } else if (file.fieldname === 'announcementImage') {
      uploadPath = uploadDirectories.announcements;
    } else if (file.fieldname === 'postImage') {
      uploadPath = uploadDirectories.posts;
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create a unique filename with type prefix
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const prefix = file.fieldname.replace('Image', ''); // Remove 'Image' from fieldname
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
  // Define allowed mime types
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// Create multer instance with configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Limit to 1 file per request
  },
  fileFilter: fileFilter
});

// Helper function to get file URL based on type
const getFileUrl = (filename, type = '') => {
  if (!filename) return null;
  
  let subDirectory = '';
  if (type === 'profile') {
    subDirectory = 'profiles/';
  } else if (type === 'announcement') {
    subDirectory = 'announcements/';
  } else if (type === 'post') {
    subDirectory = 'posts/';
  }
  
  return `/uploads/${subDirectory}${filename}`;
};

// Helper function to delete file
const deleteFile = async (filename, type = '') => {
  try {
    let targetDir = uploadDirectories.root;
    
    if (type === 'profile') {
      targetDir = uploadDirectories.profiles;
    } else if (type === 'announcement') {
      targetDir = uploadDirectories.announcements;
    } else if (type === 'post') {
      targetDir = uploadDirectories.posts;
    }
    
    const filepath = path.join(targetDir, filename);
    
    if (fs.existsSync(filepath)) {
      await fs.promises.unlink(filepath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Helper to clean old files from a directory
const cleanOldFiles = async (type = '', maxAgeHours = 24) => {
  try {
    let targetDir = uploadDirectories.root;
    
    if (type === 'profile') {
      targetDir = uploadDirectories.profiles;
    } else if (type === 'announcement') {
      targetDir = uploadDirectories.announcements;
    } else if (type === 'post') {
      targetDir = uploadDirectories.posts;
    }

    const files = await fs.promises.readdir(targetDir);
    const now = Date.now();
    const maxAge = maxAgeHours * 60 * 60 * 1000;

    for (const file of files) {
      const filePath = path.join(targetDir, file);
      const stats = await fs.promises.stat(filePath);
      if (now - stats.mtimeMs > maxAge) {
        await fs.promises.unlink(filePath);
        console.log(`Deleted old file: ${file}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning old files:', error);
  }
};

module.exports = {
  upload,
  getFileUrl,
  deleteFile,
  uploadDirectories,
  cleanOldFiles
};