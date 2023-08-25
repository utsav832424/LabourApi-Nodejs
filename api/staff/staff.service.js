const pool = require("../../config/database");
var moment = require('moment');

module.exports = {
    create: (data, callBack) => {
        pool.query(
            'insert into staff(user_id,name,date,added_datetime) values(?,?,?,?)',
            [
                data.user_id,
                data.name,
                moment(data.date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            },

        );
    },
    createuser_staff: (data, callBack) => {
        pool.query(
            'insert into user_staff(user_id,name,added_datetime) values(?,?,?)',
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
            },

        );
    },
    getAll: (data, callBack) => {
        var where = '';

        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} user_id = '${data.user_id}'`;
        }

        if (data.from_date != '' && data.from_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        pool.query(
            `SELECT *, IFNULL((SELECT name FROM user_staff us where us.id = s.name), s.name) as staff_name ,DATE_FORMAT(date, "%d-%m-%Y") as date FROM staff s ${where} ORDER BY id DESC`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getAllSuggName: (data, callBack) => {
        var where = '';

        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} user_id = '${data.user_id}'`;
        }
        pool.query(
            `SELECT * FROM user_staff ${where} AND isActive=1`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getAllGroup: (callBack) => {
        pool.query(
            'select s.*,u.sitename from staff s left join user u on u.id = s.user_id group by user_id order by id desc',
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    deleteStaff: (data, callBack) => {
        pool.query(
            `DELETE FROM staff WHERE id = ${data.id}`,
            (error, result, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },
    editStaff: (data, callBack) => {
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
            `UPDATE staff SET${where} WHERE id = ${data.id}`,
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
            `select * from user_staff ${where} ${orderBy}`,
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
            `UPDATE user_staff SET${where} WHERE id = ${data.id}`,
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
            `DELETE FROM user_staff WHERE id = ${data.id}`,
            (error, result, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
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
            `select * from user_staff ${where} ${orderBy}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getnameByid:(data,callBack)=>{
        var where = '';
        var orderBy = 'order by id desc';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE s.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} s.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }
        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} s.user_id = '${data.user_id}'`;
        }
        if (data.name != '' && data.name != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} s.name = '${data.name}'`;
        }
        pool.query(
            `SELECT s.*,ust.name as staffname,DATE_FORMAT(s.date, "%d-%m-%Y") as date1 FROM staff s LEFT JOIN user_staff ust on s.name=ust.id ${where} ${orderBy}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    }
};
