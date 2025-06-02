CREATE TABLE Books (
    Id INT PRIMARY KEY IDENTITY(1,1), 
    Title VARCHAR(255) NOT NULL,
    Author VARCHAR(255) NOT NULL,
    ISBN VARCHAR(13) UNIQUE
    TotalCopies INT NOT NULL DEFAULT 0,
    AvailableCopies INT NOT NULL DEFAULT 0
);

CREATE TABLE Borrowers (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE, 
    Phone VARCHAR(20)
);

CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARBINARY(MAX) NOT NULL, 
   
    PasswordSalt VARBINARY(MAX) NOT NULL, 
    
    Role VARCHAR(50) NOT NULL 
);

CREATE TABLE Loans (
    Id INT PRIMARY KEY IDENTITY(1,1), 
    BookId INT NOT NULL,
    BorrowerId INT NOT NULL,
    LoanDate DATE NOT NULL,
    DueDate DATE NOT NULL,
    ReturnDate DATE, 
    FOREIGN KEY (BookId) REFERENCES Books(Id),
    FOREIGN KEY (BorrowerId) REFERENCES Borrowers(Id)
);


