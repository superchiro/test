/*********************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Chihiro Kawaguchi Student ID: 127694180 Date: 2019/09/27
*
* Online (Heroku) Link: https://powerful-crag-68136.herokuapp.com
*
********************************************************************************/

/*
var employees = [];
var departments = [];

const fs = require("fs");
const path = require("path");
*/

const Sequelize = require('sequelize');
var sequelize = new Sequelize('depsb0ru520oqa', 'potfhsteggyjau', 'a73d79bde256d0e0c239429b45e13a11c0ac9bb7dec8a23b84b07b4d2ca5ed36', {
    host: 'ec2-50-19-95-77.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: true
    }
   });

   var Employee = sequelize.define('Employee', {
    employeeNum: {
    type:Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department', {
    departmentId: {
    type:Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

Department.hasMany(Employee, {foreignKey: 'department'});

module.exports.initialize = function(){
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(() => {
            resolve("CREATE WAS SUCCESSFUL")
        })
        .catch((err) => {
            reject("SYNC FAILED: " + err )
        })
       });

   /* return new Promise(function(resolve, reject) {
        try {
            fs.readFile('./data/employees.json', 'utf8', function(err, data) {
                if (err){
                    throw err;
                }
                employees = JSON.parse(data);
            });
            fs.readFile('./data/departments.json', function(err, data) {
                if (err) {
                    throw err;
                }
                departments = JSON.parse(data);
            });
        } catch (ex) {
            reject("Can't read the file");
        }
        resolve("success");
    });*/
}

module.exports.getAllEmployees = function(){
    return new Promise(function (resolve, reject) {
        Employee.findAll()
            .then((data) => {
                console.log(data[0] + ":" + data[0].model)
                resolve(data);
            })
            .catch((err) => {
                reject("READ failed: " + err);
            })
       });
    /*return new Promise(function(resolve,reject){
        if (employees.length == 0){
            reject("Array is empty");
        }else {
            resolve(employees);
        }
    });*/
}
module.exports.getManagers = function(){

    return new Promise(function (resolve, reject) {
        reject();
       });
       /*
return new Promise(function(resolve,reject){
          
            var managers = [];
            if (employees.length == 0){
                reject("Empty array");
            }
            else{
            for (i=0; i < employees.length; i++){
                if(employees[i].isManager == true){
                    managers.push(employees[i]);
                }
               
            }
            resolve(managers);

        }});*/
    }

module.exports.getDepartments=function(){
    return new Promise(function (resolve, reject) {
        Department.findAll()
            .then((data) => {
                resolve(data);
                console.log(data[0] + ":" + data[0].model)
            })
            .catch((err) => {
                reject("READ failed: " + err);
            })
       });
       /*
    return new Promise(function(resolve,reject){   
    
        if (departments.length == 0){
            reject("Array is empty");
        }else {
            resolve(departments);
        }
    });
    */
}

module.exports.addEmployee = function(employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for(let emp in employeeData){
            if(employeeData[emp] == ""){
                employeeData[emp] = null;
            }
        }
        Employee.create(employeeData)
        .then((data) => {
            resolve(data);
            console.log("EMPLOYEE CREATED");
        })
        .catch((err) => {
            reject("CREATE FAILED: " + err)
        })
       });
       /*
    return new Promise((resolve, reject) => {
        //let obj = JSON.parse(employeeData);
        employeeData.employeeNum = employees.length + 1;
        if(employeeData.isManager == null){
            employeeData.isManager = false;
        }
    
        employees.push(employeeData);
        resolve();
    })*/
}

module.exports.getEmployeesByStatus = function(status){
    return new Promise(function (resolve, reject) {
        Employee.findAll( {
            where: {
                status: status
            }
            .then((data) => {
                resolve(data);
                console.log(data[0].status + ":" + data[0].model);
            })
            .catch((err) => {
                reject("READ failed: " + err)
            })
        })
       });

       /*
    return new Promise((resolve, reject) => {
        let x = status.status;
        if(employees.length == 0){
            reject("No Results")
        } else {
            let tempEmp = []
            for(let i = 0; i < employees.length; i++){
                if((employees[i].status).toUpperCase() == x.toUpperCase()){
                    tempEmp.push(employees[i]);
                }
            }
            resolve(tempEmp);
        }
    })    */
}


module.exports.getEmployeesByDepartment = function(department){
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                department: department
            }
            .then((data) => {
                resolve(data);
                console.log(data[0].department + ":" + data[0].model);
            })
            .catch((err) => {
                reject("READ failed: " + err)
            })
        })
       });
       /*
    return new Promise((resolve, reject) => {
        let x = department.department;
        if(employees.length == 0){
            reject("No Results")
        } else {
            let tempEmp = []
            for(let i = 0; i < employees.length; i++){
                if(employees[i].department == x){
                    tempEmp.push(employees[i]);
                }
            }
            resolve(tempEmp);
        }
    })    */
}


module.exports.getEmployeesByManager = function(manager){
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                employeeManagerNum: manager
            }
            .then((data) => {
                resolve(data)
                console.log(data[0].employeeManagerNum + ":" + data[0].model)
            })
            .catch((err) => {
                reject("READ failed: " + err)
            })
        })
       });

       /*
    return new Promise((resolve, reject) => {
        let x = manager.manager;
        if(employees.length == 0){
            reject("No Results")
        } else {
            let tempEmp = []
            for(let i = 0; i < employees.length; i++){
                if(employees[i].employeeManagerNum == x){
                    tempEmp.push(employees[i]);
                }
            }
            resolve(tempEmp);
        }
    })    */
}


module.exports.getEmployeesByNum = function(num){

    return new Promise(function (resolve, reject) {
       });
       /*
    return new Promise((resolve, reject) => {
        let x = num;
        if(employees.length == 0){
            reject("No Results")
        } else {
            let tempEmp = []
            for(let i = 0; i < employees.length; i++){
                if(employees[i].employeeNum == x){
                    tempEmp.push(employees[i]);
                }
            }

            resolve(tempEmp);
        }
    })    */
}

module.exports.getEmployeeByNum = function(num){

    return new Promise(function (resolve, reject) {
        Employee.findAll(num, {
            where: {
                employeeNum: num
            }
            .then((data) => {
                resolve(data);
                console.log(data[0].employeeNum + ":" + data[0].model)
            })
            .catch((err) => {
                reject("READ failed: " + err)
            })
        })
       });

       /*
    return new Promise((resolve, reject) => {
        let x = num;
        if(employees.length == 0){
            reject("No Results")
        } else {
            let tempEmp;
            for(let i = 0; i < employees.length; i++){
                if(employees[i].employeeNum == x){
                    tempEmp = employees[i]
                }
            }

            resolve(tempEmp);
        }
    })    
*/
}


module.exports.updateEmployee = function(employeeData){
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for(let emp in employeeData){
            if(employeeData[emp] == ""){
                employeeData[emp] == null;
            }
        }
        Employee.update(employeeData)
        .then((data) => {
            resolve(data)
            console.log("UPDATE SUCCESSFUL")
        })
        .catch((err) => {
            reject("UPDATE FAILED: " + err)
        })
       });
       /*
    return new Promise((resolve, reject) => {
        if(employees.length == 0){
            reject("No Results")
        } else {
            for(let i = 0; i < employees.length; i++){
                if(employees[i].employeeNum == employeeData.employeeNum){
                    employees[i] = employeeData;
                }
            }

            resolve();
        }
    })    */
}

module.exports.addDepartment = function(departmentData){
    return new Promise(function(resolve, reject){
        for(let dep in departmentData){
            if(departmentData[dep] == ""){
                departmentData[dep] == null;
            }
        }
        Department.create(departmentData)
        .then((data) => {
            resolve(data);
            console.log("ADD SUCCESSFUL")
        })
        .catch((err) => {
            console.log("ADD FAILED: " + err)
        })
    })
}

module.exports.updateDepartment = function(departmentData){
    return new Promise(function(resolve, reject){
        for(let dep in departmentData){
            if(departmentData[dep] == ""){
                departmentData[dep] == null;
            }
        }
        Department.update(departmentData)
        .then((data) => {
            resolve(data);
            console.log("UPDATE SUCCESSFUL")
        })
        .catch((err) => {
            console.log("UPDATE FAILED: " + err)
        })
    })
}

module.exports.getDepartmentById = function(id){
    return new Promise(function (resolve, reject) {
        Department.findAll({
            where: {
                departmentId: id
            }
            .then((data) => {
                resolve(data);
                console.log(data[0].employeeNum + ":" + data[0].model)
            })
            .catch((err) => {
                reject("READ failed: " + err)
            })
        })
       });
}

module.exports.deleteDepartmentById = function(id){
    return new Promise(function (resolve, reject) {
        //const dId = parseInt(id);
      //  console.log(typeof dId)
        Department.destroy({
            where: {
                departmentId: id
            }
        })
            .then((data) => {
                resolve(data);
                console.log("DESTROY SUCCESSFUL")
            })
            .catch((err) => {
                reject("DESTRYO FAILED: " + err)
            })
       });
}

module.exports.deleteEmployeeByNum = function(id){
    return new Promise(function (resolve, reject) {
        //const dId = parseInt(id);
      //  console.log(typeof dId)
        Employee.destroy({
            where: {
                employeeNum: id
            }
        })
            .then((data) => {
                resolve(data);
                console.log("DESTROY SUCCESSFUL")
            })
            .catch((err) => {
                reject("DESTRYO FAILED: " + err)
            })
       });
}