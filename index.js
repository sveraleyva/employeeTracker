// packages needed for this application
require("dotenv").config();
const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql2");

// connect to the database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PW,
  database: "employeetracker_db",
});

// questions arrays
const roleQuestions = [
  {
    type: "input",
    message: "What is this role's title?",
    name: "roleTitle",
  },
  {
    type: "integer",
    message: "What is this role's salary?",
    name: "roleSalary",
  },
  {
    type: "integer",
    message: "What is the role's department ID?",
    name: "roleDepartmentID",
  },
];
const employeeQuestions = [
  {
    type: "input",
    message: "What is the new employee's first name?",
    name: "employeeFirstName",
  },
  {
    type: "input",
    message: "What is the new employee's last name?",
    name: "employeeLastName",
  },
  {
    type: "integer",
    message: "What is the new employee's role ID?",
    name: "employeeRoleID",
  },
  {
    type: "input",
    message: "What is the ID of the new employee's manager?",
    name: "managerID",
  },
];

// functions to view/edit the tables in the database
function viewTable(tableName) {
  // depending on the value, different tables are called from the database
  // calling init() after each console.table to get the main menu working
  if (tableName === "VIEW_DEPARTMENTS") {
    db.query("SELECT * FROM departments", function (err, results) {
      console.table(results);
      init();
    });
  } else if (tableName === "VIEW_EMPLOYEES") {
    db.query("SELECT * FROM employees", function (err, results) {
      console.table(results);
      init();
    });
  } else {
    db.query("SELECT * FROM roles", function (err, results) {
      console.table(results);
      init();
    });
  }
}

function addNew(type) {
  // for the addNew function, the parameter must be departments, roles or employees
  console.log("type", type);
  if (type === "departments") {
    inquirer
      .prompt({
        type: "input",
        message: "What is the new department's name? ",
        name: "newDepartment",
      })
      .then((response) => {
        db.query(
          `INSERT INTO departments (${response.newDepartment}) VALUES (departments)`,
          function (err, results) {
            console.table(results);
            console.log("new department added");
          }
        );
      });
  }
}

// function addRole() {
//   inquirer
//     .prompt({
//       type: "input",
//       message: "What is the new role?",
//       name: "newRole",
//     })
//     .then((response) => {
//       console.log(response.newRole);
//       db.query(
//         `INSERT INTO roles (${response.newRole}) VALUES (roles)`,
//         function (err, results) {
//           console.table(results);
//           console.log("role added");
//         }
//       );
//     });
// }

// starts the program
function init() {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: [
        { name: "View all departments", value: "VIEW_DEPARTMENTS" },
        { name: "View all employees", value: "VIEW_EMPLOYEES" },
        { name: "View all roles", value: "VIEW_ROLES" },
        { name: "Add an employee", value: "ADD_EMPLOYEE" },
        { name: "Add a role", value: "ADD_ROLE" },
        { name: "Add a department", value: "ADD_DEPARTMENT" },
        { name: "Exit", value: "EXIT" },
      ],
    })
    .then((response) => {
      if (
        response.choice === "VIEW_DEPARTMENTS" ||
        response.choice === "VIEW_ROLES" ||
        response.choice === "VIEW_EMPLOYEES"
      ) {
        viewTable(response.choice);
      } else if (response.choice === "ADD_DEPARTMENT") {
        addNew("departments");
      } else if (response.choice === "ADD_ROLE") {
        addNew("roles");
      } else if (response.choice === "ADD_EMPLOYEE") {
        addNew("employees");
      } else if (response.choice === "EXIT") {
        process.exit();
      }
    });
}

init();
