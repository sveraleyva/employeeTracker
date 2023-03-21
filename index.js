// packages needed for this application
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "root1234",
    database: "employeetracker_db",
  },
  console.log("connected to employeetracker_db")
);

function viewDepartments() {
  db.query("SELECT * FROM department", function (err, results) {
    console.table(results);
  });
}

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
    ],
  })
  .then((response) => {
    if (response.choice === "VIEW_DEPARTMENTS") {
      viewDepartments();
    }
  });
