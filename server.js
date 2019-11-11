const express = require('express')
const app = express()
const sql = require('mssql');
var config = {
    user: 'sa',
    password: '_@dministrat0rMTW_',
    server: '10.41.55.2', 
    // server: '96.30.77.157', 
    database: 'devDB' 
};

app.get('/', (req, res) => {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('Select * from dbo.TimeShift', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset);
        });
    });
})

app.listen(3000, () => {
  console.log('Start server at port 3000.')
})