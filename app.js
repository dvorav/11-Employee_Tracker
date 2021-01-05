let inquirer = require("inquirer");

let mysql = require("mysql");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Dillon123",
    database: "employee_trackerDB"
});

connection.connect(function (err) {
    if (err) throw err;
});

const viewOptions = [
    "View Departments",
    "View Roles",
    "View Employees",
    "Update Employee",
    "Add Employee",
    "Exit"

];

const employeeOptions = [
    "Bob Ross",
    "Donald Duck",
    "Will Smith",
    "Kevin Ross",
    "Bobby Shmoney",
    "Exit"
];

const updateOptions = [
    "First Name",
    "Last Name",
    "Role",
    "Exit"
];

runSearch();

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: viewOptions
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
                    console.clear()
                    console.log("Script Terminated!")
                    exit()
                    break;
            }
        })
}



function departmentView() {
    let sqlStr = "SELECT * FROM department";
    connection.query(sqlStr, function (err, result) {
        if (err) throw err;

        console.table(result)
        runSearch();
    })
}

function employeeView() {
    let sqlStr = "SELECT first_name, last_name, title, salary FROM employee ";
    sqlStr += "LEFT JOIN role ";
    sqlStr += "ON employee.role_id = role.id"
    connection.query(sqlStr, function (err, result) {
        if (err) throw err;

        console.table(result)
        runSearch();
    })
}

function roleView() {
    let sqlStr = "SELECT * FROM role";
    connection.query(sqlStr, function (err, result) {
        if (err) throw err;

        console.table(result)
        runSearch();
    })
}

function exit() {
    return process.exit(1);
}


const updateEmployee = () => {

    function runUpdateSearch() {
        inquirer
            .prompt({
                name: "action",
                type: "list",
                message: "Which employee do you want to update?",
                choices: employeeOptions
            })
           
    }
    runUpdateSearch();  
}
function addEmployee() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "Enter employee first name",
          name: "firstname"
        },
        {
          type: "input",
          message: "Enter employee last name",
          name: "lastname"
        },
        {
            type: "list",
            message: "Select department",
            name: "department",
            choices: [1, 2, 3, 4, 5]
          }
      ])
      .then(function(answer) {
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answer.firstname,
            last_name: answer.lastname,
            role_id: answer.department,
            manager_id: null,
          },
          function(err) {
            if (err) {
              throw err;
            }
            console.clear()
            console.table("Added to Employee List!");
            runSearch();
          }
        );
        
      });
  }
