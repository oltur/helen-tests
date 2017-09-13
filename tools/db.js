"use strict";
const testData = require('../json/test-data.json');
const sql = require('mssql');

class Db {

    constructor() {
    }

    getData(cs = testData.db.csFreedomSite, query = "select * from DpnDatabaseProperties where Name ='Database Version'", parameters = []) {
        sql.close();
        return sql.connect(cs)
            .then(pool => {
                let request = pool.request();
                parameters.forEach(parameter => {
                    request.input(parameter.name, parameter.type/*sql.Int*/, parameter.value)
                })
                return request.query(query);
            }).then(result => {
                return Promise.resolve(result.recordsets);
            });

    }
}

exports.getInstance = () => new Db();