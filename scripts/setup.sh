#!/bin/bash

sleep 30

sudo apt-get update
sudo apt install -y nodejs npm mariadb-server
npm install -g nodemon

sudo mv /tmp/webapp .zip /opt/
sudo mv /tmp/.env /opt/.env
cd /opt/
sudo unzip webapp.zip
cd webapp
sudo npm install

sudo systemctl start mariadb
sudo systemctl enable mariadb

sudo mysql -u root <<EOF
CREATE USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
CREATE DATABASE '$DB_NAME';
USE '$DB_NAME';
GRANT ALL PRIVILEGES ON '$DB_NAME'. TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF
