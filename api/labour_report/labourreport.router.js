const { createUser,getAll,createContractor, getAllContractor, getAllContracterRecored, deleteContractor, searchContractor, editContractorName, deleteContractorReport, editContractor, getAllGroup,downloadGetAllExcel, downloadGetAllPdf, downloadContractorWiseGetAllExcel, downloadContractorWiseGetAllPdf} = require("./labourreport.controller");
const router = require("express").Router();
const multer = require('multer');
var upload = multer().array();

// router.post("/", createUser);
router.get("/", getAll);
router.get("/group", getAllGroup);


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
  router.get("/getContractor", getAllContractor);
  router.get("/getContractorWise", getAllContracterRecored);
  router.get("/getContractorWise/downloadGetAllExcel", downloadContractorWiseGetAllExcel);
  router.get("/getContractorWise/downloadGetAllPdf", downloadContractorWiseGetAllPdf);
  router.get("/deleteContractorReport/:id", deleteContractorReport);
  router.get("/downloadGetAllExcel", downloadGetAllExcel);
  router.get("/downloadGetAllPdf", downloadGetAllPdf);
  router.get("/getContractorWise", getAllContracterRecored);
  router.post("/", fileupload.single('image'), createUser);
  router.post("/addContractor", fileupload.single('image'), createContractor);
  router.post("/deleteContractorName", upload, deleteContractor);
  router.post("/searchContractorName", upload, searchContractor);
  router.post("/editContractorName", upload, editContractorName);
  router.post("/editContractor", upload, editContractor);

module.exports = router;