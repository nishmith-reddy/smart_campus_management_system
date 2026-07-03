-- ============================================================================
-- SMART CAMPUS MANAGEMENT SYSTEM (SCMS) - PostgreSQL Database Schema
-- Database Name: scms
-- Default Password: 1234
-- Designed for use in IntelliJ IDEA, PostgreSQL cli, or pgAdmin
-- ============================================================================

-- Drop tables if they exist to allow clean re-runs
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

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'faculty', 'student')),
    avatar VARCHAR(255),
    department VARCHAR(100),
    contact VARCHAR(50),
    id_number VARCHAR(50), -- Roll Number or Employee ID
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. STUDENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE students (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    current_semester INT NOT NULL CHECK (current_semester BETWEEN 1 AND 8),
    cgpa NUMERIC(3, 2) NOT NULL DEFAULT 0.00 CHECK (cgpa BETWEEN 0.00 AND 4.00),
    contact VARCHAR(50) NOT NULL,
    admission_year INT NOT NULL
);

-- ----------------------------------------------------------------------------
-- 3. FACULTY TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE faculty (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    specialization VARCHAR(150) NOT NULL,
    contact VARCHAR(50) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 4. COURSES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE courses (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    credits INT NOT NULL CHECK (credits BETWEEN 1 AND 5),
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    syllabus TEXT,
    faculty_id VARCHAR(50) REFERENCES faculty(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 5. ATTENDANCE TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE attendance (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
    course_id VARCHAR(50) REFERENCES courses(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(10) NOT NULL CHECK (status IN ('present', 'absent')),
    remarks VARCHAR(255)
);

-- ----------------------------------------------------------------------------
-- 6. ASSIGNMENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE assignments (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    course_id VARCHAR(50) REFERENCES courses(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    max_points INT NOT NULL CHECK (max_points > 0),
    created_by VARCHAR(50) REFERENCES faculty(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 7. SUBMISSIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE submissions (
    id VARCHAR(50) PRIMARY KEY,
    assignment_id VARCHAR(50) REFERENCES assignments(id) ON DELETE CASCADE,
    student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
    submission_date DATE NOT NULL,
    content TEXT NOT NULL, -- Text or resource links
    status VARCHAR(20) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded')),
    points_obtained NUMERIC(5, 2) CHECK (points_obtained >= 0),
    grade_remarks VARCHAR(255)
);

-- ----------------------------------------------------------------------------
-- 8. NOTICES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE notices (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(30) NOT NULL CHECK (category IN ('academic', 'exam', 'event', 'general')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    author VARCHAR(100) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 9. FEES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE fees (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    due_date DATE NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid')),
    payment_date DATE,
    transaction_id VARCHAR(100)
);

-- ----------------------------------------------------------------------------
-- 10. RESULTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE results (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
    course_id VARCHAR(50) REFERENCES courses(id) ON DELETE CASCADE,
    exam_type VARCHAR(50) NOT NULL CHECK (exam_type IN ('Midterm', 'Final Exam', 'Practical', 'Assignment Project')),
    marks_obtained NUMERIC(5, 2) NOT NULL CHECK (marks_obtained >= 0),
    max_marks NUMERIC(5, 2) NOT NULL CHECK (max_marks > 0),
    grade VARCHAR(5) NOT NULL,
    remarks VARCHAR(255)
);


-- ============================================================================
-- INSERT SEED DATA VALUES
-- ============================================================================

-- 1. SEED USERS
INSERT INTO users (id, email, name, role, avatar, department, contact, id_number, status) VALUES
('u-admin', 'admin@scms.edu', 'Director Sarah Connor', 'admin', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80', 'Administration', '+1-555-0101', 'SCMS-ADM-001', 'approved'),
('u-fac-1', 'alan.turing@scms.edu', 'Prof. Alan Turing', 'faculty', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80', 'Computer Science', '+1-555-0202', 'SCMS-FAC-101', 'approved'),
('u-fac-2', 'grace.hopper@scms.edu', 'Dr. Grace Hopper', 'faculty', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80', 'Computer Science', '+1-555-0203', 'SCMS-FAC-102', 'approved'),
('u-stu-1', 'john.doe@scms.edu', 'John Doe', 'student', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80', 'Computer Science', '+1-555-0301', 'SCMS-STU-101', 'approved'),
('u-stu-2', 'jane.smith@scms.edu', 'Jane Smith', 'student', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', 'Computer Science', '+1-555-0302', 'SCMS-STU-102', 'approved'),
('u-stu-3', 'bob.jones@scms.edu', 'Bob Jones', 'student', NULL, 'Computer Science', '+1-555-0303', 'SCMS-STU-103', 'pending');

-- 2. SEED FACULTY (REFERENCES USERS)
INSERT INTO faculty (id, user_id, name, email, employee_id, department, designation, specialization, contact) VALUES
('f-1', 'u-fac-1', 'Prof. Alan Turing', 'alan.turing@scms.edu', 'SCMS-FAC-101', 'Computer Science', 'Professor & Chair', 'Artificial Intelligence & Computation Theory', '+1-555-0202'),
('f-2', 'u-fac-2', 'Dr. Grace Hopper', 'grace.hopper@scms.edu', 'SCMS-FAC-102', 'Computer Science', 'Associate Professor', 'Compiler Design & Programming Methodologies', '+1-555-0203');

-- 3. SEED STUDENTS (REFERENCES USERS)
INSERT INTO students (id, user_id, name, email, roll_number, department, current_semester, cgpa, contact, admission_year) VALUES
('s-1', 'u-stu-1', 'John Doe', 'john.doe@scms.edu', 'SCMS-STU-101', 'Computer Science', 6, 3.82, '+1-555-0301', 2023),
('s-2', 'u-stu-2', 'Jane Smith', 'jane.smith@scms.edu', 'SCMS-STU-102', 'Computer Science', 6, 3.95, '+1-555-0302', 2023);

-- 4. SEED COURSES (REFERENCES FACULTY)
INSERT INTO courses (id, code, name, department, credits, semester, syllabus, faculty_id) VALUES
('c-1', 'CS-301', 'Introduction to Artificial Intelligence', 'Computer Science', 4, 6, 'Foundations of state-space search, heuristics, machine learning algorithms, and deep neural networks with physical lab models.', 'f-1'),
('c-2', 'CS-302', 'Advanced Compiler Architecture', 'Computer Science', 3, 6, 'Detailed study of lexical analyzers, LL/LR parsing tables, syntax-directed translations, code optimization pipelines and LLVM.', 'f-2');

-- 5. SEED ATTENDANCE (REFERENCES STUDENTS, COURSES)
INSERT INTO attendance (id, student_id, course_id, date, status, remarks) VALUES
('att-1', 's-1', 'c-1', '2026-03-01', 'present', 'Arrived on time'),
('att-2', 's-1', 'c-1', '2026-03-02', 'present', NULL),
('att-3', 's-1', 'c-1', '2026-03-03', 'absent', 'Medical excuse submitted'),
('att-4', 's-2', 'c-1', '2026-03-01', 'present', NULL),
('att-5', 's-2', 'c-1', '2026-03-02', 'present', NULL),
('att-6', 's-2', 'c-2', '2026-03-01', 'present', 'Excellent participation');

-- 6. SEED ASSIGNMENTS (REFERENCES COURSES, FACULTY)
INSERT INTO assignments (id, title, description, course_id, due_date, max_points, created_by) VALUES
('asg-1', 'Heuristics & Pathfinding Project', 'Implement A* Search and Alpha-Beta minimax pruning on the Pacman canvas engine. Submit your source files or repository URL.', 'c-1', '2026-03-25', 100, 'f-1'),
('asg-2', 'LL(1) Parser Table Construction', 'Compute FIRST and FOLLOW sets for the provided grammar, and render the complete LL(1) parse table. Show all step derivations.', 'c-2', '2026-03-28', 50, 'f-2');

-- 7. SEED SUBMISSIONS (REFERENCES ASSIGNMENTS, STUDENTS)
INSERT INTO submissions (id, assignment_id, student_id, submission_date, content, status, points_obtained, grade_remarks) VALUES
('sub-1', 'asg-1', 's-1', '2026-03-24', 'https://github.com/johndoe/pacman-search-heuristics', 'graded', 95.00, 'Outstanding path optimization, code is clean and fully documented.'),
('sub-2', 'asg-1', 's-2', '2026-03-25', 'https://github.com/janesmith/scms-alpha-beta-pacman', 'submitted', NULL, NULL);

-- 8. SEED NOTICES
INSERT INTO notices (id, title, content, category, date, author) VALUES
('not-1', 'Midterm Grade Evaluation Reports', 'Dear Students, the Midterm Evaluation transcripts are now uploaded. Review your credits and file any disputes with department chairs.', 'exam', '2026-03-05', 'Office of Registrar'),
('not-2', 'Annual Smart Hackathon 2026 Registration', 'Join our flagship campus tech sprint. Grand prize of $5,000 and direct internship interviews with leading developers.', 'event', '2026-03-08', 'SCMS Tech Club');

-- 9. SEED FEES (REFERENCES STUDENTS)
INSERT INTO fees (id, student_id, title, amount, due_date, status, payment_date, transaction_id) VALUES
('fee-1', 's-1', 'Spring Tuition 2026', 4200.00, '2026-02-15', 'paid', '2026-02-10', 'TXN-98402100'),
('fee-2', 's-1', 'Smart Lab Equipment Levy', 350.00, '2026-03-31', 'unpaid', NULL, NULL),
('fee-3', 's-2', 'Spring Tuition 2026', 4200.00, '2026-02-15', 'paid', '2026-02-12', 'TXN-98402105');

-- 10. SEED RESULTS (REFERENCES STUDENTS, COURSES)
INSERT INTO results (id, student_id, course_id, exam_type, marks_obtained, max_marks, grade, remarks) VALUES
('res-1', 's-1', 'c-1', 'Midterm', 88.00, 100, 'A', 'Strong theoretical conceptualization'),
('res-2', 's-1', 'c-2', 'Midterm', 45.00, 50, 'A+', 'Perfect score on syntax translations'),
('res-3', 's-2', 'c-1', 'Midterm', 94.00, 100, 'A+', 'Brilliant algorithm defense paper');

-- ============================================================================
-- SQL Seed Successful. SCMS Database is Ready!
-- ============================================================================
