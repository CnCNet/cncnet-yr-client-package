FROM ubuntu:latest

RUN apt-get update && apt-get install -y sshpass

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

