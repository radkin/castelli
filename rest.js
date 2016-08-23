var mysql = require("mysql");

function REST_ROUTER(router, connection, md5) {
  var self = this;
  self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes =
  function(router, connection, md5) {
    var self = this;
    router.get("/",
      function(req, res) {
        res.json({
          "Message": "Hello World !"
        });
      });

    router.get("/users", function(req, res) {
      var query = "SELECT * FROM ??";
      var table = ["user_login"];
      query = mysql.format(query, table);
      connection.query(query, function(err, rows) {
        if (err) {
          res.json({
            "Error": true,
            "Message": "Error executing MySQL query"
          });
        } else {
          res.json({
            "Error": false,
            "Message": "Success",
            "Users": rows
          });
        }
      });
    });

    router.get("/users/:user_id", function(req, res) {
      var query = "SELECT * FROM ?? WHERE ??=?";
      var table = ["user_login", "user_id", req.params.user_id];
      query = mysql.format(query, table);
      connection.query(query, function(err, rows) {
        if (err) {
          res.json({
            "Error": true,
            "Message": "Error executing MySQL query"
          });
        } else {
          res.json({
            "Error": false,
            "Message": "Success",
            "Users": rows
          });
        }
      });
    });

    router.post("/users", function(req, res) {
      var query = "INSERT INTO ??(??,??) VALUES (?,?)";
      var table = [
        "user_login",
        "user_email",
        "user_password",
        req.body.email,
        md5(req.body.password)
      ];
      query = mysql.format(query, table);
      connection.query(query, function(err, rows) {
        if (err) {
          res.json({
            "Error": true,
            "Message": "Error executing MySQL query"
          });
        } else {
          res.json({
            "Error": false,
            "Message": "User Added !"
          });
        }
      });
    });

    router.put("/users", function(req, res) {
      var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
      var table = [
        "user_login",
        "user_password",
        md5(req.body.password),
        "user_email",
        req.body.email
      ];
      query = mysql.format(query, table);
      connection.query(query, function(err, rows) {
        if (err) {
          res.json({
            "Error": true,
            "Message": "Error executing MySQL query"
          });
        } else {
          res.json({
            "Error": false,
            "Message": "Updated the password for email " + req.body
              .email
          });
        }
      });
    });

    router.delete("/users/:email", function(req, res) {
      var query = "DELETE from ?? WHERE ??=?";
      var table = ["user_login", "user_email", req.params.email];
      query = mysql.format(query, table);
      connection.query(query, function(err, rows) {
        if (err) {
          res.json({
            "Error": true,
            "Message": "Error executing MySQL query"
          });
        } else {
          res.json({
            "Error": false,
            "Message": "Deleted the user with email " + req.params.email
          });
        }
      });
    });

    // Jenkins family of API routes
    router.post('/jenkins', function(req, res) {
      var release = req.body.release;
      var artifacts_urls = req.body.artifacts_urls;
      var job_name = req.body.job_name;
      var job_url = req.body.job_url;
      var data = {
        "error": 1,
        "Jenkinses": ""
      };
      if (!!release && !!artifacts_urls && !!job_name && !!job_url) {
        connection.query(
          "INSERT INTO restful_api.jenkins_event VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE `release` = VALUES(`release`), `artifacts_urls` = VALUES(`artifacts_urls`), `job_url` = (`job_url`)", [
            release, artifacts_urls, job_name, job_url
          ],
          function(err, rows, fields) {
            if (!!err) {
              data["Jenkinses"] = "Error Adding data";
            } else {
              data["error"] = 0;
              data["Jenkinses"] = "Jenkins Event Added Successfully";
            }
            res.json(data);
          });
      } else {
        data["Jenkinses"] =
          "Please provide all required data (i.e : release, artifacts_urls, job_name, job_url)";
        res.json(data);
      }
    });

    router.get('/jenkins', function(req, res) {
      var data = {
        "error": 1,
        "Jenkinses": ""
      };
      connection.query("SELECT * from restful_api.jenkins_event",
        function(err, rows, fields) {
          if (rows.length != 0) {
            data["error"] = 0;
            data["Jenkinses"] = rows;
            res.json(data);
          } else {
            data["Jenkinses"] = 'No Jenkinses Found..';
            res.json(data);
          }
        });
    });

    router.delete('/jenkins', function(req, res) {
      var job_name = req.body.job_name;
      var data = {
        "error": 1,
        "Jenkinses": ""
      };
      if (!!job_name) {
        connection.query(
          "DELETE FROM restful_api.jenkins_event WHERE job_name=?", [
            job_name
          ],
          function(err, rows, fields) {
            if (!!err) {
              data["Jenkinses"] = "Error deleting data";
            } else {
              data["error"] = 0;
              data["Jenkinses"] =
                "Delete Jenkins Event Successfully";
            }
            res.json(data);
          });
      } else {
        data["Jenkinses"] =
          "Please provide all required data (i.e : job_name )";
        res.json(data);
      }
    });

    router.put('/jenkins', function(req, res) {
      var release = req.body.release;
      var artifacts_urls = req.body.artifacts_urls;
      var job_name = req.body.job_name;
      var job_url = req.body.job_url;
      var data = {
        "error": 1,
        "Jenkinses": ""
      };
      if (!!release && !!artifacts_urls && !!job_name && !!job_url) {
        connection.query(
          "UPDATE restful_api.jenkins_event SET release=?, artifacts_urls=?, job_name=? , job_url=? WHERE job_name=?", [
            release, artifacts_urls, job_name, job_url
          ],
          function(err, rows, fields) {
            if (!!err) {
              data["Jenkinses"] = "Error Updating data";
            } else {
              data["error"] = 0;
              data["Jenkinses"] = "Updated Jenkins Successfully";
            }
            res.json(data);
          });
      } else {
        data["Jenkinses"] =
          "Please provide all required data (i.e : release,artifacts_urls,job_name,job_url)";
        res.json(data);
      }
    });

    router.get('/jobs', function(req, res) {
      var data = {
        "error": 1,
        "jobs": ""
      };
      connection.query("SELECT * from restful_api.jenkins_event",
        function(err, rows, fields) {
          if (rows.length != 0) {
            data["error"] = 0;
            data["jobs"] = rows;
            res.json(data);
          } else {
            data["jobs"] = 'No jobs Found..';
            res.json(data);
          }
        });
    });

  }

module.exports = REST_ROUTER;
