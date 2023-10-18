#!/bin/bash

sleep 20

sudo apt-get update
sudo apt install -y nodejs npm mariadb-server zip unzip

cd /tmp
sudo mv /tmp/webapp.zip /opt/webapp.zip
cd /opt
sudo unzip webapp.zip
sudo mv /tmp/.env /opt/.env
sudo npm install

sudo systemctl start mariadb
sudo systemctl enable mariadb

sudo mysql -u root <<EOF
CREATE USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
CREATE DATABASE $DB_NAME;
GRANT ALL PRIVILEGES ON *.* TO $DB_USER@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF