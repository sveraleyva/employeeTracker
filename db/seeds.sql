use employeetracker_db;

INSERT INTO departments
    (name)
VALUES
    ("SALES"),
    ("ENGINEERING"),
    ("FINANCE"),
    ("LEGAL");

INSERT INTO roles
    (title, salary, department_id)
VALUES
    ("Sales lead", 100000, 1),
    ("Salesperson", 80000, 1),
    ("Lead Engineer", 150000, 2),
    ("Software Engineer", 120000, 2),
    ("Account Manager", 160000, 3),
    ("Accountant", 125000, 3),
    ("Legal Team Lead", 250000, 4),
    ("Lawyer", 190000, 4);

INSERT INTO employees
    (first_name, last_name, role_id, manager_id)
VALUES 
    ("John", "Doe", 1, NULL),
    ("Mike", "Chen", 2, 1),
    ("Ashley", "Garcia", 3, NULL),
    ("Kevin", "Tupic", 4, 3),
    ("Malia", "Dai", 5, NULL),
    ("Sarah", "Miller", 6, 5),
    ("Lisa", "Tyer", 7, NULL),
    ("Matt", "Murdock", 8, 7);
