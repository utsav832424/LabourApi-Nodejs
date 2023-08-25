const { create ,getAll, deleteStaff, editStaff,getnameByid, getAllGroup,createuser_staff,getName,editName,deleteName,searchName,getAllSuggName} = require("./staff.service");
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
                message: "staff has been successfully ."
            })
        });

    },
    CreateNameC: (req, res) => {
        var data = req.body;
        var insertdata = [];
        // console.log("data", data.data);
        JSON.parse(data.data).forEach(async (element) => {
            if (element.check == 1) {
                await create({user_id: element.user_id, name: element.id, date: data.date}, (err, result) => {

                });
            }
        });
        return res.status(200).json({
            status: 1,
            message: "Name has been successfully added."
        });
       
    },
    createUser_Staff: (req, res) => {
        const body = req.body;
        createuser_staff(body, (err, results) => {
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
                message: "staff has been successfully ."
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
                message: "staff has been successfully ."
            });
        });
    },
    getGroup:(req, res) => {
        getAllGroup((err, results) => {
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
                message: "staff has been successfully ."
            });
        });
    },
    deleteStaff:(req, res) => {
        var data = req.params;
        deleteStaff(data,(err, results) => {
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
                message: "staff has been successfully deleted."
            });
        });
    },
    editStaff:(req, res) => {
        var data = req.body;
        editStaff(data,(err, results) => {
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
                message: "staff has been successfully updated."
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
            var ws = wb.addWorksheet('Staff');

            ws.cell(1, 1).string('Date');
            ws.cell(1, 2).string('Name');

            var index = 2;
            results.forEach((element) => {
                ws.cell(index, 1).string(`${element.date}`);
                ws.cell(index, 2).string(`${element.staff_name}`);
                index++;
            });
            var name = 'StaffExcel'+moment().format('x')+'.xlsx';
            wb.write(`./public/excel/${name}`, function(err, stats) {
                if (err) {
                    console.error(err);
                } else {
                    return res.json({
                        success: 1,
                        message: 'Staff excel file has been successfully created',
                        fileLink: `/public/excel/${name}`,
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
            
            var data = [[{ text: 'Date', style: 'tableHeader' }, { text: 'Name', style: 'tableHeader' }]];
            results.forEach((element) => {
                data.push([`${element.date}`,`${element.staff_name}`]);
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
            var name = 'StaffPdf'+moment().format('x')+'.pdf';
            
            pdfDoc.pipe(fs.createWriteStream(`./public/pdf/${name}`));
            pdfDoc.end();
            return res.json({
                success: 1,
                message: 'Staff pdf file has been successfully created',
                fileLink: `/public/pdf/${name}`
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
                message: "Staff has been successfully ."
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
                message: 'Staff has been successfully updated'
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
                message: 'Staff has been successfully deleted'
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
                message: "Staff has been successfully ."
            });
        });
    },
    getAllSuggName:(req, res) => {
        var data = req.query;
        getAllSuggName(data,(err, results) => {
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
                message: "Name has been successfully ."
            });
        });
    },
    getnameByidC:(req, res) => {
        var data = req.query;
        getnameByid(data,(err, results) => {
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
                message: "Name has been successfully ."
            });
        });
    },
}
