const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employees = [];

function addNewEmployee() {
   
    inquirer.prompt([
        {
          type: "input",
          message: "Enter employee name: ",
          name: "name"
        },

        {
          type: "list",
          message: "Select employee role: ",
          choices: [
                "Manager",
                "Engineer",
                "Intern"
          ],
          name: "role"
        },

        {
          type: "input",
          message: "Enter employee ID: ",
          name: "id"
        },

        {
          type: "input",
          message: "Enter employee email address: ",
          name: "email"
        }
    ])
    
    .then(function ({ name, role, id, email }) {
 
          let extraInfo;
 
          if (role === "Manager") {
             extraInfo = "officeNumber";
          } else if (role === "Engineer") {
             extraInfo = "github";
          } else {
             extraInfo = "school";
          }
 
          inquirer.prompt([
             {
                type: "input",
                message: `Enter employee ${extraInfo}: `,
                name: "extraInfo"
             },
             {
                type: "checkbox",
                message: "Would you like to add more employees?",
                choices: [
                      "yes",
                      "no"
                ],
                name: "addMoreEmployees"
             }
          ])
          
          .then(function ({ extraInfo, addMoreEmployees }) {
                let newEmployee;
 
                if (role === "Manager") {
                    newEmployee = new Manager(name, id, email, extraInfo);
                } else if (role === "Engineer") {
                    newEmployee = new Engineer(name, id, email, extraInfo);
                } else {
                    newEmployee = new Intern(name, id, email, extraInfo);
                }
                
                employees.push(newEmployee);
                
                if (addMoreEmployees === "yes") {
                   addNewEmployee();
                } 
                else {
                    fs.writeFile(outputPath, render(employees), function (err) {
                        if (err) {
                             console.log(`Error - ${err}`);
                        } else {
                           console.log(`Employee sucessfully added -  ${outputPath}`);
                        }      
                     });
                }
          });
    });
}addNewEmployee();