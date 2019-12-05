DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price INT(10) NOT NULL,
    stock_quantity INT(10) NOT NULL,
    PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Apple Iwatch Series 4 42MM", "Electronics", 150, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Samsung Gear VR Headset", "Electronics", 99, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES("Google Chrome Book", "Electronics", 141, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Zeiss Camera Lens", "Electronics", 20, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Uno", "Games", 25, 45);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Battleship", "Games", 12, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Connect 4", "Games", 15, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES('Yoda Plush Toy', "Toys", 15, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Play-Doh", "Toys", 10, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Elsa Plush Toy", "Toys", 9, 35);