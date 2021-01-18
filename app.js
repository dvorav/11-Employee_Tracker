let inquirer = require("inquirer");

let mysql = require("mysql");

//Connection to SQL
let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Dillon123",
  database: "employee_trackerDB",
});

connection.connect(function (err) {
  if (err) throw err;
});

//Inquierer Options
const viewOptions = [
  "View all departments",
  "View all roles",
  "View all employee",
  "Add an employee",
  "Add a deparment",
  "Add a role",
  "Remove an employee",
  "Exit",
];

//Starts Script
runSearch();


//Function that will give you options
function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: viewOptions,
    })
    .then(function (answer) {
      switch (answer.action) {
        case viewOptions[0]:
          departmentView();
          break;

        case viewOptions[1]:
          roleView();
          break;

        case viewOptions[2]:
          employeeView();
          break;

        case viewOptions[3]:
          addEmployee();
          break;

        case viewOptions[4]:
          addDepartment();
          break;
        case viewOptions[5]:
          addRole();
          break;
        case viewOptions[6]:
          removeEmployee();
          break;
        case viewOptions[7]:
          console.clear();
          console.log("Script Terminated!");
          exit();
          break;
         
      }
    });
}

//View Department List Option
function departmentView() {
  console.log("---------------------")
  console.log("Department List");
  let sqlStr = "SELECT name FROM department";
  connection.query(sqlStr, function (err, result) {
    if (err) throw err;

    console.table(result);
    runSearch();
  });
}

//View Employee List Option
function employeeView() {
  console.log("---------------------")
  console.log("Employee List");
  let sqlStr = "SELECT first_name, last_name, title, salary FROM employee ";
  sqlStr += "LEFT JOIN role ";
  sqlStr += "ON employee.role_id = role.id";
  connection.query(sqlStr, function (err, result) {
    if (err) throw err;

    console.table(result);
    runSearch();
  });
}


//View Role List Options
function roleView() {
  console.log("---------------------")
  console.log("Role List");
  let sqlStr = "SELECT * FROM role";
  connection.query(sqlStr, function (err, result) {
    if (err) throw err;

    console.table(result);
    runSearch();
  });
}
//Function that will end scipt
function exit() {
  return process.exit(1);
}

//Function that will add an employee
function addEmployee() {
  console.log("---------------------")
  console.log("Add Employee");
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter employee first name",
        name: "firstname",
      },
      {
        type: "input",
        message: "Enter employee last name",
        name: "lastname",
      },
      {
        type: "list",
        message: "Select department",
        name: "department",
        choices: [1, 2, 3, 4, 5],
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.firstname,
          last_name: answer.lastname,
          role_id: answer.department,
          manager_id: null,
        },
        function (err) {
          if (err) {
            throw err;
          }
          console.clear();
          console.log("-----------------------");
          console.table("Added to Employee List!");
          console.log("-----------------------");

          runSearch();
        }
      );
    });
}
//Function that will add department
function addDepartment() {
  console.log("---------------------")
  console.log("Add Department");
  inquirer
    .prompt([
      {
        type: "input",
        message: "Add department",
        name: "department",
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.department,
        },
        function (err) {
          if (err) {
            throw err;
          }
          console.log("-----------------------");
          console.log("Added to department list!");
          console.log("-----------------------");

          runSearch();
        }
      );
    });
}

//Function that will add role
function addRole() {
  console.log("---------------------")
  console.log("Add Role");
  inquirer
    .prompt([
      {
        type: "input",
        message: "Add role",
        name: "role",
      },
      {
        type: "input",
        message: "Add salary",
        name: "salary",
      },
      {
        type: "input",
        message: "Department Id",
        name: "dept",
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.role,
          salary: answer.salary,
          department_id: answer.dept,
        },
        function (err) {
          if (err) {
            throw err;
          }
          console.clear();
          console.log("-----------------------");
          console.table("Added to Role List!");
          console.log("-----------------------");

          runSearch();
        }
      );
    });
}

//Function that will remove employee
function removeEmployee() {
  console.log("---------------------")
  console.log("Remove an employee");
  console.log(" ")
  let employee = [];
  connection.query(
    `SELECT employee.first_name, employee.id FROM employee`,
    (err, res) => {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        employee.push(res[i].first_name);
      }
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Which employee needs to be removed?",
            choices: employee,
          },
        ])
        .then( (answer) => {
          let selectEmployee = res.find(function (selectedEmployee) {
            if (answer.employee == selectedEmployee.first_name) {
              return selectedEmployee;
            }
          });
          connection.query(
            "DELETE FROM employee WHERE id = ?",
            selectEmployee.id,
           (err) => {
              if (err) throw err;
              console.log("---------------------")
              console.log("Employee Removed!");
              console.log("---------------------")

              runSearch();
            }
          );
        });
    }
  );
}

