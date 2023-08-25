const { create,getAll,deleteMachinery,editMachinery,addService,getAllService,editService,deleteService,getGroupAll } = require("./machinery.service");

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
    getGroupAll:(req, res) => {
        var data = req.query;
        getGroupAll(data,(err, results) => {
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
    addService: (req, res) => {
        const body = req.body;
        addService(body, (err, results) => {
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
    getAllService:(req, res) => {
        var data = req.query;
        getAllService(data,(err, results) => {
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
    deleteService:(req, res) => {
        var data = req.params;
        deleteService(data,(err, results) => {
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
    editService:(req, res) => {
        var data = req.body;
        editService(data,(err, results) => {
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
    downloadGetAllExcel: (req, res) => {
        var data = req.query;
        
        getAll(data, (err, results) => {
            if (err) {
                return;
            }
            
            var wb = new xl.Workbook();
            var ws = wb.addWorksheet('Vehical Report');

            ws.cell(1, 1).string('Date');
            ws.cell(1, 2).string('Name');
            ws.cell(1, 3).string('Vehicale No');
            ws.cell(1, 4).string('Insurance');
            ws.cell(1, 5).string('Registration Date');
            ws.cell(1, 6).string('RC Book');
            ws.cell(1, 7).string('PUC');
            ws.cell(1, 8).string('Fitness');
            ws.cell(1, 9).string('Form 10');
            ws.cell(1, 10).string('CNG Kit');

            var rowIndex = 2;
            results.forEach((element, index) => {
                ws.cell(rowIndex, 1).string(`${element.date}`);
                ws.cell(rowIndex, 2).string(`${element.name}`);
                ws.cell(rowIndex, 3).string(`${element.vehical}`);
                ws.cell(rowIndex, 4).string(`${element.insurance}`);
                ws.cell(rowIndex, 5).string(`${element.registration_date}`);
                ws.cell(rowIndex, 6).string(`${element.rc_book}`);
                ws.cell(rowIndex, 7).string(`${element.puc}`);
                ws.cell(rowIndex, 8).string(`${element.fitness}`);
                ws.cell(rowIndex, 9).string(`${element.form_10}`);
                ws.cell(rowIndex, 10).string(`${element.cng_kit}`);
                rowIndex++;
            });
            var name = 'VehicalReportExcel'+moment().format('x')+'.xlsx';
            wb.write(`./public/excel/${name}`, function(err, stats) {
                if (err) {
                    console.error(err);
                } else {
                    return res.json({
                        success: 1,
                        message: 'Vehical Report excel file has been successfully created',
                        fileLink: `/public/excel/${name}`
                    });
                }
            });
        });
    },
    downloadGetAllPdf: (req, res) => {
        var data = req.query;
        
        getAll(data, (err, results) => {
            if (err) {
                return;
            }
            
            var data = [[{ text: 'Date', style: 'tableHeader' }, { text: 'Name', style: 'tableHeader' }, { text: 'Vehicale No', style: 'tableHeader' }, { text: 'Insurance', style: 'tableHeader' }, { text: 'Registration Date', style: 'tableHeader' }, { text: 'RC Book', style: 'tableHeader' }, { text: 'PUC', style: 'tableHeader' }, { text: 'Fitness', style: 'tableHeader' }, { text: 'Form 10', style: 'tableHeader' }, { text: 'CNG Kit', style: 'tableHeader' }]];
            results.forEach((element, index) => {
                data.push([`${element.date}`,`${element.name}`,`${element.vehical}`,`${element.insurance}`,`${element.registration_date}`,`${element.rc_book}`,`${element.puc}`,`${element.fitness}`,`${element.form_10}`,`${element.cng_kit}`]);
            });
            
            var docDefinition = {
                pageMargins: [10, 10, 10, 10],
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
                        margin: [0, 0, 0, 0]
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
            var name = 'VehicalReportPdf'+moment().format('x')+'.pdf';
            
            pdfDoc.pipe(fs.createWriteStream(`./public/pdf/${name}`));
            pdfDoc.end();
            return res.json({
                success: 1,
                message: 'Vehical Report pdf file has been successfully created',
                fileLink: `/public/pdf/${name}`
            });
        });
    },
    downloadServicesGetAllExcel: (req, res) => {
        var data = req.query;
        
        getAllService(data, (err, results) => {
            if (err) {
                return;
            }
            
            var wb = new xl.Workbook();
            var ws = wb.addWorksheet('Vehical Services Report');

            ws.cell(1, 1).string('Date');
            ws.cell(1, 2).string('Hours');
            ws.cell(1, 3).string('Description');
            ws.cell(1, 4).string('Next Service Hrs');

            var rowIndex = 2;
            results.forEach((element, index) => {
                ws.cell(rowIndex, 1).string(`${element.date}`);
                ws.cell(rowIndex, 2).string(`${element.hours}`);
                ws.cell(rowIndex, 3).string(`${element.description}`);
                ws.cell(rowIndex, 4).string(`${element.next_service_hrs}`);
                rowIndex++;
            });
            var name = 'VehicalServiceReportExcel'+moment().format('x')+'.xlsx';
            wb.write(`./public/excel/${name}`, function(err, stats) {
                if (err) {
                    console.error(err);
                } else {
                    return res.json({
                        success: 1,
                        message: 'Vehical Service Report excel file has been successfully created',
                        fileLink: `/public/excel/${name}`
                    });
                }
            });
        });
    },
    downloadServicesGetAllPdf: (req, res) => {
        var data = req.query;
        
        getAllService(data, (err, results) => {
            if (err) {
                return;
            }
            
            var data = [[{ text: 'Date', style: 'tableHeader' }, { text: 'Hours', style: 'tableHeader' }, { text: 'Description', style: 'tableHeader' }, { text: 'Next Service Hrs', style: 'tableHeader' }]];
            results.forEach((element, index) => {
                data.push([`${element.date}`,`${element.hours}`,`${element.description}`,`${element.next_service_hrs}`]);
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
            var name = 'VehicalServiceReportPdf'+moment().format('x')+'.pdf';
            
            pdfDoc.pipe(fs.createWriteStream(`./public/pdf/${name}`));
            pdfDoc.end();
            return res.json({
                success: 1,
                message: 'Vehical Service Report pdf file has been successfully created',
                fileLink: `/public/pdf/${name}`
            });
        });
    }
}
