const pool = require("../../config/database");
var moment = require('moment');

module.exports = {
    create: (data, callBack) => {
        pool.query(
            'insert into labour_report(user_id,contractorname, labourfullday, labourothrs, masonfullday, masonothrs, carpenterfullday, carprnterothrs, helperfullday, helperothrs,date,added_datetime) values(?,?,?,?,?,?,?,?,?,?,?,?)',
            [
                data.user_id,
                data.contractorname,
                data.labourfullday == '' ? 0 : data.labourfullday,
                data.labourothrs == '' ? 0 : data.labourothrs,
                data.masonfullday == '' ? 0 : data.masonfullday,
                data.masonothrs == '' ? 0 :  data.masonothrs,
                data.carpenterfullday == '' ? 0 : data.carpenterfullday,
                data.carprnterothrs == '' ? 0 : data.carprnterothrs,
                data.helperfullday == '' ? 0 : data.helperfullday,
                data.helperothrs == '' ? 0 : data.helperothrs,
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
    getAll:(data,callBack) => {
        var where = '';
        var orderBy = 'order by lr.date desc';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE lr.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} lr.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} lr.user_id = '${data.user_id}'`;
        }

        if (data.date != '' && data.date != undefined) {
            orderBy = ` order by lr.date ${data.date}`;
        } 
        console.log( `select lr.id,lr.user_id,lc.name as contractorname,contractorname as contractorname_id, IFNULL(SUM(labourfullday),0) as labourfullday,IFNULL(SUM(labourothrs),0) as labourothrs, IFNULL(SUM(masonfullday),0) as masonfullday, IFNULL(SUM(masonothrs),0) as masonothrs, IFNULL(SUM(carpenterfullday),0) as carpenterfullday, IFNULL(SUM(carprnterothrs),0) as carprnterothrs, IFNULL(SUM(helperfullday),0) as helperfullday, IFNULL(SUM(helperothrs),0) as helperothrs,DATE_FORMAT(lr.date, "%d-%m-%Y") as date from labour_report lr left join labour_contractor lc ON lc.id = lr.contractorname ${where} GROUP BY contractorname ${orderBy}`);
        pool.query(
            `select lr.id,lr.user_id,lc.name as contractorname,contractorname as contractorname_id, IFNULL(SUM(labourfullday),0) as labourfullday,IFNULL(SUM(labourothrs),0) as labourothrs, IFNULL(SUM(masonfullday),0) as masonfullday, IFNULL(SUM(masonothrs),0) as masonothrs, IFNULL(SUM(carpenterfullday),0) as carpenterfullday, IFNULL(SUM(carprnterothrs),0) as carprnterothrs, IFNULL(SUM(helperfullday),0) as helperfullday, IFNULL(SUM(helperothrs),0) as helperothrs,DATE_FORMAT(lr.date, "%d-%m-%Y") as date from labour_report lr left join labour_contractor lc ON lc.id = lr.contractorname ${where} GROUP BY contractorname ${orderBy}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                pool.query(
                    `SELECT
                    IFNULL(SUM(totallabourfullday),0) as totallabourfullday,IFNULL(SUM(totallabourothrs),0) as totallabourothrs, IFNULL(SUM(totalmasonfullday),0)as totalmasonfullday, IFNULL(SUM(totalmasonothrs),0)as totalmasonothrs, IFNULL(SUM(totalcarpenterfullday),0)as totalcarpenterfullday, IFNULL(SUM(totalcarprnterothrs),0)as totalcarprnterothrs, IFNULL(SUM(totalhelperfullday),0)as totalhelperfullday, IFNULL(SUM(totalhelperothrs),0)as totalhelperothrs FROM(
                    select IFNULL(SUM(labourfullday),0) as totallabourfullday,IFNULL(SUM(labourothrs),0) as totallabourothrs, IFNULL(SUM(masonfullday),0)as totalmasonfullday, IFNULL(SUM(masonothrs),0)as totalmasonothrs, IFNULL(SUM(carpenterfullday),0)as totalcarpenterfullday, IFNULL(SUM(carprnterothrs),0)as totalcarprnterothrs, IFNULL(SUM(helperfullday),0)as totalhelperfullday, IFNULL(SUM(helperothrs),0)as totalhelperothrs from labour_report lr left join labour_contractor lc ON lc.id = lr.contractorname ${where} order by lr.date desc)as x
                    `,
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
    getGroup:(data,callBack) => {
        var where = '';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE lr.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} lr.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }
        // console.log(`select lr.id,lr.user_id,lc.name as contractorname,contractorname as contractorname_id, labourfullday,labourothrs, masonfullday, masonothrs, carpenterfullday, carprnterothrs, helperfullday, helperothrs,DATE_FORMAT(lr.date, "%d-%m-%Y") as date from labour_report lr left join labour_contractor lc ON lc.id = lr.contractorname ${where} group by lr.user_id order by lr.id desc`);
        pool.query(
            `select lr.id,lr.user_id,u.sitename,lc.name as contractorname,contractorname as contractorname_id, labourfullday,labourothrs, masonfullday, masonothrs, carpenterfullday, carprnterothrs, helperfullday, helperothrs,DATE_FORMAT(lr.date, "%d-%m-%Y") as date from labour_report lr left join labour_contractor lc ON lc.id = lr.contractorname LEFT JOIN user u ON u.id = lr.user_id ${where} group by lr.user_id order by lr.date desc`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                pool.query(
                    `SELECT
                    IFNULL(SUM(totallabourfullday),0) as totallabourfullday,IFNULL(SUM(totallabourothrs),0) as totallabourothrs, IFNULL(SUM(totalmasonfullday),0)as totalmasonfullday, IFNULL(SUM(totalmasonothrs),0)as totalmasonothrs, IFNULL(SUM(totalcarpenterfullday),0)as totalcarpenterfullday, IFNULL(SUM(totalcarprnterothrs),0)as totalcarprnterothrs, IFNULL(SUM(totalhelperfullday),0)as totalhelperfullday, IFNULL(SUM(totalhelperothrs),0)as totalhelperothrs FROM(
                    select IFNULL(SUM(labourfullday),0) as totallabourfullday,IFNULL(SUM(labourothrs),0) as totallabourothrs, IFNULL(SUM(masonfullday),0)as totalmasonfullday, IFNULL(SUM(masonothrs),0)as totalmasonothrs, IFNULL(SUM(carpenterfullday),0)as totalcarpenterfullday, IFNULL(SUM(carprnterothrs),0)as totalcarprnterothrs, IFNULL(SUM(helperfullday),0)as totalhelperfullday, IFNULL(SUM(helperothrs),0)as totalhelperothrs from labour_report lr left join labour_contractor lc ON lc.id = lr.contractorname ${where} group by lr.user_id order by lr.date desc)as x
                    `,
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
    createContractor: (data, callBack) => {
        pool.query(
            'insert into labour_contractor(user_id,name) values(?,?)',
            [
                data.user_id,
                data.name,
            ],
            (error, results, fields) => {
                if(error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }
            
        );
    },
    getContractor:(data,callBack) => {
        pool.query(
            `select * from labour_contractor where user_id=${data.user_id} order by id desc`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    checkContractor:(data, callBack) => {
        pool.query(
            `select * from labour_contractor where name = '${data.name}' order by id desc`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getContracterWise:(data,callBack) => {
        var where = '';
        var orderBy = 'order by lr.date desc';
        if (data.from_date != '' && data.from_date != undefined) {
            where += ` WHERE lr.date >= '${moment(data.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.to_date != '' && data.to_date != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} lr.date <= '${moment(data.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}'`;
        }

        if (data.contractor_id != '' && data.contractor_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} lr.contractorname = '${data.contractor_id}'`;
        }

        if (data.user_id != '' && data.user_id != undefined) {
            where += ` ${where == "" ? 'WHERE' : 'AND'} lr.user_id = '${data.user_id}'`;
        }

        if (data.date != '' && data.date != undefined) {
            orderBy = ` order by lr.date ${data.date}`;
        }
        
        pool.query(
            `select lr.id,lr.user_id,lc.name as contractorname,contractorname as contractorname_id, labourfullday,labourothrs, masonfullday, masonothrs, carpenterfullday, carprnterothrs, helperfullday, helperothrs,DATE_FORMAT(lr.date, "%d-%m-%Y") as date from labour_report lr left join labour_contractor lc ON lc.id = lr.contractorname ${where} ${orderBy}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                pool.query(
                    `select IFNULL(SUM(labourfullday),0) as totallabourfullday,IFNULL(SUM(labourothrs),0) as totallabourothrs, IFNULL(SUM(masonfullday),0)as totalmasonfullday, IFNULL(SUM(masonothrs),0)as totalmasonothrs, IFNULL(SUM(carpenterfullday),0)as totalcarpenterfullday, IFNULL(SUM(carprnterothrs),0)as totalcarprnterothrs, IFNULL(SUM(helperfullday),0)as totalhelperfullday, IFNULL(SUM(helperothrs),0)as totalhelperothrs from labour_report lr left join labour_contractor lc ON lc.id = lr.contractorname ${where} order by lr.date desc
                    `,
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
            }
        );
    },
    deleteContractor: (data,callBack) => {
        pool.query(
            `DELETE FROM labour_contractor WHERE id = ${data.id}`,
            (error, result, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },
    searchContractor:(data, callBack) => {
        pool.query(
            `select * from labour_contractor where user_id=${data.user_id} and name like '%${data.name}%' order by id desc`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    editContractorName:(data, callBack) => {
        pool.query(
            `UPDATE labour_contractor SET name = '${data.name}' WHERE id = ${data.id}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    deleteContractorReport: (data,callBack) => {
        pool.query(
            `DELETE FROM labour_report WHERE id = ${data.id}`,
            (error, result, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result);
            }
        );
    },
    editContractor:(data, callBack) => {
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
            `UPDATE labour_report SET${where} WHERE id = ${data.id}`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
};