
use student_management_db;

-- SELECT s.name, c.Cname
-- FROM students s
-- JOIN enrollments e ON s.SID = e.SID
-- JOIN courses c ON e.CID = c.CID;

-- ALTER TABLE students AUTO_INCREMENT = 1;

-- drop table users;

ALTER TABLE users
ADD CONSTRAINT fk_students_users
FOREIGN KEY (UID)
REFERENCES students(SID);


ALTER TABLE students
ADD COLUMN course varchar(100)  AFTER phone;

ALTER TABLE users
MODIFY role VARCHAR(20) NOT NULL;

alter table students
drop column age;

SELECT * FROM users
ORDER BY UID;

SELECT * FROM students
ORDER BY SID;

SELECT * FROM students s, users u
where s.SID = u.UID;

SELECT * FROM departments
ORDER BY DID;

SELECT * FROM courses
ORDER BY CID;

SELECT * FROM enrollments
ORDER BY EID;

DESC users;
DESC students;
-- SELECT * FROM users WHERE email = 'Mohd@gmail.com';


-- SELECT * FROM courses
-- ORDER BY CID;
-- SHOW TABLE STATUS LIKE 'students';

-- DELETE FROM departments
-- WHERE DID IN (1,6,7,8);

-- SELECT *
-- FROM students s
-- JOIN enrollments e ON s.SID = e.SID
-- JOIN courses c ON e.CID = c.CID;

