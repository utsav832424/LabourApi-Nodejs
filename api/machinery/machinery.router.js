const { createUser,getAll,deleteMachineryReport,editMachinery,addService,getAllService,deleteService,editService,getGroupAll,downloadGetAllExcel,downloadGetAllPdf,downloadServicesGetAllExcel,downloadServicesGetAllPdf } = require("./machinery.controller");
const router = require("express").Router();

// router.post("/", createUser);
router.get("/", getAll);
router.get("/group", getGroupAll);
router.get("/service", getAllService);
router.get("/delete/:id", deleteMachineryReport);
router.get("/services/delete/:id", deleteService);
router.get("/downloadGetAllExcel", downloadGetAllExcel);
router.get("/downloadGetAllPdf", downloadGetAllPdf);
router.get("/services/downloadGetAllExcel", downloadServicesGetAllExcel);
router.get("/services/downloadGetAllPdf", downloadServicesGetAllPdf);

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
  router.post("/", upload, createUser);
  router.post("/editMachinery", upload, editMachinery);
  router.post("/addService", upload, addService);
  router.post("/editService", upload, editService);

module.exports = router;