#!/bin/bash
#uncomment this ONLY when running locally, for debugging output purposes
#set -x

# create our key file to pass to scp
cd download-tools
echo -e ${SSH_KEY}>__tmp_key_file
chmod 400 __tmp_key_file

# download necessary tools for update
echo downloading tools
#sshpass -p ${SSH_PASS} -P passphrase scp -o StrictHostKeyChecking=no -i __tmp_key_file -P ${SSH_PORT} ${SSH_USER}@${SSH_HOST}:${SSH_PATH_TOOLS_YR}/gamemd-spawn-20220829.exe ./gamemd-spawn.exe
sshpass -p ${SSH_PASS} -P passphrase scp -o StrictHostKeyChecking=no -i __tmp_key_file -P ${SSH_PORT} ${SSH_USER}@${SSH_HOST}:${SSH_PATH_TOOLS_COMMON}/VersionWriter.exe .

# clean up temporary key file
rm __tmp_key_file

# uncomment this to debug the directory contents during github action
dir

# uncomment this when running locally to keep the container alive for debugging purposes
#tail -f /dev/null
