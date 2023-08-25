const { createUser,getAll,addNewDiesel,deleteDiesel,editDiesel,getAllGroup,getAllDiesel,downloadGetAllExcel,downloadGetAllPdf,getVehicalAllC,downloadGetAllVechicalPdf,downloadGetAllVechicalExcel,downloadGetAllLtrPdf,downloadGetLtrExcel,createVehicleC,searchName,getName,editName,deleteName } = require("./diesel.controller");
const router = require("express").Router();

// router.post("/", createUser);
router.get("/", getAll);
router.get("/downloadGetAllExcel", downloadGetAllExcel);
router.get("/downloadGetAllPdf", downloadGetAllPdf);
router.get("/getAllDiesel", getAllDiesel);
router.get("/group", getAllGroup);
router.get("/delete/:id", deleteDiesel);
router.get("/getVehicalAllC", getVehicalAllC);
router.get("/downloadGetAllVechicalPdf", downloadGetAllVechicalPdf);
router.get("/downloadGetAllVechicalExcel", downloadGetAllVechicalExcel);
router.get("/downloadGetAllLtrPdf", downloadGetAllLtrPdf);
router.get("/downloadGetLtrExcel", downloadGetLtrExcel);

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
  router.post("/createVehicleC",upload, createVehicleC);
  router.post("/addNewDiesel", upload, addNewDiesel);
  router.post("/editDiesel", upload, editDiesel);
  router.post("/searchName", upload, searchName);
  router.get("/getName", upload, getName);
  router.post("/editName", upload, editName);
  router.post("/deleteName", upload, deleteName);

module.exports = router;