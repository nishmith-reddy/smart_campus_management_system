-- ============================================================================
-- SMART CAMPUS MANAGEMENT SYSTEM (SCMS) - DATABASE DUMP
-- ============================================================================
-- Database Name: scms
-- Username: postgres (or root)
-- Password: 1234
-- Designed for: PostgreSQL / MySQL / IntelliJ DB Console
-- ============================================================================

-- Create Database (Run this first if scms database does not exist)
-- CREATE DATABASE scms;

-- DROP TABLES IF EXIST (Order respects foreign key dependencies)
DROP TABLE IF EXISTS results CASCADE;
DROP TABLE IF EXISTS fees CASCADE;
DROP TABLE IF EXISTS notices CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS faculty CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'faculty', 'student')) NOT NULL,
    avatar VARCHAR(255),
    department VARCHAR(100),
    contact VARCHAR(50),
    id_number VARCHAR(50),
    status VARCHAR(20) CHECK (status IN ('pending', 'approved')) DEFAULT 'approved'
);

-- ============================================================================
-- 2. STUDENTS TABLE
-- ============================================================================
CREATE TABLE students (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    current_semester INT DEFAULT 1,
    cgpa NUMERIC(3, 2) DEFAULT 0.00,
    contact VARCHAR(50),
    admission_year INT NOT NULL
);

-- ============================================================================
-- 3. FACULTY TABLE
-- ============================================================================
CREATE TABLE faculty (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    specialization VARCHAR(150),
    contact VARCHAR(50)
);

-- ============================================================================
-- 4. COURSES TABLE
-- ============================================================================
CREATE TABLE courses (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    credits INT DEFAULT 3,
    semester INT NOT NULL,
    syllabus TEXT,
    faculty_id VARCHAR(50) REFERENCES faculty(id) ON DELETE SET NULL
);

-- ============================================================================
-- 5. ATTENDANCE TABLE
-- ============================================================================
CREATE TABLE attendance (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
    course_id VARCHAR(50) REFERENCES courses(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(10) CHECK (status IN ('present', 'absent')) NOT NULL,
    remarks VARCHAR(255)
);

-- ============================================================================
-- 6. ASSIGNMENTS TABLE
-- ============================================================================
CREATE TABLE assignments (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    course_id VARCHAR(50) REFERENCES courses(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    max_points INT DEFAULT 100,
    created_by VARCHAR(50) REFERENCES faculty(id) ON DELETE CASCADE
);

-- ============================================================================
-- 7. SUBMISSIONS TABLE
-- ============================================================================
CREATE TABLE submissions (
    id VARCHAR(50) PRIMARY KEY,
    assignment_id VARCHAR(50) REFERENCES assignments(id) ON DELETE CASCADE,
    student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
    submission_date DATE NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('submitted', 'graded')) DEFAULT 'submitted',
    points_obtained INT,
    grade_remarks VARCHAR(255)
);

-- ============================================================================
-- 8. FEES TABLE
-- ============================================================================
CREATE TABLE fees (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    amount NUMERIC(8, 2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(10) CHECK (status IN ('paid', 'unpaid')) DEFAULT 'unpaid',
    payment_date DATE,
    transaction_id VARCHAR(100)
);

-- ============================================================================
-- 9. NOTICES TABLE
-- ============================================================================
CREATE TABLE notices (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(20) CHECK (category IN ('academic', 'exam', 'event', 'general')) DEFAULT 'general',
    date DATE NOT NULL,
    author VARCHAR(100) NOT NULL
);

-- ============================================================================
-- 10. RESULTS TABLE
-- ============================================================================
CREATE TABLE results (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
    course_id VARCHAR(50) REFERENCES courses(id) ON DELETE CASCADE,
    exam_type VARCHAR(50) CHECK (exam_type IN ('Midterm', 'Final Exam', 'Practical', 'Assignment Project')) NOT NULL,
    marks_obtained INT NOT NULL,
    max_marks INT NOT NULL,
    grade VARCHAR(5) NOT NULL,
    remarks VARCHAR(255)
);


-- ============================================================================
-- SEED INITIAL DATA (INSERT VALUES)
-- ============================================================================

-- 1. Insert Users (Password hashes are placeholders for sandbox evaluation)
INSERT INTO users (id, email, password_hash, name, role, avatar, department, contact, id_number, status) VALUES
('u-admin', 'admin@scms.com', 'admin123', 'Dr. Nishmith Reddy', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80', 'Administration', '+1-555-0100', 'SCMS-ADM-01', 'approved'),
('u-faculty-1', 'faculty@scms.com', 'faculty123', 'Prof. Sarah Jenkins', 'faculty', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', 'Computer Science', '+1-555-0201', 'SCMS-FAC-101', 'approved'),
('u-faculty-2', 'chen@scms.com', 'faculty123', 'Dr. Robert Chen', 'faculty', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80', 'Electronics', '+1-555-0202', 'SCMS-FAC-102', 'approved'),
('u-student-1', 'student@scms.com', 'student123', 'Alex Carter', 'student', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80', 'Computer Science', '+1-555-0301', 'SCMS-STU-201', 'approved'),
('u-student-2', 'emily@scms.com', 'student123', 'Emily Watson', 'student', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80', 'Computer Science', '+1-555-0302', 'SCMS-STU-202', 'approved'),
('u-student-3', 'marcus@scms.com', 'student123', 'Marcus Aurelius', 'student', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80', 'Electronics', '+1-555-0303', 'SCMS-STU-203', 'approved'),
('u-student-4', 'chloe@scms.com', 'student123', 'Chloe Bennett', 'student', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80', 'Mechanical', '+1-555-0304', 'SCMS-STU-204', 'approved');

-- 2. Insert Students
INSERT INTO students (id, user_id, name, email, roll_number, department, current_semester, cgpa, contact, admission_year) VALUES
('s-1', 'u-student-1', 'Alex Carter', 'student@scms.com', 'SCMS-STU-201', 'Computer Science', 4, 3.82, '+1-555-0301', 2024),
('s-2', 'u-student-2', 'Emily Watson', 'emily@scms.com', 'SCMS-STU-202', 'Computer Science', 4, 3.95, '+1-555-0302', 2024),
('s-3', 'u-student-3', 'Marcus Aurelius', 'marcus@scms.com', 'SCMS-STU-203', 'Electronics', 6, 3.51, '+1-555-0303', 2023),
('s-4', 'u-student-4', 'Chloe Bennett', 'chloe@scms.com', 'SCMS-STU-204', 'Mechanical', 2, 3.24, '+1-555-0304', 2025);

-- 3. Insert Faculty
INSERT INTO faculty (id, user_id, name, email, employee_id, department, designation, specialization, contact) VALUES
('f-1', 'u-faculty-1', 'Prof. Sarah Jenkins', 'faculty@scms.com', 'SCMS-FAC-101', 'Computer Science', 'Associate Professor', 'Machine Learning & AI', '+1-555-0201'),
('f-2', 'u-faculty-2', 'Dr. Robert Chen', 'chen@scms.com', 'SCMS-FAC-102', 'Electronics', 'Head of Department', 'VLSI Systems & Digital Circuits', '+1-555-0202');

-- 4. Insert Courses
INSERT INTO courses (id, code, name, department, credits, semester, syllabus, faculty_id) VALUES
('c-1', 'CS201', 'Advanced Data Structures', 'Computer Science', 4, 4, 'Balanced trees, heaps, graph search traversals.', 'f-1'),
('c-2', 'CS202', 'Machine Learning Basics', 'Computer Science', 3, 4, 'Regression algorithms, classification, perceptron nets.', 'f-1'),
('c-3', 'EE301', 'Microprocessor Systems', 'Electronics', 4, 6, '8086 micro architecture, Assembly, memory segments.', 'f-2'),
('c-4', 'ME102', 'Fluid Mechanics', 'Mechanical', 4, 2, 'Navier stokes, pipe losses, drag coefficient factors.', 'f-2');

-- 5. Insert Attendance
INSERT INTO attendance (id, student_id, course_id, date, status, remarks) VALUES
('att-1', 's-1', 'c-1', '2026-06-25', 'present', 'Active participation'),
('att-2', 's-1', 'c-1', '2026-06-28', 'present', NULL),
('att-3', 's-1', 'c-1', '2026-06-30', 'absent', 'Medical excuse'),
('att-4', 's-1', 'c-1', '2026-07-02', 'present', NULL),
('att-5', 's-1', 'c-2', '2026-06-26', 'present', NULL),
('att-6', 's-1', 'c-2', '2026-06-29', 'present', NULL),
('att-7', 's-1', 'c-2', '2026-07-01', 'present', NULL),
('att-8', 's-2', 'c-1', '2026-06-25', 'present', NULL),
('att-9', 's-2', 'c-1', '2026-06-28', 'present', NULL),
('att-10', 's-2', 'c-1', '2026-06-30', 'present', NULL),
('att-11', 's-2', 'c-1', '2026-07-02', 'present', NULL),
('att-12', 's-3', 'c-3', '2026-06-24', 'present', NULL),
('att-13', 's-3', 'c-3', '2026-06-27', 'absent', 'No notice'),
('att-14', 's-3', 'c-3', '2026-07-01', 'present', NULL);

-- 6. Insert Assignments
INSERT INTO assignments (id, title, description, course_id, due_date, max_points, created_by) VALUES
('asg-1', 'Balanced Red-Black Trees Implementation', 'Implement Red-Black tree insertion and balancing.', 'c-1', '2026-07-10', 100, 'f-1'),
('asg-2', 'Linear & Logistic Regression Lab Work', 'Plot cost reduction steps with houses dataset.', 'c-2', '2026-07-15', 50, 'f-1'),
('asg-3', '8086 Assembly Matrix Multiplication', 'Perform assembly based array multiplication.', 'c-3', '2026-07-08', 100, 'f-2');

-- 7. Insert Submissions
INSERT INTO submissions (id, assignment_id, student_id, submission_date, content, status, points_obtained, grade_remarks) VALUES
('sub-1', 'asg-1', 's-2', '2026-07-01', 'GitHub Link: github.com/emily-watson/rb-tree-java', 'graded', 98, 'Incredible work on tree rotations.'),
('sub-2', 'asg-2', 's-1', '2026-07-02', 'Notebook: mini-batch comparisons validation MSE = 0.023', 'submitted', NULL, NULL);

-- 8. Insert Fees
INSERT INTO fees (id, student_id, title, amount, due_date, status, payment_date, transaction_id) VALUES
('fee-1', 's-1', 'Semester Tuition Fee - Sem 4', 4500.00, '2026-07-20', 'unpaid', NULL, NULL),
('fee-2', 's-1', 'Campus Infrastructure & Laboratory Fee', 350.00, '2026-07-15', 'paid', '2026-06-20', 'TXN-94021-930'),
('fee-3', 's-2', 'Semester Tuition Fee - Sem 4', 4500.00, '2026-07-20', 'paid', '2026-06-25', 'TXN-59302-120'),
('fee-4', 's-3', 'Semester Tuition Fee - Sem 6', 4800.00, '2026-07-20', 'unpaid', NULL, NULL),
('fee-5', 's-4', 'Semester Tuition Fee - Sem 2', 4200.00, '2026-07-20', 'paid', '2026-06-18', 'TXN-10394-049');

-- 9. Insert Notices
INSERT INTO notices (id, title, content, category, date, author) VALUES
('not-1', 'End-Semester Theory & Practical Exams Schedule', 'The end-semester exams will commence on November 15, 2026.', 'exam', '2026-07-01', 'Office of Controller of Exams'),
('not-2', 'Smart Campus Annual Hackathon 2026 Registrations Open', 'Cash prizes up to $5000 and top recruiter packages.', 'event', '2026-06-28', 'Dr. Nishmith Reddy'),
('not-3', 'Mandatory Placement Orientation', 'Orientation for placement drives in main Auditorium at 2 PM.', 'academic', '2026-07-02', 'Placement Officer'),
('not-4', 'Main IT Server Maintenance', 'Administrative network will be offline for maintenance on July 5.', 'general', '2026-07-02', 'IT Infrastructure Team');

-- 10. Insert Results
INSERT INTO results (id, student_id, course_id, exam_type, marks_obtained, max_marks, grade, remarks) VALUES
('res-1', 's-1', 'c-1', 'Midterm', 88, 100, 'A', 'Good logical deductions'),
('res-2', 's-1', 'c-2', 'Midterm', 45, 50, 'A+', 'Outstanding projects'),
('res-3', 's-2', 'c-1', 'Midterm', 95, 100, 'A+', 'Perfect score algorithm run dry'),
('res-4', 's-3', 'c-3', 'Midterm', 72, 100, 'B', 'Wants improvement in assembly syntax');
