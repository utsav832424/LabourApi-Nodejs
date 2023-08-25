const { createUser,getAll,deleteMachineryReport,editMachinery,getAllGroup,downloadGetAllExcel,downloadGetAllPdf,addName,getName,editName,deleteName, searchName, getVehicalAll, getSupplierAllC,downloadGetAllVehicalPdf, downloadGetAllVehicalExcel,getTotalQty,downloadGetAllSupplierExcel,downloadGetAllSupplierPdf} = require("./machinery.controller");
const router = require("express").Router();

// router.post("/", createUser);


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
  router.get("/", getAll);
  router.get("/downloadGetAllExcel", downloadGetAllExcel);
  router.get("/downloadGetAllPdf", downloadGetAllPdf);
  router.get("/downloadGetAllVehicalExcel", downloadGetAllVehicalExcel);
  router.get("/downloadGetAllSupplierExcel", downloadGetAllSupplierExcel);
  router.get("/downloadGetAllVehicalPdf", downloadGetAllVehicalPdf);
  router.get("/downloadGetAllSupplierPdf", downloadGetAllSupplierPdf);
  router.get("/group", getAllGroup);
  router.get("/delete/:id", deleteMachineryReport);
  router.post("/", fileupload.single('image'), createUser);
  router.post("/editMachinery", upload, editMachinery);
  router.post("/addName", upload, addName);
  router.get("/getName", upload, getName);
  router.post("/editName", upload, editName);
  router.post("/deleteName", upload, deleteName);
  router.post("/searchName", upload, searchName);
  router.get("/getVehicalAll", upload, getVehicalAll);
  router.get("/getSupplierAllC", upload, getSupplierAllC);
  router.get("/getTotalQty", upload, getTotalQty);

module.exports = router;