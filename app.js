let inquirer = require("inquirer");

let mysql = require("mysql");

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

const updateOptions = connection.query("SELECT first_name FROM employee");

runSearch();

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

function departmentView() {
  let sqlStr = "SELECT * FROM department";
  connection.query(sqlStr, function (err, result) {
    if (err) throw err;

    console.table(result);
    runSearch();
  });
}

function employeeView() {
  let sqlStr = "SELECT first_name, last_name, title, salary FROM employee ";
  sqlStr += "LEFT JOIN role ";
  sqlStr += "ON employee.role_id = role.id";
  connection.query(sqlStr, function (err, result) {
    if (err) throw err;

    console.table(result);
    runSearch();
  });
}

function roleView() {
  let sqlStr = "SELECT * FROM role";
  connection.query(sqlStr, function (err, result) {
    if (err) throw err;

    console.table(result);
    runSearch();
  });
}

function exit() {
  return process.exit(1);
}

function addEmployee() {
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

function addDepartment() {
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
          console.clear();
          console.log("-----------------------");

          console.table("Added to department list!");
          console.log("-----------------------");

          runSearch();
        }
      );
    });
}

function addRole() {
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

// function employeeNames() {
//   let sqlStr = "SELECT first_name, last_name FROM employee ";
//   connection.query(sqlStr, function (err, result) {
//     if (err) throw err;
//     let res = JSON.parse(JSON.stringify(result));
//     let array = [];
//     for (let i = 0; i < result.length; i++) {
//       let f = res[i].first_name;
//       let l = res[i].last_name;
//       let name = f + " " + l;
//       array.push(name);
//     }

//     return console.log(array);
//   });
// }

// //usage

// employeeNames()

function removeEmployee() {
  console.log("---------------------")
  console.log("Remove an employee");
  console.log(" ")
  let employee = [];
  connection.query(
    `SELECT employee.first_name, employee.id FROM employee`,
    function (err, res) {
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
        .then(function (answer) {
          let selectEmployee = res.find(function (selectedEmployee) {
            if (answer.employee == selectedEmployee.first_name) {
              return selectedEmployee;
            }
          });
          connection.query(
            "DELETE FROM employee WHERE id = ?",
            selectEmployee.id,
            function (err, res) {
              if (err) throw err;

              console.log("Employee Removed!");
              runSearch();
            }
          );
        });
    }
  );
}
