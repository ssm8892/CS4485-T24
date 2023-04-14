#DROP DATABASE IF EXISTS ONLINE_TUTORING;
CREATE DATABASE ONLINE_TUTORING;

USE ONLINE_TUTORING;

#DROP TABLE IF EXISTS student;
CREATE TABLE student (
	student_id varchar(10) NOT NULL,
	student_password varchar(20) NOT NULL,
	first_name varchar(20) NOT NULL,
	last_name varchar(20) NOT NULL,
	email varchar(255) NOT NULL,
	phone_no varchar(10) NOT NULL, 
	profile_pic VARBINARY(500),
	total_tutoring_hours int NOT NULL,
	PRIMARY KEY (student_id)
);

#DROP TABLE IF EXISTS tutor;
CREATE TABLE tutor (
	tutor_id varchar(10) NOT NULL,
	tutor_password varchar(20) NOT NULL,
	first_name varchar(20) NOT NULL,
	last_name varchar(20) NOT NULL,
	email varchar(255) NOT NULL,
	phone_no varchar(10) NOT NULL, 
	profile_pic VARBINARY(500),
	bio varchar(250) NOT NULL,
	subject_expertise varchar(100) NOT NULL, 
	hours_avaliable varchar(100) NOT NULL,
	total_tutoring_hours time NOT NULL,
	PRIMARY KEY (tutor_id)
);

#DROP TABLE IF EXISTS subject;
CREATE TABLE subject (
	subject_id varchar(10) NOT NULL,
    tutor_id varchar(10) NOT NULL,
	course_name varchar(100) NOT NULL,
	course_prefix_no varchar(10) NOT NULL, 
	course_info varchar(2500) NOT NULL,
	PRIMARY KEY (subject_id)
);

#DROP TABLE IF EXISTS appointments;
CREATE TABLE appointments (
	appointment_id varchar(10) NOT NULL,
	date_and_time datetime NOT NULL,
	duration_time int NOT NULL,
	tutor_id varchar(10) NOT NULL,
	student_id varchar(10) NOT NULL,
    subject_id varchar(10) NOT NULL,
	PRIMARY KEY (appointment_id),
	FOREIGN KEY (tutor_id) REFERENCES tutor (tutor_id),
	FOREIGN KEY (student_id) REFERENCES student (student_id),
    FOREIGN KEY (subject_id) REFERENCES subject (subject_id)
);

INSERT INTO student 
	(student_id, student_password, first_name, last_name, email, phone_no, profile_pic, total_tutoring_hours)
VALUES
	('1383957937', 'lolmypassword', 'Bob', 'Smith', 'bob.smith@gmail.com', '2145578734', LOAD_FILE('E:/Images/bob.jpg'), 5),
	('2021200021', 'iloveCS', 'Kevin', 'Boudreaux', 'kevin.boudreaux@gmail.com', '1233457890', LOAD_FILE('E:/Images/Kevin.jpg'), 4),
    ('2021200022', 'CoolKid', 'Evin', 'Jack', 'Evin.Jack@hotmail.com', '1233457891', LOAD_FILE('E:/Images/Evin.jpg'), 22),
    ('2021200023', 'IAmYourFather', 'Brad', 'Owen', 'brad.owen@hotmail.com', '1233457892', LOAD_FILE('E:/Images/pic.jpg'), 12),
    ('2783920483', 'iLoveCupcakes', 'Linda', 'Moore', 'linda.moore@utdallas.edu', '1245612232', LOAD_FILE('E:/Images/LindaMore.jpg'), 52);

INSERT INTO tutor
	(tutor_id, tutor_password, first_name, last_name, email, phone_no, profile_pic, bio, subject_expertise, hours_avaliable, total_tutoring_hours)
VALUES
	('5802759208', 'ChemGod', 'Helen', 'Clyde', 'helen.cylde@yahoo.com', '4589728976', LOAD_FILE('E:/Images/helen.jpg'), 'Hello, my name is Helen Clyde and I am a senior at UTD. I cannot wait to teach you guys!', 'General Chemistry, Organic Chemistry', '2:00 pm - 4:00 pm Tuesday/Thursday, 5:00 pm - 7:00 pm Monday/Wednesday', 45),
    ('0123456789', 'HelloWorld123!', 'Josh', 'Burrim', 'JoshBurrim@utdallas.edu', '1234567890', LOAD_FILE('E:/Images/Josh.jpg'), 'Nice to meet yall, I am super new to this!', 'Intro to CompSCI, Data Structures', '12am-12pm Everyday', 40),
    ('0123436280', 'HelloWorld123!!!', 'Jason', 'Brim', 'Jasonbrim@utdallas.edu','2344567890', LOAD_FILE('E:/Images/Jason.jpg'), 'Nice to meet yall, I am not super new to this, I have years of experience!', 'Linear Algebra, Calculus, and Calculus 2', '2am-6am Thursday', 5),
    ('589201838', 'STEMGirlzRule', 'Samantha', 'Garcia', 'hellosam@gmail.com', '4752288599', LOAD_FILE('E:/Images/sam.jpg'), 'Hey y’all, I am Sam. I am a Bio Major and super excited to get to know you guys!', 'Microbiology, Modern Biology', '8:00 am - 11:00 am Monday/Wednesday, 1:00 pm - 3:00 pm Monday/Wednesday', 45),
    ('0127455739', 'IamaRobot@', 'Randy', 'Calcium', 'Radnycalcium@utdallas.edu', '2783491029', LOAD_FILE('E:/Images/Randy.jpg'), 'I am the best tutor in the whole world!', 'Intro to Physics, Databases, Organic Chemistry', '3pm-7pm Monday/Wednesday', 16);
    
INSERT INTO subject
	(subject_id, tutor_id, course_name, course_prefix_no, course_info)
VALUES
	('0127455739', '5802759208', 'Mechanics', 'PHYS 2325', 'PHYS 2325 (PHYS 2325) Mechanics (3 semester credit hours) Calculus based. Basic physics includes a study of space and time, kinematics, forces, energy and momentum, conservation laws, rotational motion, torques, and harmonic oscillation.'),
	('589201838', '0123456789', 'Introductions to Modern Biology', 'BIOL 2111', 'BIOL 2111 Introduction to Modern Biology Workshop I (1 semester credit hour) Problem solving and discussion related to the subject matter in BIOL 2311.'),
    ('0123436280', '0123436280', 'Linear Algebra', 'MATH 2418', 'MATH 2418 (MATH 2418) Linear Algebra (4 semester credit hours) Introduces and provides models for application of the concepts of vector algebra. Topics include finite dimensional vector spaces and their geometric significance; representing and solving systems of linear equations using multiple methods, including.'),
    ('0123456789', '589201838', 'Data Structures and Introduction to Algorithmic Analysis', 'CS 3345', 'CS 3345 Data Structures and Introduction to Algorithmic Analysis (3 semester credit hours) Analysis of algorithms including time complexity and Big-O notation. Analysis of stacks, queues, and trees, including B-trees. Heaps, hashing, and advanced sorting techniques. Disjoint sets and graphs. Course emphasizes design and implementation.'),
    ('5802759208', '0127455739', 'General Chemistry I ', 'CHEM 1312', 'CHEM 1311 (CHEM 1311) General Chemistry I (3 semester credit hours) Introduction to elementary concepts of chemistry theory. The course emphasizes chemical reactions, the mole concept and its applications, and molecular structure and bonding. Students will also be registered for the exam section.');
    
INSERT INTO appointments
	(appointment_id, date_and_time, duration_time, tutor_id, student_id, subject_id)
VALUES
	('0127458839', '2023-04-04 14:00:00', 1, '5802759208', '2021200022', '0127455739'),
    ('0127459939', '2023-04-24 2:00:00', 1,  '0123456789', '2021200021', '589201838'),
    ('0127411139', '2023-04-23 8:00:00', 1,  '589201838', '1383957937', '0123436280'),
    ('0127422239', '2023-05:15 4:30:00', 2,  '0127455739', '2021200023', '0123456789'),
    ('0127488839', '2023-04-13 5:00:00', 1, '0123436280', '2783920483', '5802759208');
    
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
    