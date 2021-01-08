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
  "View All Departments",
  "View All Roles",
  "View All Employees",
  "Update An Employee",
  "Add An Employee",
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
          updateEmployee();
          break;

        case viewOptions[4]:
          addEmployee();
          break;

        case viewOptions[5]:
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
  function runUpdateSearch() {
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
          console.table("Added to Employee List!");
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

function employeeNames() {
  let sqlStr = "SELECT first_name, last_name FROM employee ";
  
  connection.query(sqlStr, function (err, result) {
    if (err) throw err;
let array = []
let res = JSON.parse(JSON.stringify(result));

for(let i = 0; i < result.length; i++){
  let first = res[i].first_name;
  let last = res[i].last_name;
  let name = first + " " + last;
     array.push(name)
     
  }
   
   return console.log(array);
  });
}


employeeNames()

