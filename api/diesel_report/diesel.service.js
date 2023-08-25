const pool = require("../../config/database");
var moment = require('moment');

module.exports = {
    create: (data, callBack) => {
        pool.query(
            'insert into  diesel_report(user_id,machinery, vehiclenumber, driver, qty_ltr,date,added_datetime) values(?,?,?,?,?,?,?)',
            [
                data.user_id,
                data.machinery,
                data.vehiclenumber,
                data.driver,
                data.qty_ltr == '' ? 0 : data.qty_ltr,
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
    createVehicle: (data, callBack) => {
        pool.query(
            'insert into diesel_vehicle(user_id,name) values(?,?)',
            [
                data.user_id,
                data.name,
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
        var orderBy = 'dr.date desc';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE dr.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} dr.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} dr.user_id = '${data.user_id}'`;
        }
        if (data.date != '' && data.date != undefined) {
            orderBy = `dr.date asc`;
        }
        pool.query(
            `select dr.*, DATE_FORMAT(dr.date, "%d-%m-%Y") as date from diesel_report dr ${where} order by ${orderBy}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    addDiesel: (data, callBack) => {
        pool.query(
            'insert into store_diesel(user_id,date, ltr, added_datetime) values(?,?,?,?)',
            [
                data.user_id,
                moment(data.date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                data.qty_ltr,
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
    deleteDiesel: (data, callBack) => {
        pool.query(
            `DELETE FROM diesel_report WHERE id = ${data.id}`,
            (error, result, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },
    editDiesel: (data, callBack) => {
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
            `UPDATE diesel_report SET${where} WHERE id = ${data.id}`,
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
            where += ` WHERE dr.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} dr.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }
        pool.query(
            `select dr.*,u.sitename, DATE_FORMAT(dr.date, "%d-%m-%Y") as date from diesel_report dr left join user u ON u.id = dr.user_id ${where} GROUP BY user_id order by dr.date desc`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getTotalDiesel: (data, callBack) => {
        var sid = '';
        if (data.user_id != '' && data.user_id != undefined) {
            sid += `WHERE user_id = '${data.user_id}'`;
        }
        var where = '';
        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == '' ? 'WHERE' : 'AND'} user_id = '${data.user_id}'`;
        }
        if ((data.from_date == '' || data.from_date == undefined) && (data.to_date == '' || data.to_date == undefined)) {
            where += ` ${where == '' ? 'WHERE' : 'AND'} date = CURDATE()`;
        }
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` ${where == '' ? 'WHERE' : 'AND'} date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == '' ? 'WHERE' : 'AND'} date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        var totalUserWhere = '';

        if ((data.from_date == '' || data.from_date == undefined) && (data.to_date == '' || data.to_date == undefined)) {
            totalUserWhere += ` ${totalUserWhere == '' ? 'WHERE' : 'AND'} d.date = CURDATE()`;
        }

        if (data.user_id != '' && data.user_id != undefined) {
            totalUserWhere += ` ${totalUserWhere == '' ? 'WHERE' : 'AND'} d.user_id = '${data.user_id}'`;
        }

        if (data.from_date != '' && data.from_date != undefined) {
            totalUserWhere += ` ${totalUserWhere == '' ? 'WHERE' : 'AND'} d.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            totalUserWhere += ` ${totalUserWhere == '' ? 'WHERE' : 'AND'} d.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }
        console.log(`SELECT 
        ifnull(SUM(ltr),0)as total_stock, 
        (SElECT ifnull(SUM(qty_ltr),0) FROM diesel_report d ${totalUserWhere})as total_used,
        (SELECT ifnull(SUM(ltr),0)as total_stock FROM store_diesel ${where})as incoming
    FROM store_diesel ${sid}`);
        pool.query(
            `SELECT 
            ifnull(SUM(ltr),0)as total_stock, 
            (SElECT ifnull(SUM(qty_ltr),0) FROM diesel_report d ${totalUserWhere})as total_used,
            (SELECT ifnull(SUM(ltr),0)as total_stock FROM store_diesel ${where})as incoming
        FROM store_diesel ${sid}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
        // if (data.vehiclenumber != '' && data.vehiclenumber != undefined) {
        //     where += ` ${where == "" ? 'WHERE' : 'AND'} vehiclenumber = '${data.vehiclenumber}'`;
        // }
        // pool.query(
        //     `SELECT
        //     *, ifnull(((yesterday + incoming) - total_used),0) as total_stock
        // FROM(
        // SELECT ifnull(sum(ltr),0)as incoming, (SELECT ifnull(sum(qty_ltr),0) FROM diesel_report WHERE ${totalUserWhere})as total_used, ifnull((SELECT (SUM(ltr) - (SELECT ifnull(sum(qty_ltr),0) FROM diesel_report WHERE date < CURDATE() ${where})) as total FROM store_diesel WHERE date < CURDATE() ${where}),0)as yesterday FROM store_diesel WHERE date = CURDATE() ${where}
        //     )as x`,
        //     (error, results, fields) => {
        //         if (error) {
        //             return callBack(error);
        //         }
        //         pool.query(
        //             `SELECT *, ifnull(((yesterday + incoming) - total_used),0) as total_stock FROM(SELECT ifnull(sum(ltr),0)as incoming, (SELECT ifnull(sum(qty_ltr),0) FROM diesel_report WHERE   user_id = '${data.user_id}' AND date >=  CURDATE() AND date <=  CURDATE())as total_used, ifnull((SELECT (SUM(ltr) - (SELECT ifnull(sum(qty_ltr),0) FROM diesel_report WHERE date < CURDATE()  AND user_id = '${data.user_id}')) as total FROM store_diesel WHERE date < CURDATE()  AND user_id = '${data.user_id}'),0)as yesterday FROM store_diesel WHERE date = CURDATE()  AND user_id = '${data.user_id}')as x`,
        //             (error, result, fields) => {
        //                 if (error) {
        //                     return callBack(error);
        //                 }
        //                 results[0]['total_stock'] =  result[0]['total_stock'];
        //                 return callBack(null, results);
        //             }
        //         );
        //         // return callBack(null, results);
        //     }
        // );
    },
    getAllDiesel: (data, callBack) => {
        var where = '';
        if (data.user_id != '' && data.user_id != undefined) {
            where += ` WHERE user_id = '${data.user_id}'`;
        }

        if (data.from_date != '' && data.from_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }
        pool.query(
            `SELECT *, DATE_FORMAT(date, "%d-%m-%Y")as date FROM store_diesel ${where} ORDER BY date desc`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getVehicalAll: (data, callBack) => {
        var where = '';
        var orderBy = 'dr.date desc';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE dr.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} dr.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} dr.user_id = '${data.user_id}'`;
        }

        if (data.vehiclenumber != '' && data.vehiclenumber != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} dr.vehiclenumber = '${data.vehiclenumber}'`;
        }
        console.log(`SELECT IFNULL(SUM(dr.qty_ltr),0) as total_qty FROM diesel_report dr ${where} order by date desc`);
        pool.query(
            `SELECT *,DATE_FORMAT(date, "%d-%m-%Y")as date FROM diesel_report dr ${where} order by date desc`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                pool.query(
                    `SELECT IFNULL(SUM(dr.qty_ltr),0) as total_qty FROM diesel_report dr ${where} order by date desc`,
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
                //   return callBack(null, results);
            }
        );
    },
    getAllVechical: (data, callBack) => {
        var where = '';
        var orderBy = 'dr.date desc';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE dr.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} dr.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} dr.user_id = '${data.user_id}'`;
        }

        if (data.vehiclenumber != '' && data.vehiclenumber != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} dr.vehiclenumber = '${data.vehiclenumber}'`;
        }
        if (data.date != '' && data.date != undefined) {
            orderBy = `dr.date asc`;
        }
        pool.query(
            `select dr.*, DATE_FORMAT(dr.date, "%d-%m-%Y") as date from diesel_report dr ${where} order by ${orderBy}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                pool.query(
                    `SELECT IFNULL(SUM(dr.qty_ltr),0) as total_qty from diesel_report dr ${where} order by ${orderBy}`,
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
            `select * from diesel_vehicle ${where} ${orderBy}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
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
            `select * from diesel_vehicle ${where} ${orderBy}`,
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
            `UPDATE diesel_vehicle SET${where} WHERE id = ${data.id}`,
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
            `DELETE FROM diesel_vehicle WHERE id = ${data.id}`,
            (error, result, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },
};