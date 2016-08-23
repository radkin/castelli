REST Service for DevOps
=======================

Accept Jenkins posts to track artifacts, jobs, and URLs
-------------------------------------------------------

Instructions for installation

### Mysql

-	install mysql-server with the package manager (apt-get install mysql-server .. E.G.)
-	mysqladmin -uroot create restful_api

```
mysql -uroot
mysql> CREATE USER 'castelli'@'localhost' IDENTIFIED BY 'secret_pass';
mysql> GRANT ALL ON restful_api.* TO 'castelli'@'localhost';
mysql -ucastelli -p restful_api < initial_schema.sql
mysql -ucastelli -p restful_api < jenkins_api.sql
```

### Castelli application

```
npm install
pm2 start server.js --name "castelli"
pm2 monit
```

### Example curl that populates jenkins_event

```
curl -X POST -d 'release=01&job_url=http://our-jenkins.example.com:8080/jenkins/job/kick_off_deploy/&job_name=new_job_Deploy' -H "Content-Type: application/x-www-form-urlencoded" http://castelli-host.example.com:3000/api/jenkins
```
