var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query(
        "SELECT * FROM products",
        function(err, res) {
            console.log(res);
            inquirer.prompt([
                {
                    name: "id",
                    message: "What is the id of the product?"
                },
                {
                    name: "quantity",
                    message: "What is the quantity?"
                }
            ]).then(function(answers) {
                checkProduct(answers.id, answers.quantity);
            });
        }
    );
});

function checkProduct(id, quantity) {
    connection.query(
        "SELECT * FROM products WHERE ?",
        {
            item_id: id
        },
        function(err, res) {
            console.log(res);
            if (res[0].stock_quantity < quantity) {
                console.log("Insufficient quantity!");
                connection.end();
            } else {
                var buyQuantity = res[0].stock_quantity - quantity;
                var cost = res[0].price * quantity;
                buyProduct(id, buyQuantity, cost);
            }
        }
    );
}

  function buyProduct(id, quantity, cost) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [{
            stock_quantity: quantity
        },
        {
            item_id: id
        }],
        function(err, res) {
            console.log("Your cost is $" + cost);
        }
    );
    connection.end();
}