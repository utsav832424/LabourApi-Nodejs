const { create, getAll, addDiesel, deleteDiesel, editDiesel, getAllGroup, getTotalDiesel, getAllDiesel,getVehicalAll,getAllVechical,createVehicle,searchName,getName,editName,deleteName } = require("./diesel.service");

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
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results,
                message: "diesel has been successfully ."
            })
        });

    },
    createVehicleC: (req, res) => {
        const body = req.body;
        createVehicle(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results,
                message: "Vehicle has been successfully ."
            })
        });

    },
    getAll: (req, res) => {
        var data = req.query;

        getTotalDiesel(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection errror"
                });
            }
            getAll(data, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Database connection errror"
                    });
                }
                return res.status(200).json({
                    success: 1,
                    data: result,
                    ...results[0],
                    message: "diesel has been successfully ."
                });
            });
            // return res.status(200).json({
            //     success: 1,
            //     data: results,
            //     message: "diesel has been successfully ."
            // });
        });
    },
    addNewDiesel: (req, res) => {
        const body = req.body;
        addDiesel(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results,
                message: "diesel has been successfully."
            })
        });
    },
    deleteDiesel: (req, res) => {
        var data = req.params;
        deleteDiesel(data, (err, results) => {
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
                message: "diesel has been successfully deleted."
            });
        });
    },
    editDiesel: (req, res) => {
        var data = req.body;
        editDiesel(data, (err, results) => {
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
                message: "diesel has been successfully updated."
            });
        });
    },
    getAllGroup: (req, res) => {
        var data = req.query;
        getTotalDiesel(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection errror"
                });
            }
            getAllGroup(data, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Database connection errror"
                    });
                }
                return res.status(200).json({
                    success: 1,
                    data: result,
                    ...results[0],
                    message: "diesel has been successfully ."
                });
            });
        });
    },
    getAllDiesel: (req, res) => {
        var data = req.query;
        getAllDiesel(data, (err, results) => {
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
                message: "diesel has been successfully ."
            });
        });
    },
    downloadGetAllExcel: (req, res) => {
        var data = req.query;

        getTotalDiesel(data, (err, result) => {
            if (err) {
                return;
            }
            data.date = 'asc';
            getAll(data, (err, results) => {
                if (err) {
                    return;
                }

                var wb = new xl.Workbook();
                var ws = wb.addWorksheet('Diesel');

                ws.cell(1, 1).string('Sr.No');
                ws.cell(1, 2).string('Date');
                ws.cell(1, 3).string('Machinery');
                ws.cell(1, 4).string('Vehicale Number');
                ws.cell(1, 5).string('Driver');
                ws.cell(1, 6).string('Qty-LTR');

                var rowIndex = 2;
                results.forEach((element, index) => {
                    ws.cell(rowIndex, 1).string(`${index + 1}`);
                    ws.cell(rowIndex, 2).string(`${element.date}`);
                    ws.cell(rowIndex, 3).string(`${element.machinery}`);
                    ws.cell(rowIndex, 4).string(`${element.vehiclenumber}`);
                    ws.cell(rowIndex, 5).string(`${element.driver}`);
                    ws.cell(rowIndex, 6).string(`${element.qty_ltr}`);
                    rowIndex++;
                });
                rowIndex++;
                ws.cell(rowIndex, 1).string('Total Used');
                ws.cell(rowIndex, 2).string('Incoming');
                ws.cell(rowIndex, 3).string('Total Stock');
                rowIndex++;
                ws.cell(rowIndex, 1).string(`${result[0]['total_used']}`);
                ws.cell(rowIndex, 2).string(`${result[0]['incoming']}`);
                ws.cell(rowIndex, 3).string(`${result[0]['total_stock']}`);
                var name = 'DieselExcel' + moment().format('x') + '.xlsx';
                wb.write(`./public/excel/${name}`, function (err, stats) {
                    if (err) {
                        console.error(err);
                    } else {
                        return res.json({
                            success: 1,
                            message: 'Diesel excel file has been successfully created',
                            fileLink: `/public/excel/${name}`
                        });
                    }
                });
            });
        })

    },
    downloadGetAllPdf: (req, res) => {
        var data = req.query;

        getTotalDiesel(data, (err, result) => {
            if (err) {
                return;
            }
            data.date = 'asc';
            getAll(data, (err, results) => {
                if (err) {
                    return;
                }
    
                var data = [[{ text: 'Sr.No', style: 'tableHeader' }, { text: 'Date', style: 'tableHeader' }, { text: 'Machinery', style: 'tableHeader' }, { text: 'Vehicale Number', style: 'tableHeader' }, { text: 'Driver', style: 'tableHeader' }, { text: 'Qty-LTR', style: 'tableHeader' }]];
                results.forEach((element, index) => {
                    data.push([`${index + 1}`, `${element.date}`, `${element.machinery}`, `${element.vehiclenumber}`, `${element.driver}`, `${element.qty_ltr}`]);
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
                                    width: 180,
                                    text: 'Total Used'
                                },
                                {
                                    width: 180,
                                    text: 'Incoming'
                                },
                                {
                                    width: 180,
                                    text: 'Total Stock'
                                },
                            ]
                        },
                        {
                            columns: [
                                {
                                    width: 180,
                                    text: result[0]['total_used']
                                },
                                {
                                    width: 180,
                                    text: result[0]['incoming']
                                },
                                {
                                    width: 180,
                                    text: result[0]['total_stock']
                                },
                            ]
                        }
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
                        },
                        defaultStyle: {
                            columnGap: 20
                        }
                    },
                    defaultStyle: {
                        // alignment: 'justify'
                    }
                };
                var pdfDoc = pdfmake.createPdfKitDocument(docDefinition, {});
                var name = 'DieselPdf' + moment().format('x') + '.pdf';
    
                pdfDoc.pipe(fs.createWriteStream(`./public/pdf/${name}`));
                pdfDoc.end();
                return res.json({
                    success: 1,
                    message: 'Diesel pdf file has been successfully created',
                    fileLink: `/public/pdf/${name}`
                });
            });
        });
    },
    getVehicalAllC: (req, res) => {
        var data = req.query;
        getVehicalAll(data, (err, results) => {
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
                message: "Get Vehical has been successfully ."
            });
        });
    },

    downloadGetAllVechicalPdf: (req, res) => {
        var data = req.query;
            data.date = 'asc';
            getAllVechical(data, (err, results) => {
                if (err) {
                    return;
                }
    
                var data = [[{ text: 'Sr.No', style: 'tableHeader' }, { text: 'Date', style: 'tableHeader' }, { text: 'Machinery', style: 'tableHeader' }, { text: 'Vehicale Number', style: 'tableHeader' }, { text: 'Driver', style: 'tableHeader' }, { text: 'Qty-LTR', style: 'tableHeader' }]];
                results.data.forEach((element, index) => {
                    data.push([`${index + 1}`, `${element.date}`, `${element.machinery}`, `${element.vehiclenumber}`, `${element.driver}`, `${element.qty_ltr}`]);
                });
                data.push(['','','Total','','',`${results.total.total_qty}`]);
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
                        },
                        defaultStyle: {
                            columnGap: 20
                        }
                    },
                    defaultStyle: {
                        // alignment: 'justify'
                    }
                };
                var pdfDoc = pdfmake.createPdfKitDocument(docDefinition, {});
                var name = 'DieselVechicalPdf' + moment().format('x') + '.pdf';
    
                pdfDoc.pipe(fs.createWriteStream(`./public/pdf/${name}`));
                pdfDoc.end();
                return res.json({
                    success: 1,
                    message: 'Diesel pdf file has been successfully created',
                    fileLink: `/public/pdf/${name}`
                });
            });
      
    },

    downloadGetAllVechicalExcel: (req, res) => {
        var data = req.query;
        data.date = 'asc';
        getAllVechical(data, (err, results) => {
                if (err) {
                    return;
                }

                var wb = new xl.Workbook();
                var ws = wb.addWorksheet('Diesel');

                ws.cell(1, 1).string('Sr.No');
                ws.cell(1, 2).string('Date');
                ws.cell(1, 3).string('Machinery');
                ws.cell(1, 4).string('Vehicale Number');
                ws.cell(1, 5).string('Driver');
                ws.cell(1, 6).string('Qty-LTR');

                var rowIndex = 2;
                results.data.forEach((element, index) => {
                    ws.cell(rowIndex, 1).string(`${index + 1}`);
                    ws.cell(rowIndex, 2).string(`${element.date}`);
                    ws.cell(rowIndex, 3).string(`${element.machinery}`);
                    ws.cell(rowIndex, 4).string(`${element.vehiclenumber}`);
                    ws.cell(rowIndex, 5).string(`${element.driver}`);
                    ws.cell(rowIndex, 6).string(`${element.qty_ltr}`);
                    rowIndex++;
                });
               ws.cell(rowIndex,3).string('Total');
               ws.cell(rowIndex,6).string(`${results.total.total_qty}`);
                var name = 'DieselVechicalExcel' + moment().format('x') + '.xlsx';
                wb.write(`./public/excel/${name}`, function (err, stats) {
                    if (err) {
                        console.error(err);
                    } else {
                        return res.json({
                            success: 1,
                            message: 'Diesel excel file has been successfully created',
                            fileLink: `/public/excel/${name}`
                        });
                    }
                });
            });
        

    },

    downloadGetAllLtrPdf: (req, res) => {
        var data = req.query;
            data.date = 'asc';
            getAllDiesel(data, (err, results) => {
                if (err) {
                    return;
                }
                var Ltr=0;
                var data = [[{ text: 'Sr.No', style: 'tableHeader' }, { text: 'Date', style: 'tableHeader' }, { text: 'LTR', style: 'tableHeader' }]];
                results.forEach((element, index) => {
                    data.push([`${index + 1}`, `${element.date}`, `${element.ltr}`]);
                    Ltr = Ltr + element.ltr;
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
                                    width: 180,
                                    text: 'Total Stock'
                                },
                            ]
                        },
                        {
                            columns: [
                                {
                                    width: 180,
                                    text: Ltr
                                },
                            ]
                        }
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
                        },
                        defaultStyle: {
                            columnGap: 20
                        }
                    },
                    defaultStyle: {
                        // alignment: 'justify'
                    }
                };
                var pdfDoc = pdfmake.createPdfKitDocument(docDefinition, {});
                var name = 'DieselLtrPdf' + moment().format('x') + '.pdf';
    
                pdfDoc.pipe(fs.createWriteStream(`./public/pdf/${name}`));
                pdfDoc.end();
                return res.json({
                    success: 1,
                    message: 'Diesel pdf file has been successfully created',
                    fileLink: `/public/pdf/${name}`
                });
            });
        
    },
    downloadGetLtrExcel: (req, res) => {
        var data = req.query;
            data.date = 'asc';
            getAllDiesel(data, (err, results) => {
                if (err) {
                    return;
                }

                var wb = new xl.Workbook();
                var ws = wb.addWorksheet('Diesel');

                ws.cell(1, 1).string('Sr.No');
                ws.cell(1, 2).string('Date');
                ws.cell(1, 3).string('LTR');
                var Ltr=0;
                var rowIndex = 2;
                results.forEach((element, index) => {
                    ws.cell(rowIndex, 1).string(`${index + 1}`);
                    ws.cell(rowIndex, 2).string(`${element.date}`);
                    ws.cell(rowIndex, 3).string(`${element.ltr}`);
                    Ltr = Ltr + element.ltr;
                    rowIndex++;
                });
                rowIndex++;
                ws.cell(rowIndex, 3).string('Total Stock');
                rowIndex++;
                ws.cell(rowIndex, 3).string(`${Ltr}`);
                var name = 'DieselLtrExcel' + moment().format('x') + '.xlsx';
                wb.write(`./public/excel/${name}`, function (err, stats) {
                    if (err) {
                        console.error(err);
                    } else {
                        return res.json({
                            success: 1,
                            message: 'Diesel excel file has been successfully created',
                            fileLink: `/public/excel/${name}`
                        });
                    }
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
                message: "Vechical has been successfully ."
            });
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
                message: "Vehicle No has been successfully ."
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
                message: 'Vehicle No has been successfully updated'
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
                message: 'Vehicle No has been successfully deleted'
            });
        });
    },
}
