const { createUser ,getAll, editOperator, getnameByidC,deleteOperator, getAllGroup, downloadGetAllExcel, downloadGetAllPdf,createUser_Operator,getName,editName,deleteName,searchName,getAllSuggName,CreateNameC} = require("./operator.controller");
const router = require("express").Router();

// router.post("/", createUser);
router.get("/", getAll);
router.get("/group", getAllGroup);
router.get("/delete/:id", deleteOperator);
router.get("/downloadGetAllExcel", downloadGetAllExcel);
router.get("/downloadGetAllPdf", downloadGetAllPdf);

const multer = require('multer');
var upload = multer().array();


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
  router.post("/editOperator", upload, editOperator);
  router.post("/createUser_Operator", upload, createUser_Operator);
  router.get("/getName", upload, getName);
  router.post("/editName", upload, editName);
  router.get("/getAllSuggName", upload, getAllSuggName);
  router.post("/deleteName", upload, deleteName);
  router.post("/searchName", upload, searchName);
  router.post("/CreateNameC", upload, CreateNameC);
  router.get("/getnameByidCop", upload, getnameByidC);

module.exports = router;