# Library Management System API

## Overview
This project is a **RESTful backend service** for a library management system, built using **ASP.NET Core**. It provides endpoints for managing books, borrowers, and loan transactions.

## Team/Contributors
Please fill in the names, IDs, and contributions of your team members below:

| Name | ID | Contribution |
|------|----|-------------|
| [Tesfu H/wold] | [1501501] | [all] |
| [Addisu Guche          1500959] |all
| [samrawit G/tensay] | [1501442] | [all] |
| [Ftalew Abate] | [1501210] | [all] |
| [Bisrat] | [1401063] | [all] |

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
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
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
Usage
Once the API is running, you can interact with it using tools like Postman, Insomnia, or by integrating it with a front-end application.

Example: Registering a user with Postman
Method: POST URL: https://localhost:7211/swagger Body (raw, JSON):

json
{
  "username": "admin",
  "password": "admin123"
}
Example: Getting all books (after authentication)
First, POST to /api/auth/login to get a JWT.

Then, make a GET request to https://localhost:5001/api/books.

Include the JWT in the Authorization header as a Bearer token:

Authorization: Bearer <token>
Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.

Create a new branch (git checkout -b feature/your-feature-name).

Make your changes.

Commit your changes (git commit -m "Add new feature").

Push to the branch (git push origin feature/your-feature-name).

Open a Pull Request.
