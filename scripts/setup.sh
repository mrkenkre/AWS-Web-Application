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

sudo npm install

sudo wget https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E amazon-cloudwatch-agent.deb
sudo touch /opt/aws/amazon-cloudwatch-agent/cloudwatch-config.json
sudo chmod 644 /opt/aws/amazon-cloudwatch-agent/cloudwatch-config.json

cd /opt/aws/amazon-cloudwatch-agent/
sudo sh -c 'echo "{
  "agent": {
      "metrics_collection_interval": 10,
      "logfile": "/var/logs/amazon-cloudwatch-agent.log"
  },
  "logs": {
      "logs_collected": {
          "files": {
              "collect_list": [
                  {
                      "file_path": "/var/log/csye6225_stdop.log",
                      "log_group_name": "csye6225",
                      "log_stream_name": "webapp"
                  },
                   {
                      "file_path": "/var/log/csye6225_error.log",
                      "log_group_name": "csye6225",
                      "log_stream_name": "webapp"
                  },
                   {
                      "file_path": "/var/log/auth.log",
                      "log_group_name": "ec2-security",
                      "log_stream_name": "audit-log"
                  }
              ]
          }
      },
      "log_stream_name": "cloudwatch_log_stream"
  },
  "metrics": {
    "metrics_collected": {
       "statsd": {
          "service_address": "8125",
          "metrics_collection_interval": 15,
          "metrics_aggregation_interval": 300
       }
    }
  }
}" > cloudwatch-config.json'

sudo chown -R csye6225:csye6225 /opt
sudo chmod +x /opt/csye6225/app.js

cd /opt/csye6225
sudo cp csye6225.service /etc/systemd/system
sudo systemctl daemon-reload

sudo systemctl enable amazon-cloudwatch-agent
sudo systemctl start amazon-cloudwatch-agent

sudo systemctl enable csye6225
sudo systemctl start csye6225
sudo systemctl restart csye6225
sudo systemctl stop csye6225