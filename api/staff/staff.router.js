const { createUser,getAll,deleteStaff,getnameByidC,editStaff,getGroup,downloadGetAllExcel,downloadGetAllPdf,createUser_Staff,getName,editName,deleteName,searchName,getAllSuggName,CreateNameC } = require("./staff.controller");
const router = require("express").Router();
const multer = require('multer');
var upload = multer().array();
const fs = require("fs");
const { Buffer } = require('buffer');
// router.post("/", createUser);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      var fileData = file.originalname.split('.');
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileData[fileData.length - 1])
    }
  });
  
  var fileupload = multer({storage:storage});
  router.post("/", fileupload.single('image'), createUser);
  router.post("/createUser_Staff", upload, createUser_Staff);
  router.post("/editStaff", upload, editStaff);
  router.get("/", getAll);
  router.get("/downloadGetAllExcel", downloadGetAllExcel);
  router.get("/downloadGetAllPdf", downloadGetAllPdf);
  router.get("/group", getGroup);
  router.get("/delete/:id", deleteStaff);
  router.get("/getName", upload, getName);
  router.get("/getAllSuggName", upload, getAllSuggName);
  router.post("/editName", upload, editName);
  router.post("/deleteName", upload, deleteName);
  router.post("/searchName", upload, searchName);
  router.post("/CreateNameC", upload, CreateNameC);
  router.get("/getnameByidC", upload, getnameByidC);

 

module.exports = router;