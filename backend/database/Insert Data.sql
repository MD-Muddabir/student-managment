
use student_management_db;

INSERT INTO students (sname, semail, gender, dob, sphone, CID) VALUES
('Shazeb', 'shazeb@gmail.com', 'Male', '2001-06-05', '7894561238', 2),
('Ayaan Khan', 'ayaan.khan@gmail.com', 'Male', '2005-05-09', '9876543210', 1),
('Sara Ali', 'sara.ali@gmail.com', 'Female', '2000-10-11', '9123456780', NULL),
('Mohd Zaid', 'zaid.mohd@gmail.com', 'Male', '2002-12-12', '9988776655', 2),
('Fatima Noor', 'fatima.noor@gmail.com', 'Female', '2001-06-05', '9090909090', 2);


INSERT INTO departments(DID, DNAME) VALUES
(1, 'Computer Science'),
(2, 'Information Technology'),
(3, 'Electronics'),
(4, 'Mechanical Engineering');

INSERT INTO courses(cname) VALUES
('Web Development'),
('Internet of Things (IoT)'),
('Cloud Computing'),
('Artificial Intelligence (AI)'),
('Data Science'),
('Cyber Security');

INSERT INTO enrollments(SID, CID) VALUES
(1, 1),  -- Ayaan → Web Development
(1, 2),  -- Ayaan → Data Structures
(2, 1),  -- Sara → Web Development
(3, 3),  -- Zaid → Cloud Computing
(4, 2),  -- Fatima → Data Structures
(4, 3);  -- Fatima → Cloud Computing

INSERT INTO users(uname, uemail, upassword, gender) VALUES
('ADMIN','ADMIN@gmail.com','admin123','Male'),
('STAFF1','STAFF@GMAIL.COM','staff1234','Female');

SELECT * FROM students;
SELECT * FROM departments;
SELECT * FROM courses;
SELECT * FROM enrollments;