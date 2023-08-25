const pool = require("../../config/database");
var moment = require('moment');

module.exports = {
  create: (data, callBack) => {
    pool.query(
      'insert into user(sitename,password,added_datetime) values(?,?,?)',
      [
        data.sitename,
        data.password,
        moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getUsers: callBack => {
    pool.query(
      'select id,sitename,type FROM user where type = 1 order by id desc',
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  getUserByUserId: (id, callBack) => {
    pool.query(
      'select id,sitename,password FROM user where id = ?',
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  updateUser: (data, callBack) => {
    if (data.password != '') {
      pool.query(
        'update user set sitename = ?, password = ? where id = ? ',
        [
          data.sitename,
          data.password,
          data.id
        ],
        (error, results, fields) => {
          if (error) {
            callBack(error);
          }
          return callBack(null, results);
        }
      );
    } else {
      pool.query(
        'update user set sitename = ? where id = ? ',
        [
          data.sitename,
          data.id
        ],
        (error, results, fields) => {
          if (error) {
            callBack(error);
          }
          return callBack(null, results);
        }
      );
    }
  },
  deleteUser: (data, callBack) => {
    pool.query(
      'delete from user where id = ?',
      [data.id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        pool.query(
          `delete from asset_transfer where user_id = ${data.id}`,
          (error, results, fields) => {
            if (error) {
              return callBack(error);
            }
            // return callBack(null, results);
          }
        );
        pool.query(
          `delete from asset_transfer_item where user_id = ${data.id}`,
          (error, results, fields) => {
            if (error) {
              return callBack(error);
            }
            // return callBack(null, results);
          }
        );
        pool.query(
          `delete from diesel_report where user_id = ${data.id}`,
          (error, results, fields) => {
            if (error) {
              return callBack(error);
            }
            // return callBack(null, results);
          }
        );
        pool.query(
          `delete from labour_contractor where user_id = ${data.id}`,
          (error, results, fields) => {
            if (error) {
              return callBack(error);
            }
            // return callBack(null, results);
          }
        );
        pool.query(
          `delete from labour_report where user_id = ${data.id}`,
          (error, results, fields) => {
            if (error) {
              return callBack(error);
            }
            // return callBack(null, results);
          }
        );
        pool.query(
          `delete from machinery where user_id = ${data.id}`,
          (error, results, fields) => {
            if (error) {
              return callBack(error);
            }
            // return callBack(null, results);
          }
        );
        pool.query(
          `delete from machinery_report where user_id = ${data.id}`,
          (error, results, fields) => {
            if (error) {
              return callBack(error);
            }
            // return callBack(null, results);
          }
        );
        pool.query(
          `delete from machine_service where user_id = ${data.id}`,
          (error, results, fields) => {
            if (error) {
              return callBack(error);
            }
            // return callBack(null, results);
          }
        );
        pool.query(
          `delete from material_received where user_id = ${data.id}`,
          (error, results, fields) => {
            if (error) {
              return callBack(error);
            }
            // return callBack(null, results);
          }
        );
        pool.query(
          `delete from operator where user_id = ${data.id}`,
          (error, results, fields) => {
            if (error) {
              return callBack(error);
            }
            // return callBack(null, results);
          }
        );
        pool.query(
          `delete from staff where user_id = ${data.id}`,
          (error, results, fields) => {
            if (error) {
              return callBack(error);
            }
            // return callBack(null, results);
          }
        );
        pool.query(
          `delete from store_diesel where user_id = ${data.id}`,
          (error, results, fields) => {
            if (error) {
              return callBack(error);
            }
            // return callBack(null, results);
          }
        );
        return callBack(null, results);
      }
    );
  },
  getUserByUserEmail: (sitename, callBack) => {
    pool.query(
      'select *  from user where sitename = ?',
      [sitename],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  }
}