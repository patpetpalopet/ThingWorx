var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var moment = require("moment");

var app = express();
// set bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// set Origin
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, X-access-token");
  res.header("Access-Control-Allow-Headers", "Content-Type, application/json");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

var url = "http://96.30.77.157:550/Thingworx/";
// var url = "http://10.41.55.2:550/Thingworx/";

var header = {
  Accept: "application/json",
  "Content-Type": "application/json",
  appkey: "66f02084-5242-4b7d-8e64-7f046353ecac"
};
app.get("/", (req, res) => {
    res.json({
        error: "error"
      });
});
app.post("/calculate", (req, res) => {
  sendLog(JSON.stringify(req));
  res.json({
    "statusCode": 200
    });
});
app.get("/GetBreakTime", async (req, res)  =>  {
  var options = {
    method: "post",
    url: url + "Things/Shift/Services/ShowRecond",
    headers: header
  };
  await request(options, async (error, response, body) => {
    if (error) {
      res.json({
        error: error
      });
    } else {
      var Shift = JSON.parse(body).rows;
      Shift.forEach(function(element) {
        element["BreakTime"] = [];
        element.Title = element.Title.trim();
        element.TimeStart = moment(element.TimeStart).format("HH:mm");
        element.TimeEnd = moment(element.TimeEnd).format("HH:mm");
      });
      var BreakTimeOp = {
        method: "post",
        url: url + "Things/BreakTime/Services/ShowRecond",
        headers: header
      };
      await request(BreakTimeOp, function(error, response, body) {
        if (error) {
          res.json({
            error: error
          });
        } else {
          var BreakTime = JSON.parse(body).rows;
          BreakTime.forEach(function(elementb) {
            elementb.Title = elementb.Title.trim();
            elementb.TimeStart = moment(elementb.TimeStart).format("HH:mm");
            elementb.TimeEnd = moment(elementb.TimeEnd).format("HH:mm");
          });
          Shift.forEach(function(elementa) {
            BreakTime.forEach(function(elementb) {
              if (elementa.ID == elementb.TimeShift) {
                elementa.BreakTime.push(elementb);
              }
            });
          });
          res.json({
            statusCode: response.statusCode,
            body: Shift
          });
        }
      });
    }
  });
});

function sendLog(text) {
  request({
      method: 'POST',
      uri: 'https://notify-api.line.me/api/notify',
      header: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
          bearer: 'yvYn8ypJpA4R02Ihi2NaYvXIdp8zk8cXL9YjfKYOEkR',
          // bearer: 'xrzR8tzdmn8vklmFQQ9Lzf0NztNnX4Yycya6wmd1QWk',
      },
      form: {
          message: text, //ข้อความที่จะส่ง
      },
  }, (err, httpResponse, body) => {
      if (err) {
          console.log(err);
      } else {
          console.log(body);
      }
  });
};

var port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Server running at http://localhost:' + port);
});