DROP DATABASE IF EXISTS ONLINE_TUTORING;
CREATE DATABASE ONLINE_TUTORING;

USE ONLINE_TUTORING;

DROP TABLE IF EXISTS student;
CREATE TABLE student (
	student_id varchar(10) NOT NULL,
	student_password varchar(200) NOT NULL,
	first_name varchar(20) NOT NULL,
	last_name varchar(20) NOT NULL,
	email varchar(255) NOT NULL,
	phone_no varchar(10) NOT NULL, 
	profile_pic varchar(500),
	total_tutoring_hours int NOT NULL,
	PRIMARY KEY (student_id)
);

DROP TABLE IF EXISTS tutor;
CREATE TABLE tutor (
	tutor_id varchar(10) NOT NULL,
	tutor_password varchar(200) NOT NULL,
	first_name varchar(20) NOT NULL,
	last_name varchar(20) NOT NULL,
	email varchar(255) NOT NULL,
	phone_no varchar(10) NOT NULL, 
	profile_pic varchar(500),
	bio varchar(250) NOT NULL,
	subject_expertise varchar(100) NOT NULL, 
    days_available varchar(100) NOT NULL,
	hours_available varchar(500) NOT NULL,
	total_tutoring_hours int NOT NULL,
	PRIMARY KEY (tutor_id)
);

DROP TABLE IF EXISTS subject;
CREATE TABLE subject (
	subject_id varchar(10) NOT NULL,
    tutor_id varchar(10) NOT NULL,
	course_name varchar(100) NOT NULL,
	course_prefix_no varchar(10) NOT NULL, 
	course_info varchar(2500) NOT NULL,
	PRIMARY KEY (subject_id)
);

DROP TABLE IF EXISTS appointments;
CREATE TABLE appointments (
	appointment_id varchar(10) NOT NULL,
	written_date varchar(100) NOT NULL,
    written_time varchar(500) NOT NULL,
	duration_time int NOT NULL,
	tutor_name varchar(100) NOT NULL,
	student_name varchar(100) NOT NULL,
    subject_name varchar(100) NOT NULL,
	PRIMARY KEY (appointment_id)
);

DROP TABLE IF EXISTS favorites;
CREATE TABLE favorites (
    student_fname varchar(100) not null,
    student_lname varchar(100) not null,
    student_email varchar(100) not null, 
    tutor_name varchar(100) not null
);

INSERT INTO student 
	(student_id, student_password, first_name, last_name, email, phone_no, profile_pic, total_tutoring_hours)
VALUES
	('1383957937', CONCAT('*', UPPER(SHA1(UNHEX(SHA1('lolmypassword'))))), 'Bob', 'Smith', 'bob.smith@gmail.com', '2145578734', "", 5),
	('2021200021', CONCAT('*', UPPER(SHA1(UNHEX(SHA1('iloveCS'))))), 'Kevin', 'Boudreaux', 'kevin.boudreaux@gmail.com', '1233457890', "", 4),
    ('2021200022', CONCAT('*', UPPER(SHA1(UNHEX(SHA1('CoolKid'))))), 'Evin', 'Jack', 'Evin.Jack@hotmail.com', '1233457891', "", 22),
    ('2021200023', CONCAT('*', UPPER(SHA1(UNHEX(SHA1('IAmYourFather'))))), 'Brad', 'Owen', 'brad.owen@hotmail.com', '1233457892', "", 12),
    ('2783920483', CONCAT('*', UPPER(SHA1(UNHEX(SHA1('iLoveCupcakes'))))), 'Linda', 'Moore', 'linda.moore@utdallas.edu', '1245612232', "", 52);

INSERT INTO tutor
	(tutor_id, tutor_password, first_name, last_name, email, phone_no, profile_pic, bio, subject_expertise, days_available, hours_available, total_tutoring_hours)
VALUES
	('5802759208', CONCAT('*', UPPER(SHA1(UNHEX(SHA1('ChemGod'))))), 'Helen', 'Clyde', 'helen.cylde@yahoo.com', '4589728976', "", 'Hello, my name is Helen Clyde and I am a senior at UTD. I cannot wait to teach you guys!', 'General Chemistry, Organic Chemistry', 'Monday, Tuesday, Wednesday, Thursday', '2:00 PM - 4:00 PM, 4:00 PM - 6:00 PM', 45),
    ('0123456789', CONCAT('*', UPPER(SHA1(UNHEX(SHA1('HelloWorld123!'))))), 'Josh', 'Burrim', 'JoshBurrim@utdallas.edu', '1234567890', "", 'Nice to meet yall, I am super new to this!', 'Intro to CompSCI, Data Structures', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday', '10:00 AM - 12:00 PM , 12:00 PM - 2:00 PM, 2:00 PM - 4:00 PM, 4:00 PM - 6:00 PM, 6:00 PM - 8:00 PM, 8:00 PM - 10:00 PM', 40),
    ('0123436280', CONCAT('*', UPPER(SHA1(UNHEX(SHA1('HelloWorld123!!!'))))), 'Jason', 'Brim', 'Jasonbrim@utdallas.edu','2344567890', "", 'Nice to meet yall, I am not super new to this, I have years of experience!', 'Linear Algebra, Calculus, and Calculus 2', 'Thursday', '2:00 PM - 4:00 PM', 5),
    ('589201838', CONCAT('*', UPPER(SHA1(UNHEX(SHA1('STEMGirlzRule'))))), 'Samantha', 'Garcia', 'hellosam@gmail.com', '4752288599', "", 'Hey y’all, I am Sam. I am a Bio Major and super excited to get to know you guys!', 'Microbiology, Modern Biology', 'Monday, Wednesday', '10:00 AM - 12:00 PM, 12:00 PM - 2:00 PM, 2:00 - 4:00', 45),
    ('0127455739', CONCAT('*', UPPER(SHA1(UNHEX(SHA1('IamaRobot@'))))), 'Randy', 'Calcium', 'Radnycalcium@utdallas.edu', '2783491029', "", 'I am the best tutor in the whole world!', 'Intro to Physics, Databases, Organic Chemistry','Monday, Wednesday', '2:00 PM - 4:00 PM, 4:00 PM - 6:00 PM, 6:00 PM - 8:00 PM', 16);
    
INSERT INTO subject
	(subject_id, tutor_id, course_name, course_prefix_no, course_info)
VALUES
	('0127455739', '5802759208', 'Mechanics', 'PHYS 2325', 'PHYS 2325 (PHYS 2325) Mechanics (3 semester credit hours) Calculus based. Basic physics includes a study of space and time, kinematics, forces, energy and momentum, conservation laws, rotational motion, torques, and harmonic oscillation.'),
	('589201838', '0123456789', 'Introductions to Modern Biology', 'BIOL 2111', 'BIOL 2111 Introduction to Modern Biology Workshop I (1 semester credit hour) Problem solving and discussion related to the subject matter in BIOL 2311.'),
    ('0123436280', '0123436280', 'Linear Algebra', 'MATH 2418', 'MATH 2418 (MATH 2418) Linear Algebra (4 semester credit hours) Introduces and provides models for application of the concepts of vector algebra. Topics include finite dimensional vector spaces and their geometric significance; representing and solving systems of linear equations using multiple methods, including.'),
    ('0123456789', '589201838', 'Data Structures and Introduction to Algorithmic Analysis', 'CS 3345', 'CS 3345 Data Structures and Introduction to Algorithmic Analysis (3 semester credit hours) Analysis of algorithms including time complexity and Big-O notation. Analysis of stacks, queues, and trees, including B-trees. Heaps, hashing, and advanced sorting techniques. Disjoint sets and graphs. Course emphasizes design and implementation.'),
    ('5802759208', '0127455739', 'General Chemistry I ', 'CHEM 1312', 'CHEM 1311 (CHEM 1311) General Chemistry I (3 semester credit hours) Introduction to elementary concepts of chemistry theory. The course emphasizes chemical reactions, the mole concept and its applications, and molecular structure and bonding. Students will also be registered for the exam section.');

select * from tutor;
select * from favorites;

# insert into appointments (appointment_id, written_date, written_time, duration_time, tutor_name, student_name, subject_name) values('9999999999', 'Saturday, May 6, 2023', '12:00 PM - 2:00 PM', 2, 'Helen Clyde', 'Thomas Kahng', 'Chemistry');
select * from appointments;


ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
    