var inquirer = require("inquirer")
var Queries = require("./Queries.js")

let queries = new Queries();



const qStart = [
    {
        name: "start",
        type: "list",
        message: "What would you like to do",
        choices: ["View tables", "Update a record", "Add a record", "Delete a record", "Exit"]
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
    }
]




function init(qStart) {
    inquirer.prompt(qStart).then(function (answer) {

        if (answer.start !== undefined) {
            if (answer.start === "Exit") {
                queries.close();
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


function deptInsert() {

    var qDepartmentInfo = [
        {
            name: "deptName",
            type: "input",
            message: "Enter Department Name",
        }
    ]
    

    inquirer.prompt(qDepartmentInfo).then(function (answer) {
        queries.insertData("department", {name : answer.deptName}, function(){
            init(qStart);
        })
    })
}

function roleInsert(deptNames){
   
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

        // get dept id
        queries.selectDepartmenID(answer.department,function(id){
            // insert
            // console.log ("this ID", id)
            queries.insertData("role", {title : answer.title, salary: answer.salary, department_id: id.id}, function(){
                init(qStart);
            })
        })
    })
}


function insertRecord(answer) {

    switch (answer) {

        case "Department":
            deptInsert();
            break;
        case "Role":
        // get choices
        queries.selectColumnBy("department", "name", function(deptNames){
            console.log("deparments:  ", deptNames);
            roleInsert(deptNames);
           
        })
        break;
        case "Employee":
        case "Start Over":
        case "Exit":
            break;

    }


}

function viewTables(answer) {

    switch (answer) {
        case "View All tables":
            console.log("here at view all");

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




init(qStart);

// queries.selectDepartment(function(arrDept){
//     console.log(arrDept);
// });

// queries.selectRole(function(){});




// async function start(){
//     arrDept=[]
//     try{
//         arrDpt= await queries.selectDepartment()
//         console.log("inside try")


//     }
//     catch(err){
//         console.log("inside catch")
//         throw err
//     }

// console.log("please print: ", arrDept);

// }
// start()