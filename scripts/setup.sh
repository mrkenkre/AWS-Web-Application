#!/bin/bash

sleep 30

#sudo apt-get update
sudo apt install -y nodejs npm mariadb-server unzip

cd /tmp
echo "Contents of current path:"
ls
sudo mv /tmp/webapp.zip /opt/webapp.zip
cd /opt/
echo "Contents of current path:"
ls
sudo unzip webapp.zip
echo "Contents of current path:"
ls
cd webapp
sudo mv /tmp/.env /opt/.env
sudo npm install
node app.js

sudo systemctl start mariadb
sudo systemctl enable mariadb

sudo mysql -u root <<EOF
CREATE USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
CREATE DATABASE '$DB_NAME';
USE '$DB_NAME';
GRANT ALL PRIVILEGES ON '$DB_NAME'. TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF
