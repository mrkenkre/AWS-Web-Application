#!/bin/bash

sleep 30

sudo apt-get update
sudo apt install -y nodejs npm mariadb-server zip unzip

cd /tmp
echo "tmp contents: "
sudo ls -lrt
sudo mv /tmp/webapp.zip /opt/webapp.zip
cd /opt
echo "opt contents: "
sudo ls -lrt
sudo unzip webapp.zip
sudo mv /tmp/.env /opt/.env
echo "opt contents after zip: "
sudo ls -lrt
sudo npm install
node app.js

sudo systemctl start mariadb
sudo systemctl enable mariadb

sudo mysql -u root <<EOF
CREATE USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
CREATE DATABASE '$DB_NAME';
GRANT ALL PRIVILEGES ON '$DB_NAME'. TO '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
FLUSH PRIVILEGES;
EOF
