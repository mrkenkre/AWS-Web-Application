packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "ami_prefix" {
  type    = string
  default = "my-packer-aws-debian"
}

locals {
  timestamp = regex_replace(timestamp(), "[- TZ:]", "")
}

source "amazon-ebs" "my-aws-debian" {
  ami_name      = "${var.ami_prefix}-${local.timestamp}"
  instance_type = "t2.micro"
  region        = "us-east-1"
  profile       = "devuser"
  subnet_id     = "subnet-0d9d8e0d99fe0610c"
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
  launch_block_device_mappings{
    device_name = "/dev/xvda"
    volume_size = 25
    volume_type = "gp2"
    encrypted= true
    delete_on_termination = true 
  }
}

build {
  name = "packer-debian"
  sources = [
    "source.amazon-ebs.my-aws-debian"
  ]

  provisioner "shell" {
    script="./setup.sh"
  }
}
