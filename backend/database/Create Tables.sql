-- CREATE DATABASE student_management_db;
-- SHOW DATABASES;
USE student_management_db;



-- Create table departments(
-- 	DID int auto_increment primary key,
--     Dname varchar(100) not null unique,
--     created_at timestamp default current_timestamp
--     );


--             
-- 	Create table enrollments (
-- 	EID int auto_increment primary key,
--     SID int not null,
--     CID int not null,
--     enrollment_date Date default (current_date),
--      
-- 		foreign key (SID)
--  			references students(SID)
--              On delete CASCADE,
--  		 		foreign key (CID)
--  			references courses(CID)
--              On delete CASCADE,
--              
--  		unique(SID, CID)
-- 		);



	Create table users (
	UID int auto_increment primary key,
		uname varchar(50) unique not null,
		upassword varchar(255) not null,
		gender varchar(10) ,
		created_at timestamp default current_timestamp
    )ENGINE=InnoDB;
-- ALTER TABLE users
-- ADD COLUMN uemail VARCHAR(100) UNIQUE AFTER uname;

Create table students (
	SID int auto_increment primary Key,
    sname varchar(100) Not Null,
    semail Varchar(100) unique not null,
    gender varchar(10),
    dob date ,
    sphone varchar(15),
    CID int,
    created_at timestamp default current_timestamp,
    
            foreign key (CID)
			references courses(CID)
            On delete Set null
            )ENGINE=InnoDB;

CREATE TABLE courses (
    CID INT AUTO_INCREMENT PRIMARY KEY,
    Cname VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
    
-- DROP DATABASE student_management_db;

-- DELETE FROM enrollments;
-- DELETE FROM students;
-- DELETE FROM courses;
-- DELETE FROM departments;
-- DELETE FROM users;

-- TRUNCATE TABLE enrollments;
-- TRUNCATE TABLE students;
-- TRUNCATE TABLE courses;
-- TRUNCATE TABLE departments;
-- TRUNCATE TABLE users;


--  Remove the Foreign Keys
-- Remove Students Foreign key
-- Step 1: Show the foreign key constraint name

-- SELECT
--    CONSTRAINT_NAME
-- FROM information_schema.KEY_COLUMN_USAGE
-- WHERE TABLE_NAME = 'students'
-- AND TABLE_SCHEMA = 'student_management_db';
  -- O/P : enrollments_ibfk_2
-- Step 2: Drop the Foreign Key Constraint

-- ALTER TABLE enrollments
-- DROP FOREIGN KEY enrollments_ibfk_2;

-- SHOW INDEX FROM enrollments;

-- ALTER TABLE enrollments DROP FOREIGN KEY enrollments_ibfk_2;

-- drop table students;

-- Reomve Course Foeign key
-- Step 1: Show the foreign key constraint name

-- SELECT
--   CONSTRAINT_NAME
-- FROM information_schema.KEY_COLUMN_USAGE
-- WHERE TABLE_NAME = 'enrollments'
--   AND TABLE_SCHEMA = 'student_management_db';
  
-- Step 2: Drop the Foreign Key Constraint

-- ALTER TABLE users
-- DROP FOREIGN KEY fk_students_users;

-- SHOW INDEX FROM enrollments;

-- ALTER TABLE users DROP FOREIGN KEY fk_students_users;


-- Reomve departments Foeign key
-- Step 1: Show the foreign key constraint name

-- SELECT
--    CONSTRAINT_NAME
--  FROM information_schema.KEY_COLUMN_USAGE
--  WHERE TABLE_NAME = 'courses'
--    AND TABLE_SCHEMA = 'student_management_db';
  -- O/P: courses_ibfk_1
-- Step 2: Drop the Foreign Key Constraint

-- ALTER TABLE courses
-- DROP FOREIGN KEY courses_ibfk_1;

-- SHOW INDEX FROM courses;

-- ALTER TABLE courses DROP FOREIGN KEY courses_ibfk_1;

