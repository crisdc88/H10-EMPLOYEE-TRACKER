const connection = require("./db_Connection/db.js");
const cTable = require("console.table");
const Table = require("cli-table")
let Department = require("./classes/Department.js");
let Role = require("./classes/Role.js");
let Employee = require("./classes/Employee");


 class  Queries{

    selectDepartment(cb) {
        let query = "select * from department";

        let table = new Table(
            {
                head: ["ID", "NAME"],
                colWidths: [10, 20]
            })

        connection.query(query, function (err, resp) {
            if (err) throw err;
            // console.table(resp);
            resp.forEach(element => {
                // console.log(element);
                let tableRow = [];
                tableRow.push(element.id, element.name);
                table.push(tableRow);
            });
            console.log("DEPARTMENT TABLE")
            console.log(table.toString());
            cb();
        })
    }


    selectRole(cb) {

        let table = new Table(
            {
                head: ["ID", "Title", "SALARY", "DEPARMENT NAME"],
                colWidths: [10, 20, 20, 20]
            })

        let query = "select a.id, a.title, a.salary, b.name from role a left join department b ON a.department_id = b.id ";
        connection.query(query, function (err, resp) {
            if (err) throw err;

            resp.forEach(element => {

                let tableRow = [];
                tableRow.push(element.id, element.title, element.salary, element.name);
                table.push(tableRow);
            });
            console.log("ROLE TABLE");
            console.log(table.toString());

            cb();
        })
    }

    selectEmployee(cb) {
        let table = new Table(
            {
                head: ["ID", "FIRST NAME", "LAST NAME", "TITLE", "MANAGER NAME"],
                colWidths: [10, 20, 20, 20, 20]
            })

        let query = "SELECT a.id, a.first_name, a.last_name, b.title, c.first_name AS ManagerName from ((employee a LEFT JOIN `role` b ON a.role_id = b.id)LEFT JOIN employee c ON a.manager_id =c.id)"
        connection.query(query, function (err, resp) {
            if (err) throw err;
           
           
            resp.forEach(element => {
                // console.log(resp)
                let tableRow = [];
                if(element.ManagerName == null || element.ManagerName === undefined){
                    element.ManagerName = "";
                }
                tableRow.push(element.id, element.first_name, element.last_name, element.title, element.ManagerName);
                table.push(tableRow);
            });
            console.log("EMPLOYEE TABLE");
            console.log(table.toString());

            cb();
        })

    }


    selectListDepartments(cb) {
        
        let query = `Select id, name from  department`;
        
        connection.query(query, function (err, resp) {
            let result = [];
            if (err) throw err;
            //  console.log(resp)
           
            resp.map(element => {
                let temObj = {value:element.id, name:element.name}; 
                result.push(temObj);               
            });
            console.log("list department result",result)
            cb(result)
        })
    }

    selectDepartmenID(name, cb) {
      
        let query = `Select id from department where name=?`;
        connection.query(query, name, function (err, resp) {
            if (err) throw err;
            resp.map(element => {
                let temObj = {value:element.id, name:element.name}; 
                result.push(temObj);               
            });
            
            cb(resp);
        })
    }

    selectListRoles(cb) {
        
        let query = `Select id, title from role`;
        
        connection.query(query, function (err, resp) {
            let result = [];
            if (err) throw err;
            // console.log(resp)
           
            resp.map(element => {
                let temObj = {value:element.id, name:element.title}; 
                result.push(temObj);               
            });
            // console.log(result)
            cb(result)
        })
    }

    selectListManagers(cb) {
        
        let query = `Select id, first_name, last_name from  employee where manager_id is not null `;
        
        connection.query(query, function (err, resp) {
            let result = [];
            let temObj;
            if (err) throw err;
            console.log(resp)
            resp.map(element => {
                temObj = {value:element.id, name:`${element.first_name}  ${element.last_name}`}; 
                result.push(temObj);               
            });
            // console.log(result)
            cb(result);
        })
    }

    insertData(table, objectValues, cb) {
       
        let query = `INSERT INTO ${table}  SET ?`;
        connection.query(query, objectValues, function (err, resp) {
            if (err) throw err;
            // console.log(resp)
        })
        cb();
    }


    delteData(table, column, value) {
        let result = [];
        let query = "DELETE FROM" + table + "  where?";
        connection.query(query, { [column]: value }, function (err, resp) {
            if (err) throw err;
            console.log(resp)
        })
    }

    updateData(table, coltoupdate, newValue, colcondition, condValue) {
        let result = [];
        let query = "UPDATE " + table + " set ? where?";
        connection.query(query, [{ [coltoupdate]: newValue }, { [colcondition]: condValue }], function (err, resp) {
            if (err) throw err;
            console.log(resp)
        })
    }
    close() {
        connection.close();
    }

}

module.exports = Queries