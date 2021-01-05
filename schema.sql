DROP DATABASE IF EXISTS Employee_TrackerDB;

CREATE DATABASE Employee_TrackerDB;

USE Employee_TrackerDB;

CREATE TABLE department(
id integer auto_increment not null,
name varchar(30) not null,
primary key(id)
);

CREATE TABLE role(
id integer auto_increment not null,
title varchar(30) not null,
salary decimal not null,
department_id Integer not null,
constraint fk_department_id foreign key (department_id) references department(id),
primary key(id)
);


CREATE TABLE employee(
id integer auto_increment not null,
first_name varchar(30) not null,
last_name varchar(30) not null,
role_id integer not null,
constraint fk_role_id FOREIGN KEY (role_id) REFERENCES role(id),
manager_id integer ,
constraint fk_manager_id FOREIGN KEY (manager_id) REFERENCES employee(id),
Primary key(id)
);

select * from employee;
select * from role;
select * from department;

INSERT into department (name)
VALUES ("Salesperson");
INSERT into department (name)
VALUES ("Engineer");
INSERT into department (name)
VALUES ("Financial");
INSERT into department (name)
VALUES ("Manager");

select * from department;

INSERT into role (title, salary, department_id)
VALUES ("Sales Lead", 40000, 1);
INSERT into role (title, salary, department_id)
VALUES ("Salesperson", 35000, 2);
INSERT into role (title, salary, department_id)
VALUES ("Lead Engineer", 75000, 3);
INSERT into role (title, salary, department_id)
VALUES ("Manager", 65000, 4);

select * from role;

INSERT into employee (first_name, last_name, role_id)
values ("Bob", "Ross", 1); 
INSERT into employee (first_name, last_name, role_id)
values ("Donald", "Duck", 2);
INSERT into employee (first_name, last_name, role_id)
values ("Will", "Smith", 3);
INSERT into employee (first_name, last_name, role_id)
values ("Kevin", "Ross", 4);
INSERT into employee (first_name, last_name, role_id)
values ("Bobby", "Shmoney", 1);


select * from employee;



