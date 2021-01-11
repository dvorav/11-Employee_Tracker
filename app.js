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
  "View all employees",
  "Add an employee",
  "Add a deparment",
  "Add a role",
  "Update an employee",
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
          updateEmployee();
          break;
        case viewOptions[7]:
          removeEmployee();
          break;
        case viewOptions[8]:
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

const updateEmployee = () => {
  function runUpdateSearch(answer) {
    inquirer
      .prompt({
        name: "update",
        type: "list",
        message: "Which employee do you want to update?",
        choices: employeeNames(),
        default: true,
      })
      .then(function (answer) {
        if (answer) {
          inquirer
            .prompt({
              name: "action",
              type: "list",
              message: "What would you like to update?",
              choices: updateOptions,
            })
            .then(function (answer) {
              console.log(answer);
              switch (answer.action) {
                case updateOptions[0]:
                  updateFirst();
                  break;

                case updateOptions[1]:
                  break;

                case updateOptions[2]:
                  break;
                case updateOptions[3]:
                  runSearch();

                  break;
              }
            });
        }
      });
  }
  runUpdateSearch();
};

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
          department_id: answer.dept 
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

function updateFirst() {
  //Prompt to change first name
  inquirer
    .prompt([
      {
        type: "input",
        message: "Update first name",
        name: "updateFirst",
      },
    ])
    //Ca
    .then(function (answer) {
      let sql = `UPDATE employee
        SET first_name = first_name
        `;

      connection.query(sql, answer, (error) => {
        if (error) {
          return console.error(error.message);
        } else {
          console.log(answer);
          "INSERT INTO employee SET ?",
            {
              first_name: answer.updateFirst,
            };
          runSearch();
        }
      });
    });
}

function employeeNames(callback) {
  let sqlStr = "SELECT first_name, last_name FROM employee ";
  connection.query(sqlStr, function (err, result) {
    if (err) throw err;
    let res = JSON.parse(JSON.stringify(result));
    let array = [];
    for (let i = 0; i < result.length; i++) {
      let f = res[i].first_name;
      let l = res[i].last_name;
      let name = f + " " + l;
      array.push(name);
    }

    return (callback = array);
  });
}

//usage

// console.log(employeeNames());


