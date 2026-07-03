# 🎓 Smart Campus Management System (SCMS) - IntelliJ & Spring Boot REST API Guide

This project now contains a fully functional, production-ready **Java Spring Boot REST API** in the `/backend` folder alongside the React UI. When you export this project, you can open and run the entire backend in **IntelliJ IDEA**!

---

## 🗂️ Project Structure

```text
├── backend/                       <-- Open this folder in IntelliJ!
│   ├── pom.xml                    <-- Maven dependency manager (Spring Boot 3.2.4)
│   └── src/
│       └── main/
│           ├── java/com/scms/
│           │   ├── ScmsApplication.java  <-- Main application class
│           │   ├── config/
│           │   │   └── CorsConfig.java   <-- Resolves React-to-Java connection
│           │   ├── model/                <-- JPA Entity Models (Users, Students, Courses, etc.)
│           │   ├── repository/           <-- Spring Data JPA Repositories
│           │   └── controller/           <-- REST CRUD Controllers
│           └── resources/
│               └── application.properties <-- Port, dialect, & database credentials
├── scms_schema.sql                <-- Schema DDL & high-quality seed records
├── package.json                   <-- React frontend dependencies
└── src/                           <-- React client components
```

---

## 💻 Step 1: Open the Backend in IntelliJ IDEA

1. Launch **IntelliJ IDEA**.
2. Click **Open** (or **File > Open**).
3. Navigate to the extracted project directory and **select the `backend` folder** (the directory containing `pom.xml`).
4. Click **OK** and open it as a **Maven Project**.
5. Let IntelliJ import dependencies and index files. 

> 💡 **Tip:** Ensure you have the **Lombok** plugin enabled in IntelliJ (standard in modern versions) to avoid boilerplate compilation errors. Go to **Settings > Build, Execution, Deployment > Compiler > Annotation Processors** and check **Enable annotation processing**.

---

## 🗃️ Step 2: Set Up the PostgreSQL Database

The backend is pre-configured to connect to a local PostgreSQL database named `scms` using password `1234`.

1. Open your database console (PostgreSQL CLI, pgAdmin, or IntelliJ Database Explorer) and execute:
   ```sql
   CREATE DATABASE scms;
   ```
2. In IntelliJ, locate `/scms_schema.sql` (at the root of the project).
3. Right-click the file and choose **Run 'scms_schema.sql'** to create the tables and populate the system with high-quality seed data (Admins, Students, Faculty, Courses, Attendance sheets, Invoices, Results, and Bulletin board notices).

---

## 🚀 Step 3: Run the Spring Boot App

1. In IntelliJ, open `/backend/src/main/java/com/scms/ScmsApplication.java`.
2. Click the green **Run** triangle in the gutter next to the `main` method (or press `Shift + F10`).
3. The Spring Boot backend will boot up in under 3 seconds and listen on **`http://localhost:8080`**.

---

## 📡 REST API Endpoint Documentation

All endpoints return JSON responses. Request bodies should be sent with the `Content-Type: application/json` header.

### 🔑 Authentication
* `POST /api/auth/login` - Authenticates a user by email and returns their profile.
  * *Request Body:* `{ "email": "admin@scms.edu", "password": "admin123" }`

### 👥 User Profiles
* `GET /api/users` - List all system users.
* `GET /api/users/{id}` - Fetch single user profile.
* `POST /api/users` - Create a new user profile.
* `PUT /api/users/{id}` - Update a user profile.
* `DELETE /api/users/{id}` - Delete a user.

### 👨‍🎓 Students
* `GET /api/students` - List all student profiles.
* `GET /api/students/user/{userId}` - Fetch student profile by system user ID.
* `POST /api/students` - Register a student.
* `PUT /api/students/{id}` - Update student record (e.g., GPAs, semesters).
* `DELETE /api/students/{id}` - Delete a student.

### 👩‍🏫 Faculty
* `GET /api/faculty` - List all faculty members.
* `GET /api/faculty/user/{userId}` - Fetch faculty details by user ID.
* `POST /api/faculty` - Create a faculty profile.
* `PUT /api/faculty/{id}` - Update specialized fields.

### 📚 Class Courses
* `GET /api/courses` - List all college courses.
* `GET /api/courses/department/{dept}` - Filter courses by department.
* `GET /api/courses/faculty/{id}` - Filter courses assigned to an instructor.
* `POST /api/courses` - Schedule a new course.

### 📅 Class Attendance
* `GET /api/attendance` - Get all logs.
* `GET /api/attendance/student/{id}` - Attendance logs of a student.
* `GET /api/attendance/course/{id}` - Attendance sheets for a course.
* `POST /api/attendance` - Record a single student's attendance.
* `POST /api/attendance/batch` - Save an entire day's classroom sheet (batch of records).

### ✍️ Assignments & Projects
* `GET /api/assignments` - List all published homework assignments.
* `GET /api/assignments/course/{courseId}` - Find assignments for a course.
* `POST /api/assignments` - Add an assignment (Faculty only).

### 📤 Submissions
* `GET /api/submissions` - List all uploaded files/content.
* `GET /api/submissions/student/{id}` - Check submissions completed by a student.
* `GET /api/submissions/assignment/{id}` - View submissions for grading.
* `PUT /api/submissions/{id}` - Grade a student submission and add remarks.

### 💳 Financial Fees
* `GET /api/fees` - List all outstanding and paid fee invoices.
* `GET /api/fees/student/{id}` - Invoices for a specific student.
* `PUT /api/fees/{id}` - Mark invoice as paid with a transaction ID.

### 📢 Notices & Bulletins
* `GET /api/notices` - Fetch the bulletin feed sorted by latest date.
* `POST /api/notices` - Post a new notice announcement.

### 📊 Results & Grades
* `GET /api/results` - Get all transcripts.
* `GET /api/results/student/{id}` - Grade transcript of a student.
* `POST /api/results` - Upload a student grade (Faculty only).

---

## 🌐 Dynamic Frontend Integration

The React UI includes complete, simulated client-side state by default. To connect your frontend directly to your local Spring Boot API, you can swap out the simulated handlers or update your frontend API URLs to point to `http://localhost:8080/api/*`!
