require('dotenv').config();
require('console.table');
const inquirer = require('inquirer');
const MYSQL = require('mysql');

var manager = {

    connection: MYSQL.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: "bamazon"
    }),

    actionsMap: {
        'View Products for Sale': 'showProducts',
        'View Low Inventory': 'showLowInventory',
        'Add to Inventory': 'addToInventory',
        'Add New Product': 'addNewProduct',
        'Exit App': 'exitApp'
    },

    showMenu: function() {
        inquirer.prompt([{
            type: 'list',
            message: '\nBAMazon Management Protal\n\nPlease choose an action from the list below.',
            choices: [
                'View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product',
                'Exit App'
            ],
            name: 'action'
        }]).then(function(answers) {
            manager[manager.actionsMap[answers.action]]();
        });
    },

    showProducts: function() {
        manager.connection.query("SELECT * FROM products", function(err, results) {
            if (err) throw err;
            var myTable = [];
            for (var i = 0; i < results.length; i++) {
                myTable.push({
                    "Product ID": results[i].item_id,
                    "Product Name": results[i].product_name,
                    "Price": results[i].price.toFixed(2),
                    "Stock Quantity": results[i].stock_quantity
                });
            }
            console.table(myTable);
            manager.showMenu();
        });
    },

    showLowInventory: function() {
        manager.connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, results) {
            if (err) throw err;
            var myTable = [];
            for (var i = 0; i < results.length; i++) {
                myTable.push({
                    "Product ID": results[i].item_id,
                    "Product Name": results[i].product_name,
                    "Price": results[i].price.toFixed(2),
                    "Stock Quantity": results[i].stock_quantity
                });
                // console.log("\nProduct ID: " + results[i].item_id + "\nProduct Name: " + results[i].product_name + "\nPrice: " + results[i].price + "\nStock Quantity: " + results[i].stock_quantity);
            }
            console.table(myTable);
            manager.showMenu();
        });
    },

    addToInventory: function() {
        manager.connection.query("SELECT * FROM products", function(err, results) {
            if (err) throw err;
            var myTable = [];
            for (var i = 0; i < results.length; i++) {
                myTable.push({
                    "Product ID": results[i].item_id,
                    "Product Name": results[i].product_name,
                    "Price": results[i].price.toFixed(2),
                    "Stock Quantity": results[i].stock_quantity
                });
            }
            console.table(myTable);
            inquirer.prompt([{
                    type: 'input',
                    message: '\n\nEnter the ID of the product you would like to add more of.',
                    validate: function(id) {
                        if (Number.isInteger(parseFloat(id))) {
                            if (parseFloat(id) > 0 && parseFloat(id) < results.length + 1) return true;
                            else return "\nChoose a number between 0 - 10.";
                        } else return "\nThat is not a valid number! Please choose a number between 0 - 10.";
                    },
                    name: 'productID'
                },
                {
                    type: 'input',
                    message: 'How many units would you like to add to the inventory?',
                    validate: function(quantity) {
                        if (Number.isInteger(parseFloat(quantity))) {
                            if (parseFloat(quantity) > 0) return true;
                            else return "\nChoose a number greater than 0.";
                        } else return "\nPlease enter a valid number greater than 0."
                    },
                    name: 'productQuantity'
                }
            ]).then(function(answers) {
                manager.connection.query("UPDATE products SET stock_quantity = stock_quantity + " + answers.productQuantity + " WHERE item_id = " + answers.productID, function(err, results) {
                    if (err) throw err;
                    console.log("\n" + answers.productQuantity + " units added to inventory.");
                    manager.showMenu();
                });
            });
        });
    },
    addNewProduct: function() {
        inquirer.prompt([{
                type: 'input',
                message: "\nPlease enter the name of the new product.",
                name: 'productName'
            },
            {
                type: 'input',
                message: "\nEnter the department this product belongs in.",
                name: 'productDepartment'
            },
            {
                type: 'input',
                message: "\nEnter the price for this product.",
                validate: function(price) {
                    if (Number.isNaN(parseFloat(price)) || parseFloat(price) <= 0) return "\nPlease enter a valid number greater than 0.";
                    else return true;
                },
                name: 'productPrice'
            },
            {
                type: 'input',
                message: "\nEnter the stock quantity for this product.",
                validate: function(quantity) {
                    if (Number.isInteger(parseFloat(quantity))) {
                        if (parseFloat(quantity) > 0) return true;
                        else return "\nChoose a number greater than 0.";
                    } else return "\nPlease enter a valid number greater than 0."
                },
                name: 'productStock'
            }
        ]).then(function(answers) {
            manager.connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES('" + answers.productName + "', '" + answers.productDepartment + "', " + answers.productPrice + ", " + answers.productStock + ")", function(err, results) {
                if (err) throw err;
                console.log("\nYou have added " + answers.productName + " to the store!");
                manager.showMenu();
            });
        });
    },

    exitApp: function() {
        manager.connection.end(function(err) {
            if (err) throw err;
            console.log("\nThank you for using BAMazon!")
            process.exit();
        });
    }
};

manager.connection.connect(function(err) {
    if (err) throw err;
    manager.showMenu();
});