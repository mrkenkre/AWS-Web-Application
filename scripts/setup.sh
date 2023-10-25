#!/bin/bash

sleep 20

sudo apt-get update
sudo apt install -y nodejs npm unzip

sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225

cd /tmp
sudo mv /tmp/webapp.zip /opt/csye6225/webapp.zip
cd /opt/csye6225
sudo unzip webapp.zip
sudo chown -R csye6225:csye6225 /opt/csye6225

sudo npm install

sudo cp csye6225.service /etc/systemd/system
sudo systemctl daemon-reload
sudo systemctl enable csye6225
sudo systemctl start csye6225
sudo systemctl restart csye6225
sudo systemctl stop csye6225