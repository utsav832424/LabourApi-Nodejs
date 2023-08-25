const pool = require("../../config/database");
var moment = require('moment');

module.exports = {
    addItem: (data, callBack) => {
        pool.query(
            'insert into asset_transfer_item(user_id,name) values(?,?)',
            [
                data.user_id,
                data.name,
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }

        );
    },
    getName: (data, callBack) => {
        var where = '';
        var orderBy = 'order by id desc';

        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} user_id = '${data.user_id}'`;
        }

        pool.query(
            `select * from asset_transfer_item ${where} ${orderBy}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    editName: (data, callBack) => {
        var where = '';
        var index = 0;
        for (const key in data) {
            if (index > 0) {
                where += `,`;
            }
            where += ` ${key} = '${data[key]}'`;
            index++;
        }
        pool.query(
            `UPDATE asset_transfer_item SET${where} WHERE id = ${data.id}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    deleteName: (data, callBack) => {
        pool.query(
            `DELETE FROM asset_transfer_item WHERE id = ${data.id}`,
            (error, result, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },
    searchItem: (data, callBack) => {
        pool.query(
            `select * from asset_transfer_item where user_id=${data.user_id} and name like '%${data.name}%' order by id desc`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    addAssetTransfer: (data, callBack) => {
        pool.query(
            'insert into asset_transfer(user_id,date,receivername,item,qty,type) values(?,?,?,?,?,?)',
            [
                data.user_id,
                moment(data.date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                data.receivername,
                data.item,
                data.qty == '' ? 0 : data.qty,
                data.type,
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }

        );
    },
    getAssetGroup: (data, callBack) => {
        var where = '';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE a.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} a.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.type != '' && data.type != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} a.type = '${data.type}'`;
        }
        pool.query(
            `SELECT a.*,u.sitename,ati.name,DATE_FORMAT(a.date, "%d-%m-%Y") as date FROM asset_transfer a left JOIN asset_transfer_item ati ON a.item = ati.id left JOIN user u ON a.user_id = u.id ${where} GROUP BY a.user_id ORDER BY a.date DESC`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }

        );
    },
    getAsset: (data, callBack) => {
        var where = '';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} a.user_id = '${data.user_id}'`;
        }

        if (data.type != '' && data.type != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} a.type = '${data.type}'`;
        }
        pool.query(
            `SELECT a.*,ati.name,DATE_FORMAT(date, "%d-%m-%Y") as date FROM asset_transfer a left JOIN asset_transfer_item ati ON a.item = ati.id ${where} ORDER BY a.date DESC`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }

        );
    },
    deleteAsset: (data, callBack) => {
        pool.query(
            `DELETE FROM asset_transfer WHERE id = ${data.id}`,
            (error, result, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },
    editAsset: (data, callBack) => {
        var where = '';
        var index = 0;
        for (const key in data) {
            if (index > 0) {
                where += `,`;
            }
            if (key == 'date') {
                where += ` ${key} = '${moment(data[key], 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
            } else {
                where += ` ${key} = '${data[key]}'`;
            }
            index++;
        }
        pool.query(
            `UPDATE asset_transfer SET${where} WHERE id = ${data.id}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    userWiseItem: (data, callBack) => {

        pool.query(
            `select * from asset_transfer_item WHERE user_id=${data} order by id desc`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getNameWiseAssest: (data, callBack) => {
        console.log(data);
        var where = '';
        var orderBy = 'order by a.date desc';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE a.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} a.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} a.user_id = '${data.user_id}'`;
        }
        if (data.receivername != '' && data.receivername != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} a.receivername = '${data.receivername}'`;
        }
        console.log(`${where}`);
        console.log(`select a.*,ati.name as item_name,DATE_FORMAT(a.date, "%d-%m-%Y") as date from asset_transfer a left JOIN asset_transfer_item ati ON a.item = ati.id ${where} order by a.id desc`);
        pool.query(
            `select a.*,ati.name as item_name,DATE_FORMAT(a.date, "%d-%m-%Y") as date from asset_transfer a left JOIN asset_transfer_item ati ON a.item = ati.id ${where} order by a.id desc`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getNameWiseAssesByItem: (data, callBack) => {
        var where = '';
        var orderBy = 'order by a.date desc';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE a.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} a.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} a.user_id = '${data.user_id}'`;
        }
        if (data.item != '' && data.item != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} a.item = '${data.item}'`;
        }
        if (data.receivername != '' && data.receivername != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} a.receivername = '${data.receivername}'`;
        }
        console.log(`select a.*,ati.name as item_name,DATE_FORMAT(a.date, "%d-%m-%Y") as date from asset_transfer a left JOIN asset_transfer_item ati ON a.item = ati.id ${where} order by id desc`);
        pool.query(
            `select a.*,ati.name as item_name,DATE_FORMAT(a.date, "%d-%m-%Y") as date from asset_transfer a left JOIN asset_transfer_item ati ON a.item = ati.id ${where} order by id desc`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getNameWiseAllAssest: (data, callBack) => {
        var where = '';
        if (data.item != '' && data.item != undefined) {
            where += ` AND a.item = '${data.item}'`;
        }

        pool.query(
            `select a.*,ati.name as item_name,DATE_FORMAT(a.date, "%d-%m-%Y") as date from asset_transfer a left JOIN asset_transfer_item ati ON a.item = ati.id WHERE receivername = '${data.name}' AND a.user_id = ${data.id} ${where} order by a.id desc`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
}