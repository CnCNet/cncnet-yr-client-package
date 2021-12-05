#!/bin/bash
#uncomment this ONLY when running locally, for debugging output purposes
#set -x

# create our key file to pass to scp
cd upload-version
echo -e ${SSH_KEY}>__tmp_key_file
chmod 400 __tmp_key_file

# create necessary version folder for update
echo creating version folder
sshpass -p ${SSH_PASS} -P passphrase ssh -o StrictHostKeyChecking=no -i __tmp_key_file -p ${SSH_PORT} ${SSH_USER}@${SSH_HOST} mkdir ${SSH_PATH_UPDATES}/${VERSION}

# upload deploy archive
sshpass -p ${SSH_PASS} -P passphrase scp -o StrictHostKeyChecking=no -i __tmp_key_file -P ${SSH_PORT} archive.tar.gz ${SSH_USER}@${SSH_HOST}:${SSH_PATH_UPDATES}/${VERSION}/

# extract the deploy archive
sshpass -p ${SSH_PASS} -P passphrase ssh -o StrictHostKeyChecking=no -i __tmp_key_file -p ${SSH_PORT} ${SSH_USER}@${SSH_HOST} tar -xzvf ${SSH_PATH_UPDATES}/${VERSION}/archive.tar.gz -C ${SSH_PATH_UPDATES}/${VERSION}

# delete the deploy archive from server
sshpass -p ${SSH_PASS} -P passphrase ssh -o StrictHostKeyChecking=no -i __tmp_key_file -p ${SSH_PORT} ${SSH_USER}@${SSH_HOST} rm ${SSH_PATH_UPDATES}/${VERSION}/archive.tar.gz

# update permissions on all update files for update download purposes
sshpass -p ${SSH_PASS} -P passphrase ssh -o StrictHostKeyChecking=no -i __tmp_key_file -p ${SSH_PORT} ${SSH_USER}@${SSH_HOST} chmod 777 --recursive ${SSH_PATH_UPDATES}/${VERSION}/*

# clean up temporary key file
rm __tmp_key_file

# uncomment this to debug the directory contents during github action
dir

# uncomment this when running locally to keep the container alive for debugging purposes
#tail -f /dev/null
