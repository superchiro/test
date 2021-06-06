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


const express = require("express");
const app = new express();
const path = require("path");
const data = require("./data-service.js");

const fs = require ("fs");

const multer = require ("multer");
const bodyParse = require ("body-parser");

const exphbs = require ("express-handlebars");


const HTTP_PORT = process.env.PORT || 8080; 

app.use(express.static("public"));  //'public'

app.use(bodyParse.urlencoded({extended: true}));

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
   });

app.engine(".hbs", exphbs({
    extname: ".hbs",
    defaultlayout: "main",
    helpers: {
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
           },
        equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
        return options.inverse(this);
        } else {
        return options.fn(this);
         }
        }
    }

}));
app.set('view engine', ".hbs");

app.get("/", function(req, res){
    res.render(path.join(__dirname, "/views/home.hbs"));
});

app.get("/about", function(req, res){
    res.render(path.join(__dirname, "/views/about.hbs"));
});



app.get("/employees",function(req,res){
    let qString = req.query;
    if(qString.status != undefined && (qString.status.toUpperCase() == "FULL TIME" || qString.status.toUpperCase() == "PART TIME")){
        data.getEmployeesByStatus(qString)
        .then(function(data){
            if(data.length > 0){
                res.render("employees", {employees: data});
            } else {
                res.render("employees", {employees: data});
            }
        }) 
        .catch(function(err){
            res.render("employees", {message: "no results"});
        }); 
    } else if(qString.department != undefined && (qString.department >= 1 && qString.department <= 7)){
        data.getEmployeesByDepartment(qString)
        .then(function(data){
            res.render("employees", {employees: data});
        }) 
        .catch(function(err){
            res.render("employees", {message: "no results"});
        }); 
    } else if(qString.manager != undefined && (qString.manager >= 1 && qString.manager <= 30)){
        data.getEmployeesByManager(qString)
        .then(function(data){
            res.render("employees", {employees: data});
        }) 
        .catch(function(err){
            res.render("employees", {message: "no results"});
        }); 
    }
    else{
        data.getAllEmployees()
        .then(function(data){
            res.render("employees", {employees: data});
        })
        .catch(function(data){
            res.render("employees", {message: "no results"});
        });
    }
});

app.get("/departments",function(req,res){
    data.getDepartments()
    .then(function(data){
        if(data.length > 0){
            res.render("departments", {departments: data});
        } else {
            res.render("departments", {message: "no results"}); 
        }
    })
    .catch(function(err){
        res.render("departments", {message: "no results"});
    });
});

app.get ("/employees/add", function(req, res){
    data.getDepartments()
    .then((data) => {
        res.render("addEmployee", {departments: data});
    })
    .catch((err) => {
        res.render("addEmployee", {departments: []});
    })
});


const storage = multer.diskStorage({
    destination: "public/images/uploaded/",
    filename: function (req, file, cb) {
    
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

const upload = multer({ storage: storage });

app.get ("/images/add", function (req, res){
    res.render(path.join(__dirname, "/views/addImage.hbs"));
});

app.post ("/images/add", upload.single("imageFile"), function (req, res){
   // res.redirect("/images")
    res.redirect("/images")
});

app.get("/images", (req,res)=>{

    var path = "public/images/uploaded";
 
    fs.readdir(path, function(err, items) {
        for (var i=0; i<items.length; i++) {
            var file = path + '/' + items[i];
     
            console.log("Start: " + file);
            fs.stat(file, function(f) {
                return function(err, stats) {
                    res.render("images", {item: items});
                }
            }(file));
        }
    });
});


/*fs.readdir("./public/images", function(err, items) {
     console.log(items);
    for (var i=0; i<items.length; i++) {
        console.log(items[i]);
    }
});*/
data.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log('Express http server listening on: ' + HTTP_PORT);
    })
}).catch((err) => {
    console.log(err);
});

app.post("/employees/add", (req, res) => {
    data.addEmployee(req.body)
    .then(()=>{
        res.redirect("/employees");
    })
    .catch((err) => {
        res.status(500).send("Unable to Add Employee");
    })
})


app.get("/employee/:id", (req,res)=>{
    let qString = req.params.id
    let viewData = {};
    dataService.getEmployeeByNum(req.params.id).then((data) => {
    if (data) {
        viewData.employee = data; //store employee data in the "viewData" object as "employee"
    } else {
        viewData.employee = null; // set employee to null if none were returned
    }
    }).catch(() => {
    viewData.employee = null; // set employee to null if there was an error
    }).then(dataService.getDepartments)
    .then((data) => {
    viewData.departments = data; // store department data in the "viewData" object as "departments"
    // loop through viewData.departments and once we have found the departmentId that matches
    // the employee's "department" value, add a "selected" property to the matching
    // viewData.departments object
    for (let i = 0; i < viewData.departments.length; i++) {
        if (viewData.departments[i].departmentId == viewData.employee.department) {
            viewData.departments[i].selected = true;
        }
    }
    }).catch(() => {
    viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
    if (viewData.employee == null) { // if no employee - return an error
        res.status(404).send("Employee Not Found");
    } else {
        res.render("employee", { viewData: viewData }); // render the "employee" view
    }
    })
    .catch((err) => {
        res.status(500).send("Unable to Get Employee");
    })
})

app.post("/employee/update", (req, res) => {

    data.updateEmployee(req.body)
    .then(function(data){
        console.log(req.body);
        res.redirect("/employees");
    })
    .catch((err) => {
        res.status(500).send("Unable to Update Employee");
    })
   });

app.get("/departments/add", (req, res) => {
    res.render(path.join(__dirname, "/views/addDepartment.hbs"));
})

app.post("/departments/add", (req, res) => {
    data.addDepartment(req.body)
    .then(()=>{
        res.redirect("/departments");
    })
    .catch((err) => {
        res.status(500).send("Unable to Add Department");
    })
})

app.post("/department/update", (req, res) => {

    data.updateDepartment(req.body)
    .then(function(data){
        res.redirect("/departments");
    })
    .catch((err) => {
        res.status(500).send("Unable to Update Department");
    })
   });

   app.get("/department/:id", (req,res)=>{
    let qString = req.params.id
    data.getDepartmentById(qString)
    .then(function(data){
        if(data){
            res.render("department", {department: data});
        } else {
            res.status(404).send("Department Not Found");
        }
    }) 
    .catch(function(err){
        res.status(404).send("Department Not Found");
    }); 
})

app.get("/departments/delete/:id", (req, res) => {
    let qString = req.params.id
    data.deleteDepartmentById(qString)
    .then(() => {
        res.redirect("/departments")
    })
    .catch((err) => {
        res.status(500).send("Unable to Remove Department / Department Not Found");
    })
})



app.get("/employees/delete/:id", (req, res) => {
    let qString = req.params.id
    data.deleteEmployeeByNum(qString)
    .then(() => {
        res.redirect("/employees")
    })
    .catch((err) => {
        res.status(500).send("Unable to Remove Employee / Employee Not Found");
    })
})

