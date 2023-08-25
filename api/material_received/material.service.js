const pool = require("../../config/database");
var moment = require('moment');

module.exports = {
    create: (data, callBack) => {
        pool.query(
            'insert into  material_received(user_id,suppliername, material, qty, unit, vehicle_no, challan_no,date,added_datetime) values(?,?,?,?,?,?,?,?,?)',
            [
                data.user_id,
                data.suppliername,
                data.material,
                data.qty == '' ? 0 : data.qty,
                data.unit,
                data.vehicle_no,
                data.challan_no == '' ? 0 : data.challan_no,
                moment(data.date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
            ],
            (error, results, fields) => {
                if(error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }
            
        );
    },
    getAll:(data, callBack) => {
        var where = '';
        var orderBy = 'order by mr.date desc';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE mr.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mr.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mr.user_id = '${data.user_id}'`;
        }

        if (data.date != '' && data.date != undefined) {
            orderBy = 'order by mr.date asc';
        }

        // `select * from material_received ${where} limit ${data.offset},${data.length}`,
        // console.log(`select *,DATE_FORMAT(date, "%d-%m-%Y") as date from material_received ${where} order by date desc`);
        pool.query(
            `select mr.id,mr.user_id,mr.material,mr.qty,mr.unit,mr.challan_no,mr.isActive,mr.added_datetime,DATE_FORMAT(mr.date, "%d-%m-%Y") as date,IFNULL((SELECT name FROM material_received_name where id = mr.suppliername), mr.suppliername)as suppliername,mr.suppliername as supplier,IFNULL((SELECT name FROM material_received_name where id = mr.vehicle_no), mr.vehicle_no)as vehicle_no, mr.vehicle_no as vehicle from material_received mr ${where} ${orderBy}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    deleteMaterial: (data,callBack) => {
        pool.query(
            `DELETE FROM material_received WHERE id = ${data.id}`,
            (error, result, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },
    deleteName: (data,callBack) => {
        pool.query(
            `DELETE FROM material_received_name WHERE id = ${data.id}`,
            (error, result, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },
    editMaterial:(data, callBack) => {
        var where = '';
        var index = 0;
        for (const key in data) {
            if (index > 0) {
                where += `,`;
            }
            if (key == 'date') {
                where += ` ${key} = '${moment(data[key], 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
            }else{
                where += ` ${key} = '${data[key]}'`;
            }

            index++;
        }
        pool.query(
            `UPDATE material_received SET${where} WHERE id = ${data.id}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }  
                return callBack(null, results);
            }
        );
    },
    editName:(data, callBack) => {
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
            `UPDATE material_received_name SET${where} WHERE id = ${data.id}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }  
                return callBack(null, results);
            }
        );
    },
    getAllGroup:(data, callBack) => {
        var where = '';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE mr.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mr.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }
        // `select * from material_received ${where} limit ${data.offset},${data.length}`,
        pool.query(
            `select mr.*,u.sitename,DATE_FORMAT(mr.date, "%d-%m-%Y") as date from material_received mr left join user u on u.id = mr.user_id ${where} GROUP BY user_id order by mr.date desc`,
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
            'insert into material_received_name(user_id,name,type) values(?,?,?)',
            [
                data.user_id,
                data.name,
                data.type == 'Supplier Name' ? 1: 2,
            ],
            (error, results, fields) => {
                if(error) {
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
            `select * from material_received_name ${where} ${orderBy}`,
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
            `select * from material_received_name ${where} ${orderBy}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getVehical:(data, callBack) => {
        var where = '';
        var orderBy = 'order by mr.date desc';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE mr.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mr.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mr.user_id = '${data.user_id}'`;
        }

        if (data.vehical != '' && data.vehical != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mr.vehicle_no = '${data.vehical}'`;
        }

        if (data.date != '' && data.date != undefined) {
            orderBy = 'order by mr.date asc';
        }

        // `select * from material_received ${where} limit ${data.offset},${data.length}`,
       
        pool.query(
            `select mr.id,mr.user_id,mr.material,mr.qty,mr.unit,mr.challan_no,mr.isActive,mr.added_datetime,DATE_FORMAT(mr.date, "%d-%m-%Y") as date,IFNULL((SELECT name FROM material_received_name where id = mr.suppliername), mr.suppliername)as suppliername,IFNULL((SELECT name FROM material_received_name where id = mr.vehicle_no), mr.vehicle_no)as vehicle_no,mr.suppliername as supplier, mr.vehicle_no as vehicle from material_received mr ${where} ${orderBy}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                pool.query(
                    `SELECT IFNULL(SUM(mr.qty),0) as total_qty FROM material_received mr ${where} ${orderBy}`,
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
    getSupplier:(data, callBack) => {
        var where = '';
        var orderBy = 'order by mr.date desc';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE mr.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mr.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mr.user_id = '${data.user_id}'`;
        }

        if (data.suppliername != '' && data.suppliername != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mr.suppliername = '${data.suppliername}'`;
        }

        if (data.date != '' && data.date != undefined) {
            orderBy = 'order by mr.date asc';
        }

        // `select * from material_received ${where} limit ${data.offset},${data.length}`,
        pool.query(
            `select mr.id,mr.user_id,mr.material,mr.qty,mr.unit,mr.challan_no,mr.isActive,mr.added_datetime,DATE_FORMAT(mr.date, "%d-%m-%Y") as date,IFNULL((SELECT name FROM material_received_name where id = mr.suppliername), mr.suppliername)as suppliername,IFNULL((SELECT name FROM material_received_name where id = mr.vehicle_no), mr.vehicle_no)as vehicle_no,mr.suppliername as supplier, mr.vehicle_no as vehicle from material_received mr ${where} ${orderBy}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                pool.query(
                    `SELECT IFNULL(SUM(mr.qty),0) as total_qty FROM material_received mr ${where} ${orderBy}`,
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
    getTotalQty:(data, callBack) => {
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
            `SELECT ifnull(sum(qty),0) as total_qty FROM material_received ${where}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
};
