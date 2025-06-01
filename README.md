 Library Management System API

 Overview
This project is a RESTful backend service for a library management system, built using **ASP.NET Core**. It provides endpoints for managing books, borrowers, and loan transactions.

 Team Members
 name                      Id
- [Tesfu Habtewold]  1501501
- [Addisu Guche]    
- [Ftalew Abate]

 Learning Objectives
- Implement event-driven and asynchronous patterns in **ASP.NET Core Web API**.
- Model domain entities using **Entity Framework Core (Code First)**.
- Secure endpoints with **JWT-based authentication/authorization**.
- Implement input validation, error handling, and logging middleware.
- *(Optional Bonus)* Integrate a **React/Angular/Blazor front-end**.

Installation & Setup
 Prerequisites:
- .NET 6 or later
- SQL Server or SQLite
- Postman (optional for testing)

Install dependencies:
dotnet restore

-Apply database migrations:
dotnet ef database update
Run the project:
-dotnet run
API Endpoints
-Authentication
-Method	Endpoint	Description
.POST	/api/auth/register	Register a new user
.POST	/api/auth/login	Login & receive JWT
                .Books API
.Method	Endpoint	Description
GET	/api/books	List all books
GET	/api/books/{id}	Retrieve a book
POST	/api/books	Add a book
PUT	/api/books/{id}	Update book details
DELETE	/api/books/{id}	Remove a book
                .Borrowers API
Method	Endpoint	Description
GET	/api/borrowers	List all borrowers
POST	/api/borrowers	Add a borrower
GET	/api/borrowers/{id}	Get borrower details
               .Loans API
Method	Endpoint	Description
POST	/api/loans	Issue a book
POST	/api/returns	Return a book
GET	/api/loans/overdue	List overdue loans
