USE bamazon;

CREATE TABLE departments (
	department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs DECIMAL(18, 2) NOT NULL,
    PRIMARY KEY(department_id)
);

INSERT INTO departments
(department_name, over_head_costs)
VALUES("Electronics", 10000);

INSERT INTO departments
(department_name, over_head_costs)
VALUES("Games", 7000);

INSERT INTO departments
(department_name, over_head_costs)
VALUES("Toys", 5500);

SELECT department_id, departments.department_name, over_head_costs, SUM(product_sales) AS product_sales, (SUM(product_sales) - over_head_costs) AS total_profit
FROM products
INNER JOIN departments ON products.department_name = departments.department_name
GROUP BY departments.department_name;