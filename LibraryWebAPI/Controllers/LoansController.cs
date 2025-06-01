using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;
using LibraryWebAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Logging;

namespace LibraryWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LoansController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<LoansController> _logger;

        public LoansController(ApplicationDbContext context, ILogger<LoansController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST: api/loans/issue - Issue a book
        /// <summary>
        /// Issues a new loan for a book to a borrower. Decrements available copies of the book.
        /// </summary>
        /// <param name="request">Details of the loan to issue (BookId, BorrowerId, LoanDurationDays).</param>
        /// <returns>The created LoanDto object and a 201 Created status.</returns>
        [HttpPost("issue")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> IssueLoan([FromBody] IssueLoanRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var book = await _context.Books.FindAsync(request.BookId);
            if (book == null)
            {
                return NotFound($"Book with ID {request.BookId} not found.");
            }
            if (book.AvailableCopies <= 0)
            {
                return BadRequest($"Book '{book.Title}' (ID: {book.Id}) has no available copies for loan.");
            }

            var borrower = await _context.Borrowers.FindAsync(request.BorrowerId);
            if (borrower == null)
            {
                return NotFound($"Borrower with ID {request.BorrowerId} not found.");
            }

            var loan = new Loan
            {
                BookId = request.BookId,
                BorrowerId = request.BorrowerId,
                LoanDate = DateTime.UtcNow, // Ensure this matches your Model's property name exactly
                DueDate = DateTime.UtcNow.AddDays(request.LoanDurationDays),
                ReturnDate = null
            };

            _context.Loans.Add(loan);
            book.AvailableCopies--;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "DbUpdateException occurred during loan issue. Request: BookId={BookId}, BorrowerId={BorrowerId}", request.BookId, request.BorrowerId);
                var innerExceptionMessage = ex.InnerException?.Message ?? "No inner exception details available.";
                _logger.LogError("Inner exception for DbUpdateException: {InnerMessage}", innerExceptionMessage);

                if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new
                    {
                        Message = "An error occurred while saving the loan to the database.",
                        Details = innerExceptionMessage
                    });
                }
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred while saving the loan. Please try again.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred in IssueLoan method.");
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred. Please try again.");
            }

            return CreatedAtAction(nameof(GetLoan), new { id = loan.Id }, new LoanDto
            {
                Id = loan.Id,
                BookId = loan.BookId,
                BookTitle = book.Title,
                BorrowerId = loan.BorrowerId,
                BorrowerName = borrower.Name,
                LoanDate = loan.LoanDate,
                DueDate = loan.DueDate,
                ReturnDate = loan.ReturnDate,
                IsOverdue = loan.DueDate < DateTime.UtcNow && !loan.IsReturned
            });
        }


        // GET: api/loans/{id} - Retrieve a single loan
        /// <summary>
        /// Retrieves a single loan by its ID.
        /// </summary>
        /// <param name="id">The ID of the loan.</param>
        /// <returns>A LoanDto object if found, otherwise NotFound.</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<LoanDto>> GetLoan(int id)
        {
            var loan = await _context.Loans
                                     .Include(l => l.Book)
                                     .Include(l => l.Borrower)
                                     .FirstOrDefaultAsync(l => l.Id == id);

            if (loan == null)
            {
                return NotFound($"Loan with ID {id} not found.");
            }

            return Ok(new LoanDto
            {
                Id = loan.Id,
                BookId = loan.BookId,
                BookTitle = loan.Book!.Title,
                BorrowerId = loan.BorrowerId,
                BorrowerName = loan.Borrower!.Name,
                LoanDate = loan.LoanDate,
                DueDate = loan.DueDate,
                ReturnDate = loan.ReturnDate,
                IsOverdue = loan.DueDate < DateTime.UtcNow && !loan.IsReturned
            });
        }

        // POST: api/loans/returns - Return a book
        /// <summary>
        /// Marks a loan as returned. Increments available copies of the book.
        /// </summary>
        /// <param name="request">Details of the loan to return (LoanId).</param>
        /// <returns>No content (204) if successful, otherwise NotFound or BadRequest.</returns>
        [HttpPost("returns")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ReturnBook([FromBody] ReturnLoanRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loan = await _context.Loans
                                     .Include(l => l.Book)
                                     .FirstOrDefaultAsync(l => l.Id == request.LoanId);

            if (loan == null)
            {
                return NotFound($"Loan with ID {request.LoanId} not found.");
            }

            if (loan.IsReturned)
            {
                return BadRequest("This book has already been returned.");
            }

            if (loan.Book == null)
            {
                _logger.LogError("Associated book for loan ID {LoanId} was null during return operation.", request.LoanId);
                return StatusCode(StatusCodes.Status500InternalServerError, "Associated book not found for this loan.");
            }

            loan.Book.AvailableCopies++;
            loan.ReturnDate = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "DbUpdateException occurred during loan return. Request: LoanId={LoanId}", request.LoanId);
                var innerExceptionMessage = ex.InnerException?.Message ?? "No inner exception details available.";
                _logger.LogError("Inner exception for DbUpdateException: {InnerMessage}", innerExceptionMessage);

                if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new
                    {
                        Message = "An error occurred while saving the loan return to the database.",
                        Details = innerExceptionMessage
                    });
                }
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred while saving the loan return. Please try again.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred in ReturnBook method.");
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred. Please try again.");
            }

            return NoContent();
        }

        // GET: api/loans/overdue - List all overdue loans
        /// <summary>
        /// Retrieves a list of all currently overdue loans.
        /// </summary>
        /// <returns>A list of LoanDto objects for overdue loans.</returns>
        [HttpGet("overdue")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<LoanDto>>> GetOverdueLoans()
        {
            var overdueLoans = await _context.Loans
                                             .Include(l => l.Book)
                                             .Include(l => l.Borrower)
                                             // Fix for "IsReturned" LINQ translation error: use ReturnDate == null
                                             .Where(l => l.DueDate < DateTime.UtcNow && l.ReturnDate == null)
                                             .Select(l => new LoanDto
                                             {
                                                 Id = l.Id,
                                                 BookId = l.BookId,
                                                 BookTitle = l.Book!.Title,
                                                 BorrowerId = l.BorrowerId,
                                                 BorrowerName = l.Borrower!.Name,
                                                 LoanDate = l.LoanDate,
                                                 DueDate = l.DueDate,
                                                 ReturnDate = l.ReturnDate,
                                                 IsOverdue = true // This can be true here because the WHERE clause already filters for overdue and unreturned
                                             })
                                             .ToListAsync();

            return Ok(overdueLoans);
        }
    }
}
