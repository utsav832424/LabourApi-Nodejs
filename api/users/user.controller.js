const { create, getUserByUserId, getUsers, updateUser, deleteUser, getUserByUserEmail } = require("./user.service");
const { genSaltSync, hashSync, compareSync, compare } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        create(body, (err, results) => {
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
                message: 'Admin has been created successfully'
            });
        });
    },

    getUserByUserId:(req, res) => {
        const id = req.params.id;
        getUserByUserId(id, (err, results)=>{
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success:0,
                    message:"record not Found"
                });
            }
            return res.json({
                success:1,
                data:results
            });
            });
    },
    getUsers:(req, res) =>{
        getUsers((err, results)=>{
            if (err) {
                console.log(err);
                return;
            }
            console.log('results', results)
            return res.json({
                success:1,
                data:results
            });
        });
    },
    updateUser:(req, res) =>{
        const body = req.body;
        if (body.password != '') {
            const salt = genSaltSync(10);
            body.password = hashSync(body.password, salt);
        }
        updateUser(body,(err, results )=>{
            if (err) {
                console.log(err);
                return false;
            } 
           if (!results) {
                return res.json({
                    success:0,
                    message:"Failed to update user"
                })
           }
            return res.json({
                success:1,
                message:"updated successfully"
            });
        });
    },
    deleteUser:(req, res) => {
        const data = req.params;
        deleteUser(data,(err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success:0,
                    message:"record not Found"
                });
            }
            return res.json({
                success:1,
                message:"site deleted successfully"
            });
        });
    },
    login: (req, res) => {
        const body = req.body;
        getUserByUserEmail(body.sitename, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success:0,
                    message:"your email address is not valid"
                });
            }
            const result = compareSync(body.password, results.password); 
            if (result) {
                results.password = undefined;
                const jsontoken = sign({ result: results}, "qwe123",{
                    expiresIn:"1h"
                });   
                return res.json({
                    success:1,
                    message:"Login successfully",
                    token:jsontoken,
                    data:results,
                });  
            }
            else{
                return res.json({
                    success:0,
                    message:"please enter correct password"
                });
            }
        });
    },
}