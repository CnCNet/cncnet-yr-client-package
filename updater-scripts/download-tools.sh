#!/bin/sh
SSH_KEY_FILE=$1
SSH_USER=$2
SSH_PASS=$3
SSH_HOST=$4
SSH_PATH_TOOLS=$5
SSH_PORT=$6

chmod 400 $SSH_KEY_FILE

echo downloading tools
sshpass -p $SSH_PASS -P passphrase scp -o StrictHostKeyChecking=no -i $SSH_KEY_FILE -P $SSH_PORT $SSH_USER@$SSH_HOST:$SSH_PATH_TOOLS/gamemd-spawn.exe ./tools
sshpass -p $SSH_PASS -P passphrase scp -o StrictHostKeyChecking=no -i $SSH_KEY_FILE -P $SSH_PORT $SSH_USER@$SSH_HOST:$SSH_PATH_TOOLS/VersionWriter.exe ./tools
