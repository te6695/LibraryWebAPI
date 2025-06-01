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

