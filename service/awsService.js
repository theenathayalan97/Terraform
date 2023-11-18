let path = `/home/dys/project/terraform/terraform_project`
const { TerraformGenerator } = require('terraform-generator');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);


function fileLogin(file,config){
    try {
        // Write the Terraform configuration to a file
        fs.appendFileSync(`${path}/${file}`, config);

         // Define the relative path to the Terraform configuration directory
         const configPath = `${path}`;

         // Change the current working directory to the Terraform configuration directory
         process.chdir(configPath);

          // Run Terraform commands
        exec('terraform init', (error, initStdout, initStderr) => {
            if (error) {
                console.error('Terraform initialization failed:', initStderr);
            } else {
                exec('terraform apply -auto-approve', (applyError, applyStdout, applyStderr) => {
                    if (applyError) {
                        console.error('Terraform apply failed:', applyStderr);
                    } else {
                        console.log('Terraform apply succeeded.',applyStdout); 
                        return applyStdout ; 
                    }
                });
            }
        });

    } catch (error) {
        console.log('something went wrong : ', error);
    }
}

function fileCreate(file,config){
    try {
        // Write the Terraform configuration to a file
        fs.appendFileSync(`${path}/${file}`, config);

         // Define the relative path to the Terraform configuration directory
         const configPath = `${path}`;

         // Change the current working directory to the Terraform configuration directory
         process.chdir(configPath);

          // Run Terraform commands
        exec('terraform apply -auto-approve', (error, initStdout, initStderr) => {
            if (error) {
                console.error('Terraform initialization failed:', initStderr);
                // res.send("Terraform initialization failed");
            } else {
                exec('terraform apply -auto-approve', (applyError, applyStdout, applyStderr) => {
                    if (applyError) {
                        console.error('Terraform apply failed:', applyStderr);
                        // res.send("Terraform apply failed");
                    } else {
                        console.log('Terraform apply succeeded.',applyStdout);
                        return applyStdout ; 
                    }
                });
            }
        });

    } catch (error) {
        console.log('something went wrong : ', error);
    }
}


module.exports = { fileLogin, fileCreate }