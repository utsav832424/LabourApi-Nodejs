const { create,getAll,deleteMachinery,editMachinery,getAllGroup,addName, getName, editName, deleteName, searchName, getVehicalAll ,getSupplierAll,getTotalQty} = require("./machinery.service");

const { genSaltSync, hashSync } = require("bcrypt");
const XLSX = require("xlsx");
const xl = require('excel4node');
const mime = require('mime');
var moment = require('moment');
const Pdfmake = require('pdfmake');
const fs = require('fs');
var fonts = {
	Roboto: {
		normal: 'api/fonts/Roboto-Regular.ttf',
		bold: 'api/fonts/Roboto-Medium.ttf',
		italics: 'api/fonts/Roboto-Italic.ttf',
		bolditalics: 'api/fonts/Roboto-MediumItalic.ttf'
	}
};
let pdfmake = new Pdfmake(fonts);

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        // const salt = genSaltSync(10);
        // body.password = hashSync(body.password, salt);
        create(body, (err, results) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results,
                message: "Machinery has been successfully ."
            })
        });

    },
    getAll:(req, res) => {
        var data = req.query;
        getAll(data,(err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ 
                    success: 0,
                    message: "Database connection errror"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results,
                message: "Machinery has been successfully ."
            });
        });
    },
    getVehicalAll:(req, res) => {
        var data = req.query;
        getVehicalAll(data,(err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ 
                    success: 0,
                    message: "Database connection errror"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results,
                message: "Machinery has been successfully ."
            });
        });
    },
    getSupplierAllC:(req, res) => {
        var data = req.query;
        getSupplierAll(data,(err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ 
                    success: 0,
                    message: "Database connection errror"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results,
                message: "Machinery has been successfully ."
            });
        });
    },
    deleteMachineryReport:(req, res) => {
        var data = req.params;
        deleteMachinery(data,(err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ 
                    success: 0,
                    message: "Database connection errror"
                });
            }
            return res.status(200).json({
                success: 1,
                message: 'Machinery report has been successfully deleted'
            });
        });
    },
    editMachinery:(req, res) => {
        var data = req.body;
        editMachinery(data,(err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ 
                    success: 0,
                    message: "Database connection errror"
                });
            }
            return res.status(200).json({
                success: 1,
                message: 'Machinery report has been successfully updated'
            });
        });
    },
    getAllGroup:(req, res) => {
        var data = req.query;
        getAllGroup(data,(err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ 
                    success: 0,
                    message: "Database connection errror"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results,
                message: "Machinery has been successfully ."
            });
        });
    },
    addName: (req, res) => {
        const body = req.body;
        addName(body, (err, results) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results,
                message: "Material Name has been successfully ."
            })
        });

    },
    getName:(req, res) => {
        var data = req.query;
        getName(data,(err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ 
                    success: 0,
                    message: "Database connection errror"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results,
                message: "Material has been successfully ."
            });
        });
    },
    searchName:(req, res) => {
        var data = req.body;
        searchName(data,(err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ 
                    success: 0,
                    message: "Database connection errror"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results,
                message: "Material has been successfully ."
            });
        });
    },
    editName:(req, res) => {
        var data = req.body;
        editName(data,(err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ 
                    success: 0,
                    message: "Database connection errror"
                });
            }
            return res.status(200).json({
                success: 1,
                message: 'Material report has been successfully updated'
            });
        });
    },
    deleteName:(req, res) => {
        var data = req.body;
        deleteName(data,(err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ 
                    success: 0,
                    message: "Database connection errror"
                });
            }
            return res.status(200).json({
                success: 1,
                message: 'Material report has been successfully deleted'
            });
        });
    },
    downloadGetAllExcel: (req, res) => {
        var data = req.query;
        
        getAll(data, (err, results) => {
            if (err) {
                return;
            }
            
            var wb = new xl.Workbook();
            var ws = wb.addWorksheet('Machinery Report');

            ws.cell(1, 1).string('Sr.No');
            ws.cell(1, 2).string('Date');
            ws.cell(1, 3).string('Supplier Name');
            ws.cell(1, 4).string('Vehicale');
            ws.cell(1, 5).string('Vehicale No');
            ws.cell(1, 6).string('Operator');
            ws.cell(1, 7).string('Unit');
            ws.cell(1, 8).string('Qty');

            var rowIndex = 2;
            results.forEach((element, index) => {
                ws.cell(rowIndex, 1).string(`${index + 1}`);
                ws.cell(rowIndex, 2).string(`${element.date}`);
                ws.cell(rowIndex, 3).string(`${element.suppliername}`);
                ws.cell(rowIndex, 4).string(`${element.vehicle}`);
                ws.cell(rowIndex, 5).string(`${element.vehicle_no}`);
                ws.cell(rowIndex, 6).string(`${element.operator}`);
                ws.cell(rowIndex, 7).string(`${element.unit}`);
                ws.cell(rowIndex, 8).string(`${element.qty}`);
                rowIndex++;
            });
            var name = 'MachineryExcel'+moment().format('x')+'.xlsx';
            wb.write(`./public/excel/${name}`, function(err, stats) {
                if (err) {
                    console.error(err);
                } else {
                    return res.json({
                        success: 1,
                        message: 'Machinery excel file has been successfully created',
                        fileLink: `/public/excel/${name}`
                    });
                }
            });
        });
    },
    downloadGetAllPdf: (req, res) => {
        var data = req.query;
        data.date = 'asc';
        getAll(data, (err, results) => {
            if (err) {
                return;
            }
            
            var data = [[{ text: 'Sr.No', style: 'tableHeader' }, { text: 'Date', style: 'tableHeader' }, { text: 'Supplier Name', style: 'tableHeader' }, { text: 'Vehicale', style: 'tableHeader' }, { text: 'Vehicale No', style: 'tableHeader' }, { text: 'Operator', style: 'tableHeader' }, { text: 'Unit', style: 'tableHeader' }, { text: 'Qty', style: 'tableHeader' }]];
            results.forEach((element, index) => {
                data.push([`${index + 1}`,`${element.date}`,`${element.suppliername}`,`${element.vehicle}`,`${element.vehicle_no}`,`${element.operator}`,`${element.unit}`,`${element.qty}`]);
            });
            
            var docDefinition = {
                content: [
                    {
                        style: 'tableExample',
                        table: {
                            headerRows: 1,
                            body: data
                        }
                    },
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },
                    subheader: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 5]
                    },
                    tableExample: {
                        margin: [0, 5, 0, 15]
                    },
                    tableOpacityExample: {
                        margin: [0, 5, 0, 15],
                        fillColor: 'blue',
                        fillOpacity: 0.3
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black'
                    }
                },
                defaultStyle: {
                    // alignment: 'justify'
                }
            };
            var pdfDoc = pdfmake.createPdfKitDocument(docDefinition, {});
            var name = 'MachineryPdf'+moment().format('x')+'.pdf';
            
            pdfDoc.pipe(fs.createWriteStream(`./public/pdf/${name}`));
            pdfDoc.end();
            return res.json({
                success: 1,
                message: 'Machinery pdf file has been successfully created',
                fileLink: `/public/pdf/${name}`
            });
        });
    },
    downloadGetAllVehicalExcel: (req, res) => {
        var data = req.query;
        
        getVehicalAll(data, (err, results) => {
            if (err) {
                return;
            }
            
            var wb = new xl.Workbook();
            var ws = wb.addWorksheet('Machinery Report');

            ws.cell(1, 1).string('Sr.No');
            ws.cell(1, 2).string('Date');
            ws.cell(1, 3).string('Supplier Name');
            ws.cell(1, 4).string('Vehicale');
            ws.cell(1, 5).string('Vehicale No');
            ws.cell(1, 6).string('Operator');
            ws.cell(1, 7).string('Unit');
            ws.cell(1, 8).string('Qty');

            var rowIndex = 2;
            results.data.forEach((element, index) => {
                ws.cell(rowIndex, 1).string(`${index + 1}`);
                ws.cell(rowIndex, 2).string(`${element.date}`);
                ws.cell(rowIndex, 3).string(`${element.suppliername}`);
                ws.cell(rowIndex, 4).string(`${element.vehicle}`);
                ws.cell(rowIndex, 5).string(`${element.vehicle_no}`);
                ws.cell(rowIndex, 6).string(`${element.operator}`);
                ws.cell(rowIndex, 7).string(`${element.unit}`);
                ws.cell(rowIndex, 8).string(`${element.qty}`);
                rowIndex++;
            });
            ws.cell(rowIndex,3).string('Total');
            ws.cell(rowIndex,8).string(`${results.total.total_qty}`);
            var name = 'MachineryVehicalExcel'+moment().format('x')+'.xlsx';
            wb.write(`./public/excel/${name}`, function(err, stats) {
                if (err) {
                    console.error(err);
                } else {
                    return res.json({
                        success: 1,
                        message: 'Machinery excel file has been successfully created',
                        fileLink: `/public/excel/${name}`
                    });
                }
            });
        });
    },
    downloadGetAllSupplierExcel: (req, res) => {
        var data = req.query;
        
        getSupplierAll(data, (err, results) => {
            if (err) {
                return;
            }
            
            var wb = new xl.Workbook();
            var ws = wb.addWorksheet('Machinery Report');

            ws.cell(1, 1).string('Sr.No');
            ws.cell(1, 2).string('Date');
            ws.cell(1, 3).string('Supplier Name');
            ws.cell(1, 4).string('Vehicale');
            ws.cell(1, 5).string('Vehicale No');
            ws.cell(1, 6).string('Operator');
            ws.cell(1, 7).string('Unit');
            ws.cell(1, 8).string('Qty');

            var rowIndex = 2;
            results.data.forEach((element, index) => {
                ws.cell(rowIndex, 1).string(`${index + 1}`);
                ws.cell(rowIndex, 2).string(`${element.date}`);
                ws.cell(rowIndex, 3).string(`${element.suppliername}`);
                ws.cell(rowIndex, 4).string(`${element.vehicle}`);
                ws.cell(rowIndex, 5).string(`${element.vehicle_no}`);
                ws.cell(rowIndex, 6).string(`${element.operator}`);
                ws.cell(rowIndex, 7).string(`${element.unit}`);
                ws.cell(rowIndex, 8).string(`${element.qty}`);
                rowIndex++;
            });
            ws.cell(rowIndex,3).string('Total');
            ws.cell(rowIndex,8).string(`${results.total.total_qty}`);
            var name = 'MachineryVehicalExcel'+moment().format('x')+'.xlsx';
            wb.write(`./public/excel/${name}`, function(err, stats) {
                if (err) {
                    console.error(err);
                } else {
                    return res.json({
                        success: 1,
                        message: 'Machinery excel file has been successfully created',
                        fileLink: `/public/excel/${name}`
                    });
                }
            });
        });
    },
    downloadGetAllVehicalPdf: (req, res) => {
        var data = req.query;
        data.date = 'asc';
        getVehicalAll(data, (err, results) => {
            if (err) {
                return;
            }
            
            var data = [[{ text: 'Sr.No', style: 'tableHeader' }, { text: 'Date', style: 'tableHeader' }, { text: 'Supplier Name', style: 'tableHeader' }, { text: 'Vehicale', style: 'tableHeader' }, { text: 'Vehicale No', style: 'tableHeader' }, { text: 'Operator', style: 'tableHeader' }, { text: 'Unit', style: 'tableHeader' }, { text: 'Qty', style: 'tableHeader' }]];
            results.data.forEach((element, index) => {
                data.push([`${index + 1}`,`${element.date}`,`${element.suppliername}`,`${element.vehicle}`,`${element.vehicle_no}`,`${element.operator}`,`${element.unit}`,`${element.qty}`]);
            });
            data.push(['','','Total','','','','',`${results.total.total_qty}`]);
            var docDefinition = {
                content: [
                    {
                        style: 'tableExample',
                        table: {
                            headerRows: 1,
                            body: data
                        }
                    },
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },
                    subheader: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 5]
                    },
                    tableExample: {
                        margin: [0, 5, 0, 15]
                    },
                    tableOpacityExample: {
                        margin: [0, 5, 0, 15],
                        fillColor: 'blue',
                        fillOpacity: 0.3
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black'
                    }
                },
                defaultStyle: {
                    // alignment: 'justify'
                }
            };
            var pdfDoc = pdfmake.createPdfKitDocument(docDefinition, {});
            var name = 'MachineryVehicalPdf'+moment().format('x')+'.pdf';
            
            pdfDoc.pipe(fs.createWriteStream(`./public/pdf/${name}`));
            pdfDoc.end();
            return res.json({
                success: 1,
                message: 'Machinery pdf file has been successfully created',
                fileLink: `/public/pdf/${name}`
            });
        });
    },
    downloadGetAllSupplierPdf: (req, res) => {
        var data = req.query;
        data.date = 'asc';
        getSupplierAll(data, (err, results) => {
            if (err) {
                return;
            }
            
            var data = [[{ text: 'Sr.No', style: 'tableHeader' }, { text: 'Date', style: 'tableHeader' }, { text: 'Supplier Name', style: 'tableHeader' }, { text: 'Vehicale', style: 'tableHeader' }, { text: 'Vehicale No', style: 'tableHeader' }, { text: 'Operator', style: 'tableHeader' }, { text: 'Unit', style: 'tableHeader' }, { text: 'Qty', style: 'tableHeader' }]];
            results.data.forEach((element, index) => {
                data.push([`${index + 1}`,`${element.date}`,`${element.suppliername}`,`${element.vehicle}`,`${element.vehicle_no}`,`${element.operator}`,`${element.unit}`,`${element.qty}`]);
            });
            data.push(['','','Total','','','','',`${results.total.total_qty}`]);
            var docDefinition = {
                content: [
                    {
                        style: 'tableExample',
                        table: {
                            headerRows: 1,
                            body: data
                        }
                    },
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },
                    subheader: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 5]
                    },
                    tableExample: {
                        margin: [0, 5, 0, 15]
                    },
                    tableOpacityExample: {
                        margin: [0, 5, 0, 15],
                        fillColor: 'blue',
                        fillOpacity: 0.3
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black'
                    }
                },
                defaultStyle: {
                    // alignment: 'justify'
                }
            };
            var pdfDoc = pdfmake.createPdfKitDocument(docDefinition, {});
            var name = 'MachineryVehicalPdf'+moment().format('x')+'.pdf';
            
            pdfDoc.pipe(fs.createWriteStream(`./public/pdf/${name}`));
            pdfDoc.end();
            return res.json({
                success: 1,
                message: 'Machinery pdf file has been successfully created',
                fileLink: `/public/pdf/${name}`
            });
        });
    },
    getTotalQty:(req, res) => {
        var data = req.query;
        getTotalQty(data,(err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ 
                    success: 0,
                    message: "Database connection errror"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results,
                message: "Qty has been successfully ."
            });
        });
    },
}
