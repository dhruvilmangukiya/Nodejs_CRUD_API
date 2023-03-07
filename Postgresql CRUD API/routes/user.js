const express = require('express');
const user = require('../controllers/user');
const auth = require("../middleware/auth");
const router = express.Router();
const path = require("path");

const multer = require('multer');
const { v4 : uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + path.extname(file.originalname));
    }
});

const upload = multer({
storage: storage,
fileFilter: (req, file, cb) => {
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'){
      cb(null, true);
    } else{
      cb(null, false);
      return cb(new Error("Only .png, .jpg, and .jpeg File Format Allowed...!"));
    } 
},
    
}).single('image');

router.post("/addUser",upload, user.signUp);

router.post("/loginUser", user.signIn);

router.post("/changePwd", auth, user.changePassword);

router.get("/getAllUser",auth,user.getUsersDetails);

router.get("/paginationUser",auth,user.paginationUser);

router.get("/:id",auth,user.getUserById);

router.patch("/:id",auth,upload,user.updateUserDetails);

router.delete("/:id",auth,user.deleteUserDetails);

module.exports = router;