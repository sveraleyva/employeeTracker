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
    db.query(
      "SELECT * FROM employees JOIN roles ON roles.id = employees.role_id",
      function (err, results) {
        console.table(results);
        init();
      }
    );
  } else {
    db.query("SELECT * FROM roles", function (err, results) {
      console.table(results);
      init();
    });
  }
}

// functions to add roles, departments and employees
function addRole() {
  db.query("SELECT * FROM departments", function (err, results) {
    const departmentList = results.map((department) => ({
      name: department.name,
      value: department.id,
    }));
    inquirer
      .prompt([
        {
          message: "What is this role's title?",
          name: "title",
        },
        {
          message: "What is this role's salary?",
          name: "salary",
        },
        {
          type: "list",
          message: "What is the role's department ID?",
          name: "department_id",
          choices: departmentList,
        },
      ])
      .then((response) => {
        db.query("INSERT INTO roles SET ?", response);
        console.log("You've added a new role!");
        init();
      });
  });
}

function addDepartment() {
  inquirer
    .prompt({
      message: "What is the new department's name? ",
      name: "name",
    })
    .then((response) => {
      db.query("INSERT INTO departments SET ?", response);
      console.log("You've added a new department!");
      init();
    });
}

function addEmployee() {
  // defining these before the query is needed so they are global and can be used in the inquirer prompt
  let managers = [];
  let roles = [];
  db.query("SELECT * FROM employees", function (err, results) {
    managers = results.map((manager) => ({
      name: manager.first_name + " " + manager.last_name,
      value: manager.id,
    }));
    managers.unshift({ name: "None", value: null });
    console.log("managers", managers);
    db.query("SELECT * FROM roles", function (err, results) {
      roles = results.map((role) => ({
        name: role.title,
        value: role.id,
      }));
      console.log("roles", roles);
      inquirer
        .prompt([
          {
            message: "What is the new employee's first name?",
            name: "first_name",
          },
          {
            message: "What is the new employee's last name?",
            name: "last_name",
          },
          {
            type: "list",
            message: "Who is the new employee's manager?",
            name: "manager_id",
            choices: managers,
          },
          {
            type: "list",
            message: "What is the new employee's role?",
            name: "role_id",
            choices: roles,
          },
        ])
        .then((response) => {
          db.query("INSERT INTO employees SET ?", response);
          console.log("You've added a new employee!");
          init();
        });
    });
  });
}

// function to update an employee's role
function updateRole() {
  let employees = [];
  let roles = [];
  db.query("SELECT * FROM employees", function (err, results) {
    employees = results.map((employee) => ({
      name: employee.first_name + " " + employee.last_name,
      value: employee.id,
    }));
    db.query("SELECT * FROM roles", function (err, results) {
      roles = results.map((role) => ({
        name: role.title,
        value: role.id,
      }));
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee's role do you want to update?",
            name: "employee_id",
            choices: employees,
          },
          {
            type: "list",
            message: "Which role do you want to assign them?",
            name: "role_id",
            choices: roles,
          },
        ])
        .then((response) => {
          db.query(
            "UPDATE employees SET ? WHERE id = ?",
            response,
            function (err, results) {
              console.log("Employee updated successfully!");
              init();
            }
          );
        });
    });
  });
}

// starts the program
function init() {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: [
        { name: "View all departments", value: "VIEW_DEPARTMENTS" },
        { name: "Add a department", value: "ADD_DEPARTMENT" },
        { name: "View all employees", value: "VIEW_EMPLOYEES" },
        { name: "Add an employee", value: "ADD_EMPLOYEE" },
        { name: "Update an employee's role", value: "UPDATE_ROLE" },
        { name: "View all roles", value: "VIEW_ROLES" },
        { name: "Add a role", value: "ADD_ROLE" },
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
        addDepartment();
      } else if (response.choice === "ADD_ROLE") {
        addRole();
      } else if (response.choice === "ADD_EMPLOYEE") {
        addEmployee();
      } else if (response.choice === "EXIT") {
        process.exit();
      } else {
        // response.choice === "UPDATE_ROLE"
        updateRole();
      }
    });
}

init();
