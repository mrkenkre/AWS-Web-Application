packer {
  required_plugins {
    amazon = {
      version = " >= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "ami_prefix" {
  type    = string
  default = "my-packer-aws-debian"
}

variable "db_name" {
  type    = string
  default = ""
}

variable "db_user" {
  type    = string
  default = ""
}

variable "db_pass" {
  type    = string
  default = ""
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}
variable "aws_profile" {
  type    = string
  default = "devuser"
}
variable "subnet_Id" {
  type    = string
  default = "subnet-0d9d8e0d99fe0610c"
}

locals {
  timestamp = regex_replace(timestamp(), "[- TZ:]", "")
}

source "amazon-ebs" "my-aws-debian" {
  ami_name      = "${var.ami_prefix}-${local.timestamp}"
  instance_type = "${var.instance_type}"
  region        = "${var.aws_region}"
  profile       = "${var.aws_profile}"
  ami_users     = ["781104868468", "407671753120"]
  subnet_id="${var.subnet_Id}"
  ami_regions = [
    "us-east-1",
  ]
  source_ami_filter {
    filters = {
      name                = "debian-12-amd64*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["amazon"]
  }
  ssh_username = "admin"
  launch_block_device_mappings {
    device_name           = "/dev/xvda"
    volume_size           = 25
    volume_type           = "gp2"
    delete_on_termination = true
  }
}

build {
  name = "packer-debian"
  sources = [
    "source.amazon-ebs.my-aws-debian"
  ]

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "file" {
    source      = ".env"
    destination = "/tmp/.env"
  }

  provisioner "shell" {

    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1",
      "DB_USER=${var.db_user}",
      "DB_NAME=${var.db_name}",
      "DB_PASS=${var.db_pass}"
    ]
    script = "./scripts/setup.sh"
  }
}

