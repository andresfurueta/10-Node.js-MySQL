require('dotenv').config();
require('console.table');
const inquirer = require('inquirer');
const MYSQL = require('mysql');

var orders = {

    products: [],

    connection: MYSQL.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: "bamazon"
    }),

    loadData: function() {
        orders.connection.query("SELECT item_id, product_name, price FROM products", function(err, results) {
            if (err) throw err;
            orders.products = results;
            orders.promptUser();
        });
    },

    displayProducts: function(callback) {
        orders.connection.query("SELECT item_id, product_name, price FROM products", function(err, results) {
            if (err) throw err;
            orders.products = results;
            var myTable = [];
            for (var i = 0; i < results.length; i++) {
                myTable.push({
                    "Product ID": results[i].item_id,
                    "Product Name": results[i].product_name,
                    "Price": results[i].price.toFixed(2)
                });
            }
            console.table(myTable);
            callback();
        });
    },

    promptUser: function() {
        orders.displayProducts(function() {
            inquirer.prompt([{
                    type: 'input',
                    message: '\nPlease enter the ID of the product you wish to buy.',
                    validate: function(id) {
                        if (Number.isInteger(parseFloat(id))) {
                            if (parseFloat(id) > 0 && parseFloat(id) < orders.products.length + 1) return true;
                            else return "\nChoose a number between 0 - " + orders.products.length + ".";
                        } else return "\nThat is not a valid number! Please choose a number between 0 - " + orders.products.length + ".";
                    },
                    name: 'productID'
                },
                {
                    type: 'input',
                    message: 'How many would you like to buy?',
                    validate: function(id) {
                        if (Number.isInteger(parseFloat(id))) {
                            if (parseFloat(id) > 0) return true;
                            else return "\nChoose a number greater than 0.";
                        } else return "\nThat is not a valid quantity! Please choose a number greater than 0.";
                    },
                    name: 'productQuantity'
                }
            ]).then(function(answers) {
                orders.handleOrder(answers);
            });
        });
    },

    handleOrder: function(answers) {
        orders.connection.query("SELECT * FROM products WHERE ?", { item_id: answers.productID }, function(err, results) {
            if (err) throw err;
            if (results[0].stock_quantity >= answers.productQuantity) orders.processTransaction(answers.productID, (results[0].stock_quantity - answers.productQuantity), results[0].price * answers.productQuantity);
            else orders.declineTransaction();
        });
    },

    processTransaction: function(itemID, stock, cost) {
        orders.connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: stock
            },
            {
                item_id: itemID
            }
        ], function(err, results) {
            if (err) throw err;
        });
        orders.connection.query("UPDATE products SET product_sales = product_sales + " + cost + " WHERE item_id = " + itemID, function(err, results) {
            if (err) throw err;
        });
        console.log("\nThe cost of your order is: $" + cost);
        orders.askForNewOrder();
    },

    declineTransaction: function() {
        console.log("\nInsufficient quantity!");
        orders.askForNewOrder();
    },

    askForNewOrder: function() {
        inquirer.prompt([{
            type: "confirm",
            message: "Would you like to place another order?",
            name: "newOrder"
        }]).then(function(answers) {
            if (answers.newOrder) orders.promptUser();
            else orders.exitApp();
        });
    },

    exitApp: function() {
        orders.connection.end(function(err) {
            if (err) throw err;
            console.log("\nThank you for using BAMazon!")
            process.exit();
        });
    }
}

orders.connection.connect(function(err) {
    if (err) throw err;
    orders.loadData();
});