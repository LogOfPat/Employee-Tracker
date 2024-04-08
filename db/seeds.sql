INSERT INTO department (name)
VALUES  ('Business'),
        ('Pizza'),
        ('Hamsters');

INSERT INTO role (name, salary, department_id)
VALUES  ('Manager', 3, 1),
        ('The Hamster', 5001, 3),
        ('Pizzaman', 235, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Joe', 'Greg', 3, 3),
        ('Gustavo', 'Frango', 2, 3),
        ('Boss', 'Man', 1, NULL)