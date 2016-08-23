create table `restful_api`.`jenkins_event` (`release` VARCHAR(10) NOT NULL, `artifacts_urls` VARCHAR(2083), `job_name` VARCHAR(60), `job_url` VARCHAR(2083) PRIMARY KEY (`job_name`)) ENGINE = InnoDB;

