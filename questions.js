var inquirer = require("inquirer")
var Queries = require("./Queries.js")

let queries = new Queries();



const qStart = [
    {
        name: "start",
        type: "list",
        message: "What would you like to do",
        choices: ["View tables", "Add a record", "Update employee roles", "Exit"]
    },
    {
        name: "viewTables",
        type: "list",
        message: "what would you like View",
        choices: ["View All tables", "View Department Table", "View Employee Table", "View Role Table", "Start Over", "Exit"],
        when: answer => answer.start === "View tables"
    },
    {
        name: "insertTables",
        type: "list",
        message: "Where would you like insert record",
        choices: ["Department", "Role", "Employee", "Start Over", "Exit"],
        when: answer => answer.start === "Add a record"
    },

]




function init(qStart) {
    inquirer.prompt(qStart).then(function (answer) {

        if (answer.start !== undefined) {
            if (answer.start === "Exit") {
                queries.close();
            }
            if (answer.start === "Update employee roles") {
                updateEmployeeRole();
            }
        }

        if (answer.viewTables !== undefined) {
            let answerView = answer.viewTables.toString();
            viewTables(answerView);
        }

        if (answer.insertTables !== undefined) {
            let answerInsert = answer.insertTables.toString();
            insertRecord(answerInsert);
        }


    })
};


function viewTables(answer) {

    switch (answer) {
        case "View All tables":
            // console.log("here at view all");

            queries.selectDepartment(function () {

                queries.selectEmployee(function () {

                    queries.selectRole(function () {
                        init(qStart);
                    });
                });
            });
            break;
        case "View Department Table":

            queries.selectDepartment(function () {
                init(qStart);
            });

            break;
        case "View Employee Table":

            queries.selectEmployee(function () {
                init(qStart);
            });
            break;
        case "View Role Table":
            queries.selectRole(function () {
                init(qStart);
            });
            break;
        case "Start Over":
            init(qStart)
            break;
        case "Exit":
            queries.close();
            break;

    }

}



function insertRecord(answer) {

    switch (answer) {

        case "Department":
            deptInsert();
            break;
        case "Role":
            // get choices
            queries.selectListDepartments(function (deptNames) {
                console.log("deparments:  ", deptNames);
                roleInsert(deptNames);
            })
            break;
        case "Employee":

            // get choices title
            queries.selectListRoles(function (roleTitle) {
                // console.log("deparments:  ", roleTitle);
                // get list administrators
                queries.selectListManagers(function (administrators) {
                    // console.log(administrators);
                    employeeInsert(roleTitle, administrators);
                })
            })
        // get choices managers

        case "Start Over":
            init(qStart)
            break;
        case "Exit":
            queries.close();
            break;

    }
}

function updateEmployeeRole() {
    // get role list
    queries.selectListRoles(function (roleTitle) {
        
        queries.selectListEmployee(function(employees){


            qUpdateRole = [
                {
                    name: "employeeId",
                    type: "list",
                    message: "Select Employee",
                    choices: employees
                },
                {
                    name: "roleId",
                    type: "list",
                    message: "Select new role",
                    choices: roleTitle
                }
            ]
    
            inquirer.prompt(qUpdateRole).then(function (answer) {
    
                // console.log("responses update role employee",answer.employeeId, answer.roleId )
                queries.updateEmployeeRole(answer.roleId, answer.employeeId, function(){
                    // show table
                    // call main menu
                    queries.selectEmployee(function () {
                        init(qStart);
                    });

                })
            })
        }) 
    })
};


function deptInsert() {

    var qDepartmentInfo = [
        {
            name: "deptName",
            type: "input",
            message: "Enter Department Name",
        }
    ]

    inquirer.prompt(qDepartmentInfo).then(function (answer) {
        queries.insertData("department", { name: answer.deptName }, function () {
            queries.selectDepartment(function () {
                init(qStart);
            });
        })
    })
}

function roleInsert(deptNames) {

    const qRole = [
        {
            name: "title",
            type: "input",
            message: "Enter role Title",
        },
        {
            name: "salary",
            type: "input",
            message: "Enter role Salary",
        },
        {
            name: "department",
            type: "list",
            message: "Choose the department",
            choices: deptNames
        }
    ]

    inquirer.prompt(qRole).then(function (answer) {
        console.log("choice of department  :", answer.department)

        queries.insertData("role", { title: answer.title, salary: answer.salary, department_id: answer.department }, function () {
            queries.selectRole(function () {
                init(qStart);
            });
        })

    })
}

function employeeInsert(roles, managers) {


    var qEmployee = [
        {
            name: "firstName",
            type: "input",
            message: "Enter employee Name",
        },
        {
            name: "lastName",
            type: "input",
            message: "Enter employee Last Name",
        },
        {
            name: "role",
            type: "list",
            message: "Choose Role",
            choices: roles
        },
        {
            name: "asign",
            type: "list",
            message: "Do you want to assign a Manager?",
            choices: ["YES", "NO"]
        },
        {
            name: "manager",
            type: "list",
            message: "Choose a manager",
            choices: managers,
            when: answer => answer.asign === "YES"
        }
    ]

    inquirer.prompt(qEmployee).then(function (answer) {
       
        let manager;
        if (answer.asign === "YES") {
            manager = answer.manager;
        } else {
            manager = null;
        }

        queries.insertData("employee", { first_name: answer.firstName, last_name: answer.lastName, role_id: answer.role, manager_id: manager }, function () {
            queries.selectEmployee(function () {
                init(qStart);
            });
        })
    })
}


init(qStart);
