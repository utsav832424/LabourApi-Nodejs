const { additem, searchItem, addAsset, getGroup, getAll, deleteAsset, editAsset,downloadGetAllExcel,downloadGetAllPdf,downloadGroupGetAllExcel,downloadGroupGetAllPdf, getUserWiseItem, getAssetByName, getNameWiseAssesByItem, downloadAssetAllByNameExcel, downloadAssetAllByNamePdf,getName,editName,deleteName} = require("./asset_transfer.controller");
const router = require("express").Router();
const multer = require('multer');
var upload = multer().array();



router.get("/", getAll);
router.get("/downloadGetAllExcel", downloadGetAllExcel);
router.get("/downloadGetAllPdf", downloadGetAllPdf);
router.get("/group", getGroup);
router.get("/group/downloadGetAllExcel", downloadGroupGetAllExcel);
router.get("/group/downloadGetAllPdf", downloadGroupGetAllPdf);
router.get("/delete/:id", deleteAsset);
router.post("/addItem", upload, additem);
router.post("/searchItemName", upload, searchItem);
router.post("/addAsset", upload, addAsset);
router.post("/edit", upload, editAsset);
router.get("/getUserWiseItem/:id", getUserWiseItem);
router.get("/getAssestByName", getAssetByName);
router.post("/getAssestByItem", upload, getNameWiseAssesByItem);
router.get("/downloadAssetAllByNameExcel", downloadAssetAllByNameExcel);
router.get("/downloadAssetAllByNamePdf", downloadAssetAllByNamePdf);
router.get("/getName", upload, getName);
router.post("/editName", upload, editName);
router.post("/deleteName", upload, deleteName);

module.exports = router;