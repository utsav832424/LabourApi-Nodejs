require("dotenv").config();
const express = require("express");
const fs = require("fs");
const xlsx = require('xlsx');
const app = express();
const labourRouter = require("./api/labour_report/labourreport.router");
const machineryRouter = require("./api/machinery_report/machinery.router");
const materialRouter = require("./api/material_received/material.router");
const dieselRouter = require("./api/diesel_report/diesel.router");
const staffRouter = require("./api/staff/staff.router");
const operatorRouter = require("./api/operator/operator.router");
const userRouter = require("./api/users/user.router");
const vihicalRouter = require("./api/machinery/machinery.router");
const assetTransfer = require("./api/asset_transfer/asset_transfer.router");

app.use(express.json());

app.use("/api/labour", labourRouter);
app.use("/api/machinery", machineryRouter);
app.use("/api/materials", materialRouter);
app.use("/api/diesel", dieselRouter);
app.use("/api/staff", staffRouter);
app.use("/api/operator", operatorRouter);
app.use("/api/users", userRouter);
app.use("/api/vihical", vihicalRouter);
app.use("/api/assetTransfer", assetTransfer);

app.get('/getfile', function (req, res) {
    const body = req.query;
    var externalURL = `.${body.url}`;
    console.log(externalURL);
    // var externalURL = req.query.external;
    // var file = fs.readFileSync(externalURL, { encoding: "utf8" });
    // return res.status(200).json({
    //     data : file
    // })
    var file = fs.createReadStream(externalURL);
    file.pipe(res);
    // console.log(file.toString());
});

app.listen(process.env.APP_PORT, () => {
    console.log("Server up and running on PORT : ", process.env.APP_PORT);
});