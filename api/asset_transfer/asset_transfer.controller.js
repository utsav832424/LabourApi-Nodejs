const { addItem, searchItem, addAssetTransfer, getAssetGroup, getAsset, deleteAsset, editAsset, userWiseItem, getNameWiseAssest, getNameWiseAssesByItem, getNameWiseAllAssest,getName,editName,deleteName} = require("./asset_transfer.service");

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
    additem: (req, res) => {
        var data = req.body;
        addItem(data, (err, results) => {
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
                message: "Item has been successfully added."
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
                message: "Asset Transfer has been successfully ."
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
                message: 'Asset Transfer has been successfully updated'
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
                message: 'Asset Transfer has been successfully deleted'
            });
        });
    },
    addAsset: (req, res) => {
        var data = req.body;
        addAssetTransfer(data, (err, results) => {
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
                message: "Item has been successfully added."
            })
        });
    },
    searchItem: (req, res) => {
        var data = req.body;
        searchItem(data, (err, results) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results
            })
        });
    },
    getUserWiseItem: (req, res) => {
        var data = req.params.id;
        userWiseItem(data, (err, results) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results
            })
        });
    },
    getAssetByName: (req, res) => {
        // var id = req.params.id;
        // var name = req.params.name;
        var data = req.query;
        getNameWiseAssest(data, (err, results) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results
            })
        });
    },
    getGroup: (req, res) => {
        var data = req.query;
        getAssetGroup(data, (err, results) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results
            })
        });
    },
    getAll: (req, res) => {
        var data = req.query;
        getAsset(data, (err, results) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results
            })
        });
    },
    deleteAsset: (req, res) => {
        var data = req.params;
        deleteAsset(data, (err, results) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                message: "Asset has been deleted successfully."
            })
        });
    },
    editAsset: (req, res) => {
        var data = req.body;
        editAsset(data, (err, results) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                message: "Asset has been updated successfully."
            })
        });
    },
    getNameWiseAssesByItem: (req, res) => {
        var data = req.body;
        getNameWiseAssesByItem(data, (err, results) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results
            })
        });
    },
    downloadGetAllExcel: (req, res) => {
        var data = req.query;
        
        getAsset(data, (err, results) => {
            if (err) {
                return;
            }
            
            var wb = new xl.Workbook();
            var ws = wb.addWorksheet('Asset Transfer');

            ws.cell(1, 1).string('Date');
            ws.cell(1, 2).string('Receiver Name');
            ws.cell(1, 3).string('Item');
            ws.cell(1, 4).string('Qty');

            var rowIndex = 2;
            var total = 0;
            results.forEach((element, index) => {
                ws.cell(rowIndex, 1).string(`${element.date}`);
                ws.cell(rowIndex, 2).string(`${element.receivername}`);
                ws.cell(rowIndex, 3).string(`${element.name}`);
                ws.cell(rowIndex, 4).string(`${element.qty}`);
                total = total + element.qty;
                rowIndex++;
            });
            ws.cell(rowIndex, 1).string(``);
            ws.cell(rowIndex, 2).string(`Total`);
            ws.cell(rowIndex, 3).string(``);
            ws.cell(rowIndex, 4).string(`${total}`);

            var name = 'AssetTransferExcel'+moment().format('x')+'.xlsx';
            wb.write(`./public/excel/${name}`, function(err, stats) {
                if (err) {
                    console.error(err);
                } else {
                    return res.json({
                        success: 1,
                        message: 'Asset Transfer excel file has been successfully created',
                        fileLink: `/public/excel/${name}`
                    });
                }
            });
        });
    },
    downloadGetAllPdf: (req, res) => {
        var data = req.query;
        
        getAsset(data, (err, results) => {
            if (err) {
                return;
            }
            var total = 0;
            var data = [[{ text: 'Date', style: 'tableHeader' }, { text: 'Receiver Name', style: 'tableHeader' }, { text: 'Item', style: 'tableHeader' }, { text: 'Qty', style: 'tableHeader' }]];
            results.forEach((element, index) => {
                data.push([`${element.date}`,`${element.receivername}`,`${element.name}`,`${element.qty}`]);
                total = total + element.qty;
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
                                text: 'Total Qty'
                            },
                        ]
                    },
                    {
                        columns: [
                            {
                                width: 150,
                                text: `${total}`
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
            var name = 'AssetTransferPdf'+moment().format('x')+'.pdf';
            
            pdfDoc.pipe(fs.createWriteStream(`./public/pdf/${name}`));
            pdfDoc.end();
            return res.json({
                success: 1,
                message: 'Asset Transfer pdf file has been successfully created',
                fileLink: `/public/pdf/${name}`
            });
        });
    },
    downloadGroupGetAllExcel: (req, res) => {
        var data = req.query;
        
        getAsset(data, (err, results) => {
            if (err) {
                return;
            }
            
            var wb = new xl.Workbook();
            var ws = wb.addWorksheet('Asset Transfer');

            ws.cell(1, 1).string('Date');
            ws.cell(1, 2).string('Receiver Name');
            ws.cell(1, 3).string('Item');
            ws.cell(1, 4).string('Qty');

            var rowIndex = 2;
            var total = 0;
            results.forEach((element, index) => {
                ws.cell(rowIndex, 1).string(`${element.date}`);
                ws.cell(rowIndex, 2).string(`${element.receivername}`);
                ws.cell(rowIndex, 3).string(`${element.name}`);
                ws.cell(rowIndex, 4).string(`${element.qty}`);
                total = total + element.qty;
                rowIndex++;
            });
            ws.cell(rowIndex, 1).string(``);
            ws.cell(rowIndex, 2).string(`Total`);
            ws.cell(rowIndex, 3).string(``);
            ws.cell(rowIndex, 4).string(`${total}`);
            var name = 'AssetTransferExcel'+moment().format('x')+'.xlsx';
            wb.write(`./public/excel/${name}`, function(err, stats) {
                if (err) {
                    console.error(err);
                } else {
                    return res.json({
                        success: 1,
                        message: 'Asset Transfer excel file has been successfully created',
                        fileLink: `/public/excel/${name}`
                    });
                }
            });
        });
    },
    downloadGroupGetAllPdf: (req, res) => {
        var data = req.query;
        
        getAsset(data, (err, results) => {
            if (err) {
                return;
            }
            var total = 0;
            var data = [[{ text: 'Date', style: 'tableHeader' }, { text: 'Receiver Name', style: 'tableHeader' }, { text: 'Item', style: 'tableHeader' }, { text: 'Qty', style: 'tableHeader' }]];
            results.forEach((element, index) => {
                data.push([`${element.date}`,`${element.receivername}`,`${element.name}`,`${element.qty}`]);
                total = total + element.qty;
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
                                text: 'Total Qty'
                            },
                        ]
                    },
                    {
                        columns: [
                            {
                                width: 150,
                                text: `${total}`
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
            var name = 'AssetTransferPdf'+moment().format('x')+'.pdf';
            
            pdfDoc.pipe(fs.createWriteStream(`./public/pdf/${name}`));
            pdfDoc.end();
            return res.json({
                success: 1,
                message: 'Asset Transfer pdf file has been successfully created',
                fileLink: `/public/pdf/${name}`
            });
        });
    },
    downloadAssetAllByNameExcel: (req, res) => {
        var data = req.query;
        
        getNameWiseAllAssest(data, (err, results) => {
            if (err) {
                return;
            }
            
            var wb = new xl.Workbook();
            var ws = wb.addWorksheet('Asset Transfer');

            ws.cell(1, 1).string('Date');
            ws.cell(1, 2).string('Receiver Name');
            ws.cell(1, 3).string('Item');
            ws.cell(1, 4).string('Qty');

            var rowIndex = 2;
            var total = 0;
            results.forEach((element, index) => {
                ws.cell(rowIndex, 1).string(`${element.date}`);
                ws.cell(rowIndex, 2).string(`${element.receivername}`);
                ws.cell(rowIndex, 3).string(`${element.item_name}`);
                ws.cell(rowIndex, 4).string(`${element.qty}`);
                total = total + element.qty;
                rowIndex++;
            });
            ws.cell(rowIndex, 1).string(``);
            ws.cell(rowIndex, 2).string(`Total`);
            ws.cell(rowIndex, 3).string(``);
            ws.cell(rowIndex, 4).string(`${total}`);
            var name = 'AssetTransferByNameExcel'+moment().format('x')+'.xlsx';
            wb.write(`./public/excel/${name}`, function(err, stats) {
                if (err) {
                    console.error(err);
                } else {
                    return res.json({
                        success: 1,
                        message: 'Asset Transfer excel file has been successfully created',
                        fileLink: `/public/excel/${name}`
                    });
                }
            });
        });
    },
    downloadAssetAllByNamePdf: (req, res) => {
        var data = req.query;
        
        getNameWiseAllAssest(data, (err, results) => {
            if (err) {
                return;
            }
            var total = 0;
            var data = [[{ text: 'Date', style: 'tableHeader' }, { text: 'Receiver Name', style: 'tableHeader' }, { text: 'Item', style: 'tableHeader' }, { text: 'Qty', style: 'tableHeader' }]];
            results.forEach((element, index) => {
                data.push([`${element.date}`,`${element.receivername}`,`${element.item_name}`,`${element.qty}`]);
                total = total + element.qty;
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
                                text: 'Total Qty'
                            },
                        ]
                    },
                    {
                        columns: [
                            {
                                width: 150,
                                text: `${total}`
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
            var name = 'AssetTransferByNamePdf'+moment().format('x')+'.pdf';
            
            pdfDoc.pipe(fs.createWriteStream(`./public/pdf/${name}`));
            pdfDoc.end();
            return res.json({
                success: 1,
                message: 'Asset Transfer pdf file has been successfully created',
                fileLink: `/public/pdf/${name}`
            });
        });
    }
}