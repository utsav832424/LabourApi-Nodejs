const pool = require("../../config/database");
var moment = require('moment');

module.exports = {
    create: (data, callBack) => {
        pool.query(
            'insert into machinery(user_id,date,name,insurance,registration_date,rc_book,puc,fitness,form_10,cng_kit,vehical,added_datetime) values(?,?,?,?,?,?,?,?,?,?,?,?)',
            [
                data.user_id,
                moment(data.date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                data.name,
                data.insurance,
                moment(data.registration_date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                data.rc_book,
                data.puc,
                data.fitness,
                data.form_10,
                data.cng_kit,
                data.vehical,
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
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE mc.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mc.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }
        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} mc.user_id = '${data.user_id}'`;
        }
        pool.query(
            `select mc.*, DATE_FORMAT(mc.date, "%d-%m-%Y") as date, DATE_FORMAT(mc.registration_date, "%d-%m-%Y") as registration_date from machinery mc ${where} order by mc.date desc`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getGroupAll: (data, callBack) => {
        var where = '';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE m.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} m.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        pool.query(
            `select m.*,u.sitename, DATE_FORMAT(m.date, "%d-%m-%Y") as date, DATE_FORMAT(m.registration_date, "%d-%m-%Y") as registration_date from machinery m left join user u on u.id = m.user_id ${where} group by user_id order by m.date desc`,
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
            `DELETE FROM machinery WHERE id = ${data.id}`,
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

            if (key == 'registration_date' || key == 'date') {
                where += ` ${key} = '${moment(data[key], 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
            } else {
                where += ` ${key} = '${data[key]}'`;
            }
            index++;
        }
        pool.query(
            `UPDATE machinery SET${where} WHERE id = ${data.id}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    addService: (data, callBack) => {
        pool.query(
            'insert into machine_service(machinery_id,user_id,date,hours,description,next_service_hrs) values(?,?,?,?,?,?)',
            [
                data.machinery_id,
                data.user_id,
                moment(data.date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                data.hours,
                data.description,
                data.next_service_hrs
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }

        );
    },
    getAllService: (data, callBack) => {
        var where = '';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.machinery_id != '' && data.machinery_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} machinery_id = '${data.machinery_id}'`;
        }
        pool.query(
            `select *, DATE_FORMAT(date, "%d-%m-%Y") as date from machine_service ${where} order by id desc`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }

        );
    },
    editService: (data, callBack) => {
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
            `UPDATE machine_service SET${where} WHERE id = ${data.id}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    deleteService: (data, callBack) => {
        pool.query(
            `DELETE FROM machine_service WHERE  id = ${data.id}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
};
