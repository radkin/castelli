#!/bin/bash -xv

# gather artifact's URLs
artifacts_urls=$(curl -s ${upload_build_url}console | grep release | egrep 'ear|jar|war|tar|pom' | cut -d"'" -f2 | grep http
)

# use the upload_build_url to get the job_name which will be the (at a guess)
upload_job_name=`echo "${upload_build_url}" | cut -d'/' -f6` 
echo "our upload_job_name is ${upload_job_name}"

# submit to castelli via REST service
curl -X POST -d "release=${release}&artifacts_urls=${artifacts_urls}&job_name=${upload_job_name}&job_url=${upload_build_url}" -H "Content-Type: application/x-www-form-urlencoded" http://tools-dev.devops.fds.com:3000/api/jenkins
