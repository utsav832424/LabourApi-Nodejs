const { createUser,getAll,deleteMaterialReport,editMaterial,getAllGroup,downloadGetAllExcel,downloadGetAllPdf,addMaterialName,getName,editName,deleteName, searchName, getVehical, downloadGetAllVehicalExcel, downloadGetAllVehicalPdf,getSupplier,downloadGetAllSupplierPdf,downloadGetAllSupplierExcel,getTotalQty } = require("./material.controller");
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
  router.get("/downloadGetAllVehicalPdf", downloadGetAllVehicalPdf);
  router.get("/downloadGetAllSupplierPdf", downloadGetAllSupplierPdf);
  router.get("/downloadGetAllSupplierExcel", downloadGetAllSupplierExcel);
  router.get("/group", getAllGroup);
  router.get("/delete/:id", deleteMaterialReport);
  router.post("/", fileupload.single('image'), createUser);
  router.post("/editMaterial", upload, editMaterial);
  router.post("/addMaterialName", upload, addMaterialName);
  router.get("/getName", upload, getName);
  router.post("/searchName", upload, searchName);
  router.post("/editName", upload, editName);
  router.post("/deleteName", upload, deleteName);
  router.get("/getVehical", upload, getVehical);
  router.get("/getSupplier", upload, getSupplier);
  router.get("/getTotalQty", upload, getTotalQty);

module.exports = router;