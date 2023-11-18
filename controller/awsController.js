
// const db = require('../connection/postgres');
const { TerraformGenerator } = require('terraform-generator');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const service = require('../service/awsService')

// const userSchema = db.User;
const tfg = new TerraformGenerator({
    required_version: '>= 0.12'
});

//AWS LOGIN
async function aws_login(req, res) {
    try {
        let file = 'main.tf'
        const tfConfig = `
        provider "aws" {
            access_key = "${req.body.access_key}"
            secret_key = "${req.body.secret_key}"
            region     = "${req.body.region}"
          }
        `;
        let result = await service.fileLogin(file, tfConfig)
        return res.status(200).json({ message: 'User login successfully', result: result });
    }
    catch (error) {
        return res.status(400).json({ message: "something went wrong", result: error });
    }
}

// TO CREATE VPC
async function aws_vpc(req, res) {
    try {
        let file = 'vpc.tf'
        const tfConfig = `
  resource "aws_vpc" "${req.body.vpc_name}" {
  cidr_block       = "${req.body.cidr_block}"
  instance_tenancy = "${req.body.instance_tenancy}"
  tags = {
    Name = "${req.body.tag_name}"
  }
}`;
        let result = await service.fileCreate(file, tfConfig)
        return res.status(200).json({ message: 'AWS VPC Create successfully', result: result });
    }
    catch (error) {
        return res.status(400).json({ message: "something went wrong", result: error });
    }
}

//TO CREATE PUBLIC SUBNET 
async function aws_pub_subnet(req, res) {
    try {
        let file = 'pub_subnet.tf'
        const tfConfig = `
      resource "aws_subnet" "${req.body.sn_name}" {
        vpc_id = "${req.body.vpc_id}"
        cidr_block       = "${req.body.cidr_block}"
        map_public_ip_on_launch = true
        availability_zone = "${req.body.availability_zone}"
        tags = {
          Name = "${req.body.tag_name}"
        }
      }`;

      let result = await service.fileCreate(file, tfConfig)
      return res.status(200).json({ message: 'AWS VPC Create successfully', result: result });
  }
  catch (error) {
      return res.status(400).json({ message: "something went wrong", result: error });
  }
}

//TO CREATE PRIVATE SUBNET 
async function aws_pvt_subnet(req, res) {
    try {
        let file = 'pri_subnet.tf'
        const tfConfig = `
      resource "aws_subnet" "${req.body.sn_name}" {
        vpc_id = "${req.body.vpc_id}"
        cidr_block       = "${req.body.cidr_block}"
        availability_zone = "${req.body.availability_zone}"
        tags = {
          Name = "${req.body.tag_name}"
        }
      }`;
      let result = await service.fileCreate(file, tfConfig)
      return res.status(200).json({ message: 'AWS VPC Create successfully', result: result });
  }
  catch (error) {
      return res.status(400).json({ message: "something went wrong", result: error });
  }
}

//TO CREATE INTERNET GATEWAY
async function internet_gateway(req, res) {
    try {
        let file = 'inter'
        const tfConfig = `
      resource "aws_internet_gateway" "${req.body.ig_name}" {
        vpc_id = "${req.body.vpc_id}"
        tags = {
          Name = "${req.body.tag_name}"
        }
      }`;

      let result = await service.fileCreate(file, tfConfig)
      return res.status(200).json({ message: 'AWS VPC Create successfully', result: result });
  }
  catch (error) {
      return res.status(400).json({ message: "something went wrong", result: error });
  }
}

//TO CREATE ROUTE TABLE FOR PUBLIC
async function route_table_pub(req, res) {
    try {
        let file = 'routeTablePub.tf'
        const tfConfig = `
        resource "aws_route_table" "${req.body.rt_name}" {
        vpc_id = "${req.body.vpc_id}"

        route {
          cidr_block = "${req.body.cidr_block}"
          gateway_id = "${req.body.gateway_id}"
        }
      
        tags = {
          Name = "${req.body.tag_name}"
            }
      }`;

      let result = await service.fileCreate(file, tfConfig)
      return res.status(200).json({ message: 'AWS VPC Create successfully', result: result });
  }
  catch (error) {
      return res.status(400).json({ message: "something went wrong", result: error });
  }
}


//TO CREATE ROUTE TABLE FOR PRIVATE
async function route_table_pvt(req, res) {
    try {
        let file = 'routeTablePvt.tf'
        const tfConfig = `
        resource "aws_route_table" "${req.body.rt_name}" {
        vpc_id = "${req.body.vpc_id}" 
        tags = {
          Name = "${req.body.tag_name}"
            }
      }`;
      let result = await service.fileCreate(file, tfConfig)
      return res.status(200).json({ message: 'AWS VPC Create successfully', result: result });
  }
  catch (error) {
      return res.status(400).json({ message: "something went wrong", result: error });
  }
}

//ASSOCIATE PUBLIC SUBNET WITH ROUTE TABLE
async function pub_subnet_association(req, res) {
    try {
        let file = 'pubSubnetAssociation.tf'
        const tfConfig = `
        resource "aws_route_table_association" "${req.body.sn_asso_name}" {
            subnet_id      = "${req.body.subnet_id}"
            route_table_id = "${req.body.route_table_id}"
      }`;
      let result = await service.fileCreate(file, tfConfig)
      return res.status(200).json({ message: 'AWS VPC Create successfully', result: result });
  }
  catch (error) {
      return res.status(400).json({ message: "something went wrong", result: error });
  }
}

//ASSOCIATE PRIVATE SUBNET WITH ROUTE TABLE
async function pvt_subnet_association(req, res) {
    try {
        let file = 'pvtSubnetAssociation.tf'
        const tfConfig = `
        resource "aws_route_table_association" "${req.body.sn_asso_name}" {
            subnet_id      = "${req.body.subnet_id}"
            route_table_id = "${req.body.route_table_id}"
      }`;
      let result = await service.fileCreate(file, tfConfig)
      return res.status(200).json({ message: 'AWS VPC Create successfully', result: result });
  }
  catch (error) {
      return res.status(400).json({ message: "something went wrong", result: error });
  }
}


//PUBLIC SECURITY GROUP
async function pub_security_group(req, res) {
    try {
        let file = 'pubSecurityGroup.tf'
        const ingressRules = req.body.ingress.map((rule, index) => `
            ingress {
                from_port       = ${rule.from_port}
                to_port         = ${rule.to_port}
                protocol        = "${rule.protocol}"
                cidr_blocks     = ${JSON.stringify(rule.cidr_blocks)}
                ipv6_cidr_blocks = ${JSON.stringify(rule.ipv6_cidr_blocks)}
            }
        `).join('\n');

        const tfConfig = `
            resource "aws_security_group" "${req.body.sg_name}" {
                name        = "${req.body.name}"
                description = "${req.body.description}"
                vpc_id      = "${req.body.vpc_id}"

                ${ingressRules}

                # Egress Rule Allowing All Outbound Traffic
                egress {
                    from_port   = ${req.body.egress_from_port}
                    to_port     = ${req.body.egress_to_port}
                    protocol    = "${req.body.egress_protocol}"
                    cidr_blocks = ${JSON.stringify(req.body.egress_cidr_blocks)}
                    ipv6_cidr_blocks = ${JSON.stringify(req.body.egress_ipv6_cidr_blocks)}
                }

                tags = {
                    Name = "${req.body.tag_name}"
                }
            }
        `;

        let result = await service.fileCreate(file, tfConfig)
        return res.status(200).json({ message: 'AWS VPC Create successfully', result: result });
    }
    catch (error) {
        return res.status(400).json({ message: "something went wrong", result: error });
    }
}

//PRIVATE SECURITY GROUP
async function pvt_security_group(req, res) {
    try {
        let file = 'pvtSecurityGroup.tf'
        const ingressRules = req.body.ingress.map((rule, index) => `
            ingress {
                from_port       = ${rule.from_port}
                to_port         = ${rule.to_port}
                protocol        = "${rule.protocol}"
                cidr_blocks     = ${JSON.stringify(rule.cidr_blocks)}
                ipv6_cidr_blocks = ${JSON.stringify(rule.ipv6_cidr_blocks)}
            }
        `).join('\n');

        const tfConfig = `
            resource "aws_security_group" "${req.body.sg_name}" {
                name        = "${req.body.name}"
                description = "${req.body.description}"
                vpc_id      = "${req.body.vpc_id}"

                ${ingressRules}

                # Egress Rule Allowing All Outbound Traffic
                egress {
                    from_port   = ${req.body.egress_from_port}
                    to_port     = ${req.body.egress_to_port}
                    protocol    = "${req.body.egress_protocol}"
                    cidr_blocks = ${JSON.stringify(req.body.egress_cidr_blocks)}
                    ipv6_cidr_blocks = ${JSON.stringify(req.body.egress_ipv6_cidr_blocks)}
                }

                tags = {
                    Name = "${req.body.tag_name}"
                }
            }
        `;

        let result = await service.fileCreate(file, tfConfig)
        return res.status(200).json({ message: 'AWS VPC Create successfully', result: result });
    }
    catch (error) {
        return res.status(400).json({ message: "something went wrong", result: error });
    }
}

//EC2 INSTANCE
async function ec2_instance(req, res) {
    try {
        let file = 'EC2Instance.tf'
        const tfConfig = `
        data "aws_ami" "${req.body.os_name}" {
            most_recent = true
          
            filter {
              name   = "name"
              values = ["${req.body.os_value}"]
            }
            
            filter {
              name   = "virtualization-type"
              values = ["hvm"]
            }
            # You do not need to specify the owners if the AMI is publicly available
          }
          resource "aws_instance" "my_ec2"{
              ami = data.aws_ami.${req.body.os_name}.id
              # ami = "ami-0550c2ee59485be53"
              instance_type = "${req.body.instance_type}"
              associate_public_ip_address = true
              subnet_id = "${req.body.subnet_id}"
              vpc_security_group_ids = ["${req.body.vpc_security_group_ids}"]
              tags = {
              Name = "${req.body.tag_name}"
            }
      }`;
      let result = await service.fileCreate(file, tfConfig)
      return res.status(200).json({ message: 'AWS VPC Create successfully', result: result });
  }
  catch (error) {
      return res.status(400).json({ message: "something went wrong", result: error });
  }
}

async function s3_bucket(req, res) {
    try {
        let file = 's3Bucket.tf'
        const tfConfig = `
          resource "aws_s3_bucket" "${req.body.name}" {
            bucket = "${req.body.bucket_name}"
            # Prevent accidental deletion of this S3 bucket
            lifecycle {
              prevent_destroy = true
            }
          }`;
          let result = await service.fileCreate(file, tfConfig)
          return res.status(200).json({ message: 'AWS VPC Create successfully', result: result });
      }
      catch (error) {
          return res.status(400).json({ message: "something went wrong", result: error });
      }
}

//STORE STATE FILE INTO S3 BUCKET
async function state_file(req, res) {
    try {
        let file = 'statefile.tf'
        const tfConfig = `
            resource "aws_s3_object" "file" {
            bucket = "${req.body.bucket_name}"
            key    = "terraform.tfstate"
            source = "/home/dys/project/terraform/terraform_project/terraform.tfstate"
          }`;
          let result = await service.fileCreate(file, tfConfig)
          return res.status(200).json({ message: 'AWS VPC Create successfully', result: result });
      }
      catch (error) {
          return res.status(400).json({ message: "something went wrong", result: error });
      }
}


async function list_Vpcs(req, res) {
    try {
        let file = 'vpcIDList.tf'
        const tfConfig = `data "aws_vpcs" "foo" {
          }
          
          output "foo" {
            value = data.aws_vpcs.foo.ids
          }`;
          let result = await service.fileCreate(file, tfConfig)
          return res.status(200).json({ message: 'AWS VPC Create successfully', result: result });
      }
      catch (error) {
          return res.status(400).json({ message: "something went wrong", result: error });
      }
};

async function list_subnet(req, res) {
    try {
        let file = 'subnetIDList.tf'
        const tfConfig = `data "aws_subnet" "foo" {
          }
          
          output "foo" {
            value = data.aws_subnet.foo.id
          }`;
          let result = await service.fileCreate(file, tfConfig)
          return res.status(200).json({ message: 'AWS VPC Create successfully', result: result });
      }
      catch (error) {
          return res.status(400).json({ message: "something went wrong", result: error });
      }
};



module.exports = {
    aws_login,
    aws_vpc,
    aws_pub_subnet,
    aws_pvt_subnet,
    internet_gateway,
    pub_subnet_association,
    pvt_subnet_association,
    route_table_pub,
    route_table_pvt,
    pub_security_group,
    pvt_security_group,
    ec2_instance,
    s3_bucket,
    state_file,
    list_Vpcs,
    list_subnet
};
