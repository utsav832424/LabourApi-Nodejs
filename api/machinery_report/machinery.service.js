const pool = require("../../config/database");
var moment = require('moment');

module.exports = {
    create: (data, callBack) => {
        pool.query(
            'insert into  machinery_report(user_id,suppliername, vehicle, vehicle_no, operator, unit, qty,date,added_datetime) values(?,?,?,?,?,?,?,?,?)',
            [
                data.user_id,
                data.suppliername,
                data.vehicle,
                data.vehicle_no,
                data.operator,
                data.unit,
                data.qty == '' ? 0 : data.qty,
                moment(data.date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }

        );
    },
    getAll: (data, callBack) => {
        var where = '';
        var orderBy = 'order by mrp.date desc';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE mrp.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mrp.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mrp.user_id = '${data.user_id}'`;
        }

        if (data.date != '' && data.date != undefined) {
            orderBy = 'order by mrp.date asc';
        }
        pool.query(
            `select mrp.id,mrp.user_id,mrp.vehicle,mrp.operator,mrp.unit,mrp.qty,mrp.isActive,mrp.added_datetime,DATE_FORMAT(mrp.date, "%d-%m-%Y") as date,IFNULL((SELECT name FROM machinery_name where id = mrp.suppliername), mrp.suppliername)as suppliername,IFNULL((SELECT name FROM machinery_name where id = mrp.vehicle_no), mrp.vehicle_no)as vehicle_no, mrp.vehicle_no as vehicle2,mrp.suppliername as suppliername1 from machinery_report mrp ${where} ${orderBy}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    deleteMachinery: (data, callBack) => {
        pool.query(
            `DELETE FROM machinery_report WHERE id = ${data.id}`,
            (error, result, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },
    editMachinery: (data, callBack) => {
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
            `UPDATE machinery_report SET${where} WHERE id = ${data.id}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getAllGroup: (data, callBack) => {
        var where = '';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE mr.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mr.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }
        pool.query(
            `select mr.*,u.sitename, DATE_FORMAT(mr.date, "%d-%m-%Y") as date from machinery_report mr left join user u ON u.id = mr.user_id ${where} GROUP BY user_id order by mr.date desc`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    addName: (data, callBack) => {
        pool.query(
            'insert into machinery_name(user_id,name,type) values(?,?,?)',
            [
                data.user_id,
                data.name,
                data.type == 'Supplier Name' ? 1 : 2
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
        if (data.type != '' && data.type != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} type = '${data.type}'`;
        }

        pool.query(
            `select * from machinery_name ${where} ${orderBy}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    searchName: (data, callBack) => {
        var where = '';
        var orderBy = 'order by id desc';

        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} user_id = '${data.user_id}'`;
        }

        if (data.type != '' && data.type != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} type = '${data.type}'`;
        }

        if (data.name != '' && data.name != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} name like '${data.name}%'`;
        }

        pool.query(
            `select * from machinery_name ${where} ${orderBy}`,
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
            `UPDATE machinery_name SET${where} WHERE id = ${data.id}`,
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
            `DELETE FROM machinery_name WHERE id = ${data.id}`,
            (error, result, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },
    getVehicalAll: (data, callBack) => {
        var where = '';
        var orderBy = 'order by mrp.date desc';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE mrp.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mrp.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mrp.user_id = '${data.user_id}'`;
        }

        if (data.vehicle_no != '' && data.vehicle_no != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mrp.vehicle_no = '${data.vehicle_no}'`;
        }

        if (data.date != '' && data.date != undefined) {
            orderBy = `order by mrp.date asc`;
        }

        pool.query(
            `select mrp.id,mrp.user_id,mrp.vehicle,mrp.operator,mrp.unit,mrp.qty,mrp.isActive,mrp.added_datetime,DATE_FORMAT(mrp.date, "%d-%m-%Y") as date,IFNULL((SELECT name FROM machinery_name where id = mrp.suppliername), mrp.suppliername)as suppliername,IFNULL((SELECT name FROM machinery_name where id = mrp.vehicle_no), mrp.vehicle_no)as vehicle_no,mrp.suppliername as suppliername1, mrp.vehicle_no as vehicle2 from machinery_report mrp ${where} ${orderBy}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                pool.query(
                    `SELECT IFNULL(SUM(mrp.qty),0) as total_qty from machinery_report mrp ${where} ${orderBy}`,
                    (error, result, fields) => {
                        if (error) {
                            return callBack(error);
                        }
                        var obj = {
                            data: results,
                            total: result[0]
                        }
                        return callBack(null, obj);
                    }
                );
                // return callBack(null, results);
            }
        );
    },
    getSupplierAll: (data, callBack) => {
        var where = '';
        var orderBy = 'order by mrp.date desc';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE mrp.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mrp.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mrp.user_id = '${data.user_id}'`;
        }

        if (data.suppliername != '' && data.suppliername != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mrp.suppliername = '${data.suppliername}'`;
        }

        if (data.date != '' && data.date != undefined) {
            orderBy = `order by mrp.date asc`;
        }
        console.log(`select mrp.id,mrp.user_id,mrp.vehicle,mrp.operator,mrp.unit,mrp.qty,mrp.isActive,mrp.added_datetime,DATE_FORMAT(mrp.date, "%d-%m-%Y") as date,IFNULL((SELECT name FROM machinery_name where id = mrp.suppliername), mrp.suppliername)as suppliername,IFNULL((SELECT name FROM machinery_name where id = mrp.vehicle_no), mrp.vehicle_no)as vehicle_no, mrp.vehicle_no as vehicle2,mrp.suppliername as suppliername1 from machinery_report mrp ${where} ${orderBy}`);
        pool.query(
            `select mrp.id,mrp.user_id,mrp.vehicle,mrp.operator,mrp.unit,mrp.qty,mrp.isActive,mrp.added_datetime,DATE_FORMAT(mrp.date, "%d-%m-%Y") as date,IFNULL((SELECT name FROM machinery_name where id = mrp.suppliername), mrp.suppliername)as suppliername,IFNULL((SELECT name FROM machinery_name where id = mrp.vehicle_no), mrp.vehicle_no)as vehicle_no, mrp.vehicle_no as vehicle2,mrp.suppliername as suppliername1 from machinery_report mrp ${where} ${orderBy}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                pool.query(
                    `SELECT IFNULL(SUM(mrp.qty),0) as total_qty from machinery_report mrp ${where} ${orderBy}`,
                    (error, result, fields) => {
                        if (error) {
                            return callBack(error);
                        }
                        var obj = {
                            data: results,
                            total: result[0]
                        }
                        return callBack(null, obj);
                    }
                );
                // return callBack(null, results);
            }
        );
    },
    getTotalQty: (data, callBack) => {
        var where = '';
        var orderBy = 'order by mr.date desc';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} user_id = '${data.user_id}'`;
        }

        pool.query(
            `SELECT ifnull(sum(qty),0) as total_qty FROM machinery_report ${where}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
};
