# Library Management System API

## Overview
This project is a **RESTful backend service** for a library management system, built using **ASP.NET Core**. It provides endpoints for managing books, borrowers, and loan transactions.

## Team/Contributors

| Name | ID | Contribution |
|------|----|-------------|
| [Tesfu H/wold] | [1501501] | [all] |
| [Addisu Guche   |1500959       |all
| [samrawit G/tensay] | [1501442] | [all] |
| [Ftalew Abate] | [1501210] | [all] |
| [Bisrat Endalew] | [1401063] | [all] |

## Learning Objectives
- Implement **event-driven and asynchronous** patterns in **ASP.NET Core Web API**.
- Model domain entities using **Entity Framework Core (Code First)**.
- Secure endpoints with **JWT-based authentication/authorization**.
- Implement **input validation, error handling, and logging middleware**.
- *(Optional Bonus)* Integrate a **React/Angular/Blazor front-end**.

## Installation & Setup
### Prerequisites:
- .NET 6 or later
- SQL Server or SQLite
- Postman (optional for testing API endpoints)

### Steps:

Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login and receive JWT
Books API
Method	Endpoint	Description
GET	/api/books	List all books
GET	/api/books/{id}	Retrieve a specific book by ID
POST	/api/books	Add a new book
PUT	/api/books/{id}	Update details of an existing book by ID
DELETE	/api/books/{id}	Remove a book by ID
Borrowers API
Method	Endpoint	Description
GET	/api/borrowers	List all borrowers
POST	/api/borrowers	Add a new borrower
GET	/api/borrowers/{id}	Get details of a specific borrower by ID
Loans API
Method	Endpoint	Description
POST	/api/loans	Issue a book to a borrower
POST	/api/returns	Return a borrowed book
GET	/api/loans/overdue	List all currently overdue loans




===>Here's a clear step-by-step guide to run your full-stack application (both backend and frontend):

1. Run the Backend (ASP.NET Core API)
Option A: Using Visual Studio
Open LibrarySolution.sln in Visual Studio

Right-click the LibraryWebAPI project → Set as Startup Project

Press F5 or the green "Run" button (uses HTTPS)

Check it's running at: https://localhost:5001 (or http://localhost:7211)

Option B: Using Command Line
bash
cd <directory>
dotnet run
Runs on http://localhost:7211 for me /other

2. Run the Frontend (React App)
In a NEW terminal window:
bash
cd <directory>

npm start
Automatically opens http://localhost:3000

3. Verify Both Are Running
Component	URL	How to Check
Backend	http://localhost:7211	Visit /api/books in browser
Frontend	http://localhost:3000	Should show login page
4. Troubleshooting
If backend fails:
Check database connection in appsettings.json:

json
"ConnectionStrings": {
  "DefaultConnection": "Server=servername;Database=databasename;Trusted_Connection=True;TrustServerCertificate=true;"
}
Apply migrations:

bash
dotnet ef database update
If frontend fails to connect:
Check library-client/src/api/api.js:

javascript
const API_URL = 'http://localhost:7211/api';  // Must match backend URL
5. Default Login Credentials
Use these to test:

Username: admin

Password: Admin123

Key Notes:
Run both simultaneously (backend first, then frontend)

Different terminals - One for backend, one for frontend

First-time setup requires npm install and dotnet restore

