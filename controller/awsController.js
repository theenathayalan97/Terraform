
const db = require('../connection/postgres');
const { TerraformGenerator } = require('terraform-generator');
const fs = require('fs');
const { exec } = require('child_process');

const userSchema = db.User;
const tfg = new TerraformGenerator({
    required_version: '>= 0.12'
});

//AWS LOGIN
async function aws_login(req, res) {
    try {
        const tfConfig = `
        provider "aws" {
            access_key = "${req.body.access_key}"
            secret_key = "${req.body.secret_key}"
            region     = "${req.body.region}"
          }
        `;
        // Write the Terraform configuration to a file
        fs.appendFileSync('/home/jeya/Music/terraform/main.tf', tfConfig);

        // Define the relative path to the Terraform configuration directory
        const configPath = '/home/jeya/Music/terraform';

        // Change the current working directory to the Terraform configuration directory
        process.chdir(configPath);

        // Run Terraform commands
        exec('terraform init', (error, initStdout, initStderr) => {
            if (error) {
                console.error('Terraform initialization failed:', initStderr);
                res.send("Terraform initialization failed");
            } else {
                console.log('Terraform initialization succeeded.');
                exec('terraform apply -auto-approve', (applyError, applyStdout, applyStderr) => {
                    if (applyError) {
                        console.error('Terraform apply failed:', applyStderr);
                        res.send("Terraform apply failed");
                    } else {
                        console.log('Terraform apply succeeded.');
                        console.log(applyStdout);
                        res.send("Terraform apply succeeded");
                    }
                });
            }
        });

    }
    catch (error) {
        console.log("error is : ", error)
        res.send("An error occurred (PUBLIC SUBNET ASSOCIATION WITH ROUTE TABLE)");
    }
}

// TO CREATE VPC
async function aws_vpc(req, res) {
    try {
        const tfConfig = `
  resource "aws_vpc" "${req.body.vpc_name}" {
  cidr_block       = "${req.body.cidr_block}"
  instance_tenancy = "${req.body.instance_tenancy}"
  tags = {
    Name = "${req.body.tag_name}"
  }
}`;
        // Write the Terraform configuration to a file
        fs.appendFileSync('/home/jeya/Music/terraform/vpc.tf', tfConfig);

        // Define the relative path to the Terraform configuration directory
        const configPath = '/home/jeya/Music/terraform';

        // Change the current working directory to the Terraform configuration directory
        process.chdir(configPath);

        // Run Terraform commands
        exec('terraform apply -auto-approve', (applyError, applyStdout, applyStderr) => {
            if (applyError) {
                console.error('Terraform apply failed:', applyStderr);
                res.send("Terraform apply failed");
            } else {
                console.log('Terraform apply succeeded.');
                console.log(applyStdout);
                res.send("Terraform apply succeeded");
            }
        });
    } catch (error) {
        console.log("error is:", error);
        res.send("An error occurred(VPC)");
    }
}

//TO CREATE PUBLIC SUBNET 
async function aws_pub_subnet(req, res) {
    try {
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

        // Write the Terraform configuration to a file
        fs.appendFileSync('/home/jeya/Music/terraform/pub_subnet.tf', tfConfig);

        // Define the relative path to the Terraform configuration directory
        const configPath = '/home/jeya/Music/terraform';

        // Change the current working directory to the Terraform configuration directory
        process.chdir(configPath);

        // Run Terraform commands

        exec('terraform apply -auto-approve', (applyError, applyStdout, applyStderr) => {
            if (applyError) {
                console.error('Terraform apply failed:', applyStderr);
                res.send("Terraform apply failed");
            } else {
                console.log('Terraform apply succeeded.');
                console.log(applyStdout);
                res.send("Terraform apply succeeded");
            }
        });
    } catch (error) {
        console.log("error is:", error);
        res.send("An error occurred (PUBLIC SUBNET)");
    }
}

//TO CREATE PRIVATE SUBNET 
async function aws_pvt_subnet(req, res) {
    try {
        const tfConfig = `
      resource "aws_subnet" "${req.body.sn_name}" {
        vpc_id = "${req.body.vpc_id}"
        cidr_block       = "${req.body.cidr_block}"
        availability_zone = "${req.body.availability_zone}"
        tags = {
          Name = "${req.body.tag_name}"
        }
      }`;
        // map_public_ip_on_launch = true (optional for pvt)
        // Write the Terraform configuration to a file
        fs.appendFileSync('/home/jeya/Music/terraform/pvt_subnet.tf', tfConfig);

        // Define the relative path to the Terraform configuration directory
        const configPath = '/home/jeya/Music/terraform';

        // Change the current working directory to the Terraform configuration directory
        process.chdir(configPath);

        // Run Terraform commands

        exec('terraform apply -auto-approve', (applyError, applyStdout, applyStderr) => {
            if (applyError) {
                console.error('Terraform apply failed:', applyStderr);
                res.send("Terraform apply failed");
            } else {
                console.log('Terraform apply succeeded.');
                console.log(applyStdout);
                res.send("Terraform apply succeeded");
            }
        });

    } catch (error) {
        console.log("error is:", error);
        res.send("An error occurred (PRIVATE SUBNET)");
    }
}

//TO CREATE INTERNET GATEWAY
async function internet_gateway(req, res) {
    try {
        const tfConfig = `
      resource "aws_internet_gateway" "${req.body.ig_name}" {
        vpc_id = "${req.body.vpc_id}"
        tags = {
          Name = "${req.body.tag_name}"
        }
      }`;

        // Write the Terraform configuration to a file
        fs.appendFileSync('/home/jeya/Music/terraform/ig.tf', tfConfig);

        // Define the relative path to the Terraform configuration directory
        const configPath = '/home/jeya/Music/terraform';

        // Change the current working directory to the Terraform configuration directory
        process.chdir(configPath);

        // Run Terraform commands

        exec('terraform apply -auto-approve', (applyError, applyStdout, applyStderr) => {
            if (applyError) {
                console.error('Terraform apply failed:', applyStderr);
                res.send("Terraform apply failed");
            } else {
                console.log('Terraform apply succeeded.');
                console.log(applyStdout);
                res.send("Terraform apply succeeded");
            }
        });
    }
    catch (error) {
        res.send("An error occurred (INTERNET GATEWAY)");
    }
}

//TO CREATE ROUTE TABLE FOR PUBLIC
async function route_table_pub(req, res) {
    try {
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

        // Write the Terraform configuration to a file
        fs.appendFileSync('/home/jeya/Music/terraform/pub_route_table.tf', tfConfig);

        // Define the relative path to the Terraform configuration directory
        const configPath = '/home/jeya/Music/terraform';

        // Change the current working directory to the Terraform configuration directory
        process.chdir(configPath);

        // Run Terraform commands
        exec('terraform apply -auto-approve', (applyError, applyStdout, applyStderr) => {
            if (applyError) {
                console.error('Terraform apply failed:', applyStderr);
                res.send("Terraform apply failed");
            } else {
                console.log('Terraform apply succeeded.');
                console.log(applyStdout);
                res.send("Terraform apply succeeded");
            }
        });

    }
    catch (error) {
        console.log("error is : ", error)
        res.send("An error occurred (ROUTE TABLE PUBLIC)");
    }
}


//TO CREATE ROUTE TABLE FOR PRIVATE
async function route_table_pvt(req, res) {
    try {
        const tfConfig = `
        resource "aws_route_table" "${req.body.rt_name}" {
        vpc_id = "${req.body.vpc_id}" 
        tags = {
          Name = "${req.body.tag_name}"
            }
      }`;
        // Write the Terraform configuration to a file
        fs.appendFileSync('/home/jeya/Music/terraform/pvt_route_table.tf', tfConfig);

        // Define the relative path to the Terraform configuration directory
        const configPath = '/home/jeya/Music/terraform';

        // Change the current working directory to the Terraform configuration directory
        process.chdir(configPath);

        // Run Terraform commands
        exec('terraform apply -auto-approve', (applyError, applyStdout, applyStderr) => {
            if (applyError) {
                console.error('Terraform apply failed:', applyStderr);
                res.send("Terraform apply failed");
            } else {
                console.log('Terraform apply succeeded.');
                console.log(applyStdout);
                res.send("Terraform apply succeeded");
            }
        });

    }
    catch (error) {
        console.log("error is : ", error)
        res.send("An error occurred (ROUTE TABLE PRIVATE)");
    }
}

//ASSOCIATE PUBLIC SUBNET WITH ROUTE TABLE
async function pub_subnet_association(req, res) {
    try {
        const tfConfig = `
        resource "aws_route_table_association" "${req.body.sn_asso_name}" {
            subnet_id      = "${req.body.subnet_id}"
            route_table_id = "${req.body.route_table_id}"
      }`;
        // Write the Terraform configuration to a file
        fs.appendFileSync('/home/jeya/Music/terraform/pub_subnet_association.tf', tfConfig);

        // Define the relative path to the Terraform configuration directory
        const configPath = '/home/jeya/Music/terraform';

        // Change the current working directory to the Terraform configuration directory
        process.chdir(configPath);

        // Run Terraform commands
        exec('terraform apply -auto-approve', (applyError, applyStdout, applyStderr) => {
            if (applyError) {
                console.error('Terraform apply failed:', applyStderr);
                res.send("Terraform apply failed");
            } else {
                console.log('Terraform apply succeeded.');
                console.log(applyStdout);
                res.send("Terraform apply succeeded");
            }
        });
    }
    catch (error) {
        console.log("error is : ", error)
        res.send("An error occurred (PUBLIC SUBNET ASSOCIATION WITH ROUTE TABLE)");
    }
}

//ASSOCIATE PRIVATE SUBNET WITH ROUTE TABLE
async function pvt_subnet_association(req, res) {
    try {
        const tfConfig = `
        resource "aws_route_table_association" "${req.body.sn_asso_name}" {
            subnet_id      = "${req.body.subnet_id}"
            route_table_id = "${req.body.route_table_id}"
      }`;
        // Write the Terraform configuration to a file
        fs.appendFileSync('/home/jeya/Music/terraform/pvt_subnet_association.tf', tfConfig);

        // Define the relative path to the Terraform configuration directory
        const configPath = '/home/jeya/Music/terraform';

        // Change the current working directory to the Terraform configuration directory
        process.chdir(configPath);

        // Run Terraform commands
        exec('terraform apply -auto-approve', (applyError, applyStdout, applyStderr) => {
            if (applyError) {
                console.error('Terraform apply failed:', applyStderr);
                res.send("Terraform apply failed");
            } else {
                console.log('Terraform apply succeeded.');
                console.log(applyStdout);
                res.send("Terraform apply succeeded");
            }
        });
    }
    catch (error) {
        console.log("error is : ", error)
        res.send("An error occurred (PRIVATE SUBNET ASSOCIATION WITH ROUTE TABLE)");
    }
}


//PUBLIC SECURITY GROUP
async function pub_security_group(req, res) {
    try {
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

        // The rest of your code remains unchanged
        // Write the Terraform configuration to a file
        fs.appendFileSync('/home/jeya/Music/terraform/pub_security_group.tf', tfConfig);

        // Define the relative path to the Terraform configuration directory
        const configPath = '/home/jeya/Music/terraform';

        // Change the current working directory to the Terraform configuration directory
        process.chdir(configPath);

        // Run Terraform commands
        exec('terraform apply -auto-approve', (applyError, applyStdout, applyStderr) => {
            if (applyError) {
                console.error('Terraform apply failed:', applyStderr);
                res.send("Terraform apply failed");
            } else {
                console.log('Terraform apply succeeded.');
                console.log(applyStdout);
                res.send("Terraform apply succeeded");
            }
        });

    } catch (error) {
        console.log("error is : ", error);
        res.send("An error occurred (PUBLIC SECURITY GROUP)");
    }
}

//PRIVATE SECURITY GROUP
async function pvt_security_group(req, res) {
    try {
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

        // The rest of your code remains unchanged
        // Write the Terraform configuration to a file
        fs.appendFileSync('/home/jeya/Music/terraform/pvt_security_group.tf', tfConfig);

        // Define the relative path to the Terraform configuration directory
        const configPath = '/home/jeya/Music/terraform';

        // Change the current working directory to the Terraform configuration directory
        process.chdir(configPath);

        // Run Terraform commands
        exec('terraform apply -auto-approve', (applyError, applyStdout, applyStderr) => {
            if (applyError) {
                console.error('Terraform apply failed:', applyStderr);
                res.send("Terraform apply failed");
            } else {
                console.log('Terraform apply succeeded.');
                console.log(applyStdout);
                res.send("Terraform apply succeeded");
            }
        });

    } catch (error) {
        console.log("error is : ", error);
        res.send("An error occurred (PRIVATE SECURITY GROUP)");
    }
}

//EC2 INSTANCE
async function ec2_instance(req, res) {
    try {
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
        // Write the Terraform configuration to a file
        fs.appendFileSync('/home/jeya/Music/terraform/ec2_instance.tf', tfConfig);

        // Define the relative path to the Terraform configuration directory
        const configPath = '/home/jeya/Music/terraform';

        // Change the current working directory to the Terraform configuration directory
        process.chdir(configPath);

        // Run Terraform commands
        exec('terraform apply -auto-approve', (applyError, applyStdout, applyStderr) => {
            if (applyError) {
                console.error('Terraform apply failed:', applyStderr);
                res.send("Terraform apply failed");
            } else {
                console.log('Terraform apply succeeded.');
                console.log(applyStdout);
                res.send("Terraform apply succeeded");
            }
        });
    }
    catch (error) {
        console.log("error is : ", error)
        res.send("An error occurred (EC2 INSTANCE)");
    }
}

async function s3_bucket(req, res) {
    try {
        const tfConfig = `
          resource "aws_s3_bucket" "${req.body.name}" {
            bucket = "${req.body.bucket_name}"
            # Prevent accidental deletion of this S3 bucket
            lifecycle {
              prevent_destroy = true
            }
          }`;
        // Write the Terraform configuration to a file
        fs.appendFileSync('/home/jeya/Music/terraform/s3_bucket.tf', tfConfig);

        // Define the relative path to the Terraform configuration directory
        const configPath = '/home/jeya/Music/terraform';

        // Change the current working directory to the Terraform configuration directory
        process.chdir(configPath);
        exec('terraform apply -auto-approve', (applyError, applyStdout, applyStderr) => {
            if (applyError) {
                console.error('Terraform apply failed:', applyStderr);
                res.send("Terraform apply failed");
            } else {
                console.log('Terraform apply succeeded.');
                console.log(applyStdout);
                res.send("Terraform apply succeeded");
            }
        });
    }
    catch (error) {
        console.log("error is : ", error)
        res.send("An error occurred (S3 BUCKET)");
    }
}

//STORE STATE FILE INTO S3 BUCKET
async function state_file(req, res) {
    try {
        const tfConfig = `
            resource "aws_s3_object" "file" {
            bucket = "${req.body.bucket_name}"
            key    = "terraform.tfstate"
            source = "/home/jeya/Music/terraform/terraform.tfstate"
          }`;
        // Write the Terraform configuration to a file
        fs.appendFileSync('/home/jeya/Music/terraform/state_file.tf', tfConfig);

        // Define the relative path to the Terraform configuration directory
        const configPath = '/home/jeya/Music/terraform';

        // Change the current working directory to the Terraform configuration directory
        process.chdir(configPath);

        // Run Terraform commands
        // exec('terraform init', (error, initStdout, initStderr) => {
        //     if (error) {
        //         console.error('Terraform initialization failed:', initStderr);
        //         res.send("Terraform initialization failed");
        //     } else {
        //         console.log('Terraform initialization succeeded.');
                exec('terraform apply -auto-approve', (applyError, applyStdout, applyStderr) => {
                    if (applyError) {
                        console.error('Terraform apply failed:', applyStderr);
                        res.send("Terraform apply failed");
                    } else {
                        console.log('Terraform apply succeeded.');
                        console.log(applyStdout);
                        res.send("Terraform apply succeeded");
                    }
                });
            }
    //     });
    // }
    catch (error) {
        console.log("error is : ", error)
        res.send("An error occurred (STATE FILE)");
    }
}

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
    state_file
};
