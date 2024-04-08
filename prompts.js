const inquirer = require('inquirer');

chooseTask = async function(db) {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'task',
            choices: [
                {
                    name: 'View',
                    value: 'view',
                },
                {
                    name: 'Add',
                    value: 'add',
                }
            ]
        }
    ])
    .then((answers) => {
        // console.log(answers);
        if(answers.task === 'view'){
            whichView(db); 
        }
        else {
            pickAddCategory(db);
        }
    });
}

pickAddCategory = function(db) {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to add?',
            name: 'add',
            choices: [ 'Department', 'Role', 'Employee']
        }
    ])
    .then(async (answers) => {
        // console.log(answers.add);
        const choice = answers.add.toLowerCase();
        if(choice === 'employee'){
            await addEmployee(db);
        }
        else if(choice === 'role'){
            await addRole(db);
        }
        else {  //selects department if role and employee aren't result
            await addDepartment(db);
        }
    });
};

returnMain = function(db){
    inquirer.prompt([
        {
            type: 'list',
            message: 'Return?',
            name: 'choice',
            choices: [{name: 'Yes', value: 'true'}]
        }
    ])
    .then((answers) => {
        if(answers.choice === 'true'){
            chooseTask(db);
        }
    })
}
// Add prompts

addToTable = async function(db, sql){
    const data = await db.query(sql);
};

addRole = async function(database){
    const departments = await getList(database, 'SELECT name,id FROM department');
    
    // console.log(departments);

    const dList = objToArray(departments);

    // console.log(dList);

    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter the role\'s name:',
            name: 'rName'
        },
        {
            type: 'input',
            message: 'Enter the role\'s salary:',
            name: 'rSalary'
        },
        {
            type: 'list',
            message: 'What department does this role belong to?',
            name: 'rDepartment',
            choices: dList
        }
    ])
    .then((answers) => {
        const id = matchID(answers.rDepartment, departments);
        
        console.log(id);

        const sql = `INSERT INTO role (name, salary, department_id)
            VALUES (${answers.rName}, ${answers.rSalary}, ${id})`;

        // console.log(sql);
        addToTable(database, sql)
    })
};

addDepartment = function(database){
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter the department\'s name:',
            name: 'dName'
        }
    ])
    .then((answers) => {
        console.log(answers.dName);
        const sql = `INSERT INTO department (name) Values ('${answers.dName}')`;
        addToTable(database, sql);
        chooseTask(database);
    })
}

addEmployee = async function(db){
    let roles = await getList(db, 'SELECT name, id FROM role')
    let rolesL = objToArray(roles);
    // console.log(rolesL);

    let managers = await getList(db, 'SELECT first_name,id FROM employee WHERE role_id = 1');
    let managersL = objToArray(managers);
    managersL.push('None');
    // console.log(managersL);

    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter employees\' first name:',
            name: 'nameFirst'
        },
        {
            type: 'input',
            message: 'Enter employees\' last name:',
            name: 'nameLast'
        },
        {
            type: 'list',
            message: 'Select a role:',
            name: 'role',
            choices: rolesL
        },
        {
            type: 'list',
            message: 'Select a manager',
            name: 'manager',
            choices: managersL
        },
    ])
    .then((answers) => {
        const roleID = matchID(answers.role, roles);
        let managerID = 'NULL';
        if(answers.manager != 'None'){
            managerID = matchID(answers.managers, managers);
        }
        

        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES ('${answers.nameFirst}', '${answers.nameLast}', ${roleID}, ${managerID})`
        
        // console.log(sql);
        addToTable(db, sql);
        chooseTask(db);
    })
};

getList = async function(db, sql){
    const rows = await db.query(sql)
    // console.log(rows);
    return rows[0];
}

objToArray = function(obj){
    const list = [];
    for(let i = 0; i < obj.length; i++){

        list.push(obj[i].name || obj[i].first_name);
    }
    return list;
}

matchID = function(item, array){
    // console.log(array);
    for(let i = 0; i < array.length; i++){
        if(item === array[i].name || array[i].first_name){
            return array[i].id;
        }
    }
    console.log("Item not found in array")
}

// View prompts

whichView = function(db){
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to view?',
            name: 'view',
            choices: [
                {
                    name: 'Department',
                    value: 'department'
                },
                {
                    name: 'Role',
                    value: 'role'
                },
                {
                    name: 'Employees',
                    value: 'employee'
                }
            ]
        }
    ])
    .then((answers) => {
        viewTable(db, answers.view);        
    })
    
}

viewTable =   async function(db, table){
    const sql = `SELECT * FROM ${table}`;
    const rows = await db.query(sql);
    console.table(rows[0]);
    returnMain(db);
};


// start questions

module.exports = {
    chooseTask,
    addToTable,
    addEmployee,
    viewTable
};
