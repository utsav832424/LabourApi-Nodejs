const { create,getAll,createContractor, getContractor, checkContractor, getContracterWise, deleteContractor, searchContractor, editContractorName, deleteContractorReport, editContractor, getGroup} = require("./labourreport.service");

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
                message: "Labourreport has been successfully ."
            })
        });

    },
    createContractor: (req, res) => {
        const body = req.body;
        
        checkContractor(body, (err, results) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            console.log("results", results, body);
            if (results.length == 0) {
                createContractor(body, (err, results) => {
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
                        message: "Contractor has been successfully added."
                    })
                });
            } else {
                return res.status(500).json({
                    success: 0,
                    message: "Name already exists, Please try again"
                });
            }
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
                message: "Labourreport has been successfully ."
            });
        });
    },
    getAllGroup:(req, res) => {
        var data = req.query;
        getGroup(data,(err, results) => {
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
                message: "Labourreport has been successfully ."
            });
        });
    },
    getAllContracterRecored:(req, res) => {
        var data = req.query;
        getContracterWise(data,(err, results) => {
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
                message: "Labourreport has been successfully ."
            });
        });
    },
    getAllContractor:(req, res) => {
        const body = req.query;
        getContractor(body,(err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ 
                    success: 0,
                    message: "Database connection errror"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results
            });
        });
    },
    deleteContractor:(req, res) => {
        var data = req.body;
        deleteContractor(data,(err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ 
                    success: 0,
                    message: "Database connection errror"
                });
            }
            return res.status(200).json({
                success: 1,
                message: 'Contractor name has been successfully deleted'
            });
        });
    },
    searchContractor:(req, res) => {
        var data = req.body;
        searchContractor(data,(err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ 
                    success: 0,
                    message: "Database connection errror"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results
            });
        });
    },
    editContractorName:(req, res) => {
        var data = req.body;
        editContractorName(data,(err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ 
                    success: 0,
                    message: "Database connection errror"
                });
            }
            return res.status(200).json({
                success: 1,
                message: 'Contractor name has been successfully updated'
            });
        });
    },
    deleteContractorReport:(req, res) => {
        var data = req.params;
        deleteContractorReport(data,(err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ 
                    success: 0,
                    message: "Database connection errror"
                });
            }
            return res.status(200).json({
                success: 1,
                message: 'Contractor report has been successfully deleted'
            });
        });
    },
    editContractor:(req, res) => {
        var data = req.body;
        editContractor(data,(err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ 
                    success: 0,
                    message: "Database connection errror"
                });
            }
            return res.status(200).json({
                success: 1,
                message: 'Contractor report has been successfully updated'
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
            var ws = wb.addWorksheet('Labour Report');

            ws.cell(1, 1).string('Date');
            ws.cell(1, 2).string('Contractor Name');
            ws.cell(1, 3).string('Labour');
            ws.cell(1, 5).string('Mason');
            ws.cell(1, 7).string('Carpenter');
            ws.cell(1, 9).string('Helper');

            ws.cell(2, 3).string('Full Day');
            ws.cell(2, 4).string('O.T HRS');
            ws.cell(2, 5).string('Full Day');
            ws.cell(2, 6).string('O.T HRS');
            ws.cell(2, 7).string('Full Day');
            ws.cell(2, 8).string('O.T HRS');
            ws.cell(2, 9).string('Full Day');
            ws.cell(2, 10).string('O.T HRS');

            var rowIndex = 3;
            results.data.forEach((element, index) => {
                ws.cell(rowIndex, 1).string(`${element.date}`);
                ws.cell(rowIndex, 2).string(`${element.contractorname}`);
                ws.cell(rowIndex, 3).string(`${element.labourfullday}`);
                ws.cell(rowIndex, 4).string(`${element.labourothrs}`);
                ws.cell(rowIndex, 5).string(`${element.masonfullday}`);
                ws.cell(rowIndex, 6).string(`${element.masonothrs}`);
                ws.cell(rowIndex, 7).string(`${element.carpenterfullday}`);
                ws.cell(rowIndex, 8).string(`${element.carprnterothrs}`);
                ws.cell(rowIndex, 9).string(`${element.helperfullday}`);
                ws.cell(rowIndex, 10).string(`${element.helperothrs}`);
                rowIndex++;
            });
            // rowIndex++;
            // ws.cell(rowIndex, 1).string('Total Labour Full Day');
            // ws.cell(rowIndex, 2).string('Total Labour O.T HRS');
            // ws.cell(rowIndex, 3).string('Total Mason Full Day');
            // ws.cell(rowIndex, 4).string('Total Mason O.T HRS');
            // ws.cell(rowIndex, 5).string('Total Carpenter Full Day');
            // ws.cell(rowIndex, 6).string('Total Carpenter O.T HRS');
            // ws.cell(rowIndex, 7).string('Total Helper Full Day');
            // ws.cell(rowIndex, 8).string('Total Helper O.T HRS');
            // rowIndex++;
            ws.cell(rowIndex, 2).string('Total');
            ws.cell(rowIndex, 3).string(`${results.total.totallabourfullday}`);
            ws.cell(rowIndex, 4).string(`${results.total.totallabourothrs / 8}`);
            ws.cell(rowIndex, 5).string(`${results.total.totalmasonfullday}`);
            ws.cell(rowIndex, 6).string(`${results.total.totalmasonothrs / 8}`);
            ws.cell(rowIndex, 7).string(`${results.total.totalcarpenterfullday}`);
            ws.cell(rowIndex, 8).string(`${results.total.totalcarprnterothrs / 8}`);
            ws.cell(rowIndex, 9).string(`${results.total.totalhelperfullday}`);
            ws.cell(rowIndex, 10).string(`${results.total.totalhelperothrs / 8}`);
            var name = 'LabourReportExcel'+moment().format('x')+'.xlsx';
            wb.write(`./public/excel/${name}`, function(err, stats) {
                if (err) {
                    console.error(err);
                } else {
                    return res.json({
                        success: 1,
                        message: 'Labour Report excel file has been successfully created',
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
            
            var data = [[{ text: 'Date', style: 'tableHeader' }, { text: 'Contractor Name', style: 'tableHeader' }, { text: 'Labour', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: 'Mason', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: 'Carpenter', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: 'Helper', style: 'tableHeader' }, { text: '', style: 'tableHeader' }],
            [{ text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: 'Full Day', style: 'tableHeader' }, { text: 'O.T HRS', style: 'tableHeader' }, { text: 'Full Day', style: 'tableHeader' }, { text: 'O.T HRS', style: 'tableHeader' }, { text: 'Full Day', style: 'tableHeader' }, { text: 'O.T HRS', style: 'tableHeader' }, { text: 'Full Day', style: 'tableHeader' }, { text: 'O.T HRS', style: 'tableHeader' }]];
            results.data.forEach((element, index) => {
                data.push([`${element.date}`,`${element.contractorname}`,`${element.labourfullday}`,`${element.labourothrs}`,`${element.masonfullday}`,`${element.masonothrs}`,`${element.carpenterfullday}`,`${element.carprnterothrs}`,`${element.helperfullday}`,`${element.helperothrs}`]);
            });
            data.push(['','Total',`${results.total.totallabourfullday}`,`${results.total.totallabourothrs / 8}`,`${results.total.totalmasonfullday}`,`${results.total.totalmasonothrs / 8}`,`${results.total.totalcarpenterfullday}`,`${results.total.totalcarprnterothrs / 8}`,`${results.total.totalhelperfullday}`,`${results.total.totalhelperothrs / 8}`]);
            var docDefinition = {
                content: [
                    {
                        style: 'tableExample',
                        table: {
                            headerRows: 1,
                            body: data
                        }
                    },
                    // {
                    //     columns: [
                    //         {
                    //             width: 150,
                    //             text: 'Total Labour Full Day'
                    //         },
                    //         {
                    //             width: 150,
                    //             text: 'Total Labour O.T HRS'
                    //         },
                    //         {
                    //             width: 130,
                    //             text: 'Total Mason Full Day'
                    //         },
                    //         {
                    //             width: 150,
                    //             text: 'Total Mason O.T HRS'
                    //         },
                    //     ]
                    // },
                    // {
                    //     columns: [
                    //         {
                    //             width: 150,
                    //             text: `${results.total.totallabourfullday}`
                    //         },
                    //         {
                    //             width: 150,
                    //             text: `${results.total.totallabourothrs / 8}`
                    //         },
                    //         {
                    //             width: 130,
                    //             text: `${results.total.totalmasonfullday}`
                    //         },
                    //         {
                    //             width: 150,
                    //             text: `${results.total.totalmasonothrs / 8}`
                    //         },
                    //     ]
                    // },
                    // {
                    //     columns: [
                    //         {
                    //             width: 150,
                    //             text: 'Total Carpenter Full Day'
                    //         },
                    //         {
                    //             width: 150,
                    //             text: 'Total Carpenter O.T HRS'
                    //         },
                    //         {
                    //             width: 130,
                    //             text: 'Total Helper Full Day'
                    //         },
                    //         {
                    //             width: 150,
                    //             text: 'Total Helper O.T HRS'
                    //         },
                    //     ]
                    // },
                    // {
                    //     columns: [
                    //         {
                    //             width: 150,
                    //             text: `${results.total.totalcarpenterfullday}`
                    //         },
                    //         {
                    //             width: 150,
                    //             text: `${results.total.totalcarprnterothrs / 8}`
                    //         },
                    //         {
                    //             width: 130,
                    //             text: `${results.total.totalhelperfullday}`
                    //         },
                    //         {
                    //             width: 150,
                    //             text: `${results.total.totalhelperothrs / 8}`
                    //         },
                    //     ]
                    // },
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
            var name = 'LabourReportPdf'+moment().format('x')+'.pdf';
            
            pdfDoc.pipe(fs.createWriteStream(`./public/pdf/${name}`));
            pdfDoc.end();
            return res.json({
                success: 1,
                message: 'Labour Report pdf file has been successfully created',
                fileLink: `/public/pdf/${name}`
            });
        });
    },
    downloadContractorWiseGetAllExcel: (req, res) => {
        var data = req.query;
        
        getContracterWise(data, (err, results) => {
            if (err) {
                return;
            }
            
            var wb = new xl.Workbook();
            var ws = wb.addWorksheet('Labour Report');

            ws.cell(1, 1).string('Date');
            ws.cell(1, 2).string('Contractor Name');
            ws.cell(1, 3).string('Labour');
            ws.cell(1, 5).string('Mason');
            ws.cell(1, 7).string('Carpenter');
            ws.cell(1, 9).string('Helper');

            ws.cell(2, 3).string('Full Day');
            ws.cell(2, 4).string('O.T HRS');
            ws.cell(2, 5).string('Full Day');
            ws.cell(2, 6).string('O.T HRS');
            ws.cell(2, 7).string('Full Day');
            ws.cell(2, 8).string('O.T HRS');
            ws.cell(2, 9).string('Full Day');
            ws.cell(2, 10).string('O.T HRS');

            var rowIndex = 3;
            results.data.forEach((element, index) => {
                ws.cell(rowIndex, 1).string(`${element.date}`);
                ws.cell(rowIndex, 2).string(`${element.contractorname}`);
                ws.cell(rowIndex, 3).string(`${element.labourfullday}`);
                ws.cell(rowIndex, 4).string(`${element.labourothrs}`);
                ws.cell(rowIndex, 5).string(`${element.masonfullday}`);
                ws.cell(rowIndex, 6).string(`${element.masonothrs}`);
                ws.cell(rowIndex, 7).string(`${element.carpenterfullday}`);
                ws.cell(rowIndex, 8).string(`${element.carprnterothrs}`);
                ws.cell(rowIndex, 9).string(`${element.helperfullday}`);
                ws.cell(rowIndex, 10).string(`${element.helperothrs}`);
                rowIndex++;
            });
            rowIndex++;
            ws.cell(rowIndex, 1).string('Total Labour Full Day');
            ws.cell(rowIndex, 2).string('Total Labour O.T HRS');
            ws.cell(rowIndex, 3).string('Total Mason Full Day');
            ws.cell(rowIndex, 4).string('Total Mason O.T HRS');
            ws.cell(rowIndex, 5).string('Total Carpenter Full Day');
            ws.cell(rowIndex, 6).string('Total Carpenter O.T HRS');
            ws.cell(rowIndex, 7).string('Total Helper Full Day');
            ws.cell(rowIndex, 8).string('Total Helper O.T HRS');
            rowIndex++;
            ws.cell(rowIndex, 1).string(`${results.total.totallabourfullday}`);
            ws.cell(rowIndex, 2).string(`${results.total.totallabourothrs / 8}`);
            ws.cell(rowIndex, 3).string(`${results.total.totalmasonfullday}`);
            ws.cell(rowIndex, 4).string(`${results.total.totalmasonothrs / 8}`);
            ws.cell(rowIndex, 5).string(`${results.total.totalcarpenterfullday}`);
            ws.cell(rowIndex, 6).string(`${results.total.totalcarprnterothrs / 8}`);
            ws.cell(rowIndex, 7).string(`${results.total.totalhelperfullday}`);
            ws.cell(rowIndex, 8).string(`${results.total.totalhelperothrs / 8}`);
            var name = 'LabourReportExcel'+moment().format('x')+'.xlsx';
            wb.write(`./public/excel/${name}`, function(err, stats) {
                if (err) {
                    console.error(err);
                } else {
                    return res.json({
                        success: 1,
                        message: 'Labour Report excel file has been successfully created',
                        fileLink: `/public/excel/${name}`
                    });
                }
            });
        });
    },
    downloadContractorWiseGetAllPdf: (req, res) => {
        var data = req.query;
        data.date = 'asc';
        getContracterWise(data, (err, results) => {
            if (err) {
                return;
            }
            
            var data = [[{ text: 'Date', style: 'tableHeader' }, { text: 'Contractor Name', style: 'tableHeader' }, { text: 'Labour', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: 'Mason', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: 'Carpenter', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: 'Helper', style: 'tableHeader' }, { text: '', style: 'tableHeader' }],
            [{ text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: 'Full Day', style: 'tableHeader' }, { text: 'O.T HRS', style: 'tableHeader' }, { text: 'Full Day', style: 'tableHeader' }, { text: 'O.T HRS', style: 'tableHeader' }, { text: 'Full Day', style: 'tableHeader' }, { text: 'O.T HRS', style: 'tableHeader' }, { text: 'Full Day', style: 'tableHeader' }, { text: 'O.T HRS', style: 'tableHeader' }]];
            results.data.forEach((element, index) => {
                data.push([`${element.date}`,`${element.contractorname}`,`${element.labourfullday}`,`${element.labourothrs}`,`${element.masonfullday}`,`${element.masonothrs}`,`${element.carpenterfullday}`,`${element.carprnterothrs}`,`${element.helperfullday}`,`${element.helperothrs}`]);
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
                    {
                        columns: [
                            {
                                width: 150,
                                text: 'Total Labour Full Day'
                            },
                            {
                                width: 150,
                                text: 'Total Labour O.T HRS'
                            },
                            {
                                width: 130,
                                text: 'Total Mason Full Day'
                            },
                            {
                                width: 150,
                                text: 'Total Mason O.T HRS'
                            },
                        ]
                    },
                    {
                        columns: [
                            {
                                width: 150,
                                text: `${results.total.totallabourfullday}`
                            },
                            {
                                width: 150,
                                text: `${results.total.totallabourothrs / 8}`
                            },
                            {
                                width: 130,
                                text: `${results.total.totalmasonfullday}`
                            },
                            {
                                width: 150,
                                text: `${results.total.totalmasonothrs / 8}`
                            },
                        ]
                    },
                    {
                        columns: [
                            {
                                width: 150,
                                text: 'Total Carpenter Full Day'
                            },
                            {
                                width: 150,
                                text: 'Total Carpenter O.T HRS'
                            },
                            {
                                width: 130,
                                text: 'Total Helper Full Day'
                            },
                            {
                                width: 150,
                                text: 'Total Helper O.T HRS'
                            },
                        ]
                    },
                    {
                        columns: [
                            {
                                width: 150,
                                text: `${results.total.totalcarpenterfullday}`
                            },
                            {
                                width: 150,
                                text: `${results.total.totalcarprnterothrs / 8}`
                            },
                            {
                                width: 130,
                                text: `${results.total.totalhelperfullday}`
                            },
                            {
                                width: 150,
                                text: `${results.total.totalhelperothrs / 8}`
                            },
                        ]
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
            var name = 'LabourReportPdf'+moment().format('x')+'.pdf';
            
            pdfDoc.pipe(fs.createWriteStream(`./public/pdf/${name}`));
            pdfDoc.end();
            return res.json({
                success: 1,
                message: 'Labour Report pdf file has been successfully created',
                fileLink: `/public/pdf/${name}`
            });
        });
    }
}
