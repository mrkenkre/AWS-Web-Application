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
variable "device_name" {
  type    = string
  default = "/dev/xvda"
}
variable "volume_size" {
  type    = number
  default = 25
}
variable "volume_type" {
  type    = string
  default = "gp2"
}
variable "ami_users" {
  type    = list(string)
  default = ["781104868468", "407671753120"]
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "ami_filter_name" {
  type    = string
  default = "debian-12-amd64*"
}

variable "ami_filter_root_device_type" {
  type    = string
  default = "ebs"
}

variable "ami_filter_virtualization_type" {
  type    = string
  default = "hvm"
}

variable "ami_filter_owners" {
  type    = list(string)
  default = ["amazon"]
}

locals {
  timestamp = regex_replace(timestamp(), "[- TZ:]", "")
}


source "amazon-ebs" "my-aws-debian" {
  ami_name      = "${var.ami_prefix}-${local.timestamp}"
  instance_type = "${var.instance_type}"
  region        = "${var.aws_region}"
  profile       = "${var.aws_profile}"
  ami_users     = var.ami_users
  subnet_id     = "${var.subnet_Id}"
  ami_regions = [
    "${var.aws_region}"
  ]
  source_ami_filter {
    filters = {
      name                = "${var.ami_filter_name}"
      root-device-type    = "${var.ami_filter_root_device_type}"
      virtualization-type = "${var.ami_filter_virtualization_type}"
    }
    most_recent = true
    owners      = var.ami_filter_owners
  }
  ssh_username = "${var.ssh_username}"
  launch_block_device_mappings {
    device_name           = "${var.device_name}"
    volume_size           = "${var.volume_size}"
    volume_type           = "${var.volume_type}"
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

