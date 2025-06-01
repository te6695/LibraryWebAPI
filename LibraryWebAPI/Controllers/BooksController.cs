using Microsoft.AspNetCore.Mvc;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;
using LibraryWebAPI.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations; // For DTO validation attributes

namespace LibraryWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Requires authentication for all actions in this controller
    public class BooksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BooksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/books - List all books
        /// <summary>
        /// Retrieves a list of all books.
        /// </summary>
        /// <returns>A list of BookDto objects.</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks()
        {
            var books = await _context.Books
                                      .Select(b => new BookDto
                                      {
                                          Id = b.Id,
                                          Title = b.Title,
                                          Author = b.Author,
                                          ISBN = b.ISBN,
                                          AvailableCopies = b.AvailableCopies,
                                          TotalCopies = b.TotalCopies
                                      })
                                      .ToListAsync();
            return Ok(books);
        }

        // GET: api/books/{id} - Retrieve a single book
        /// <summary>
        /// Retrieves a single book by its ID.
        /// </summary>
        /// <param name="id">The ID of the book.</param>
        /// <returns>A BookDto object if found, otherwise NotFound.</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BookDto>> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound($"Book with ID {id} not found.");
            }

            return Ok(new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                Author = book.Author,
                ISBN = book.ISBN,
                AvailableCopies = book.AvailableCopies,
                TotalCopies = book.TotalCopies
            });
        }

        // POST: api/books - Add a new book
        /// <summary>
        /// Adds a new book to the library.
        /// </summary>
        /// <param name="createBookDto">The data for the new book.</param>
        /// <returns>The created BookDto object and a 201 Created status.</returns>
        [HttpPost]
        [Authorize(Roles = "Admin")] // Only Admins can add books
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<BookDto>> AddBook([FromBody] CreateBookDto createBookDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var book = new Book
            {
                Title = createBookDto.Title,
                Author = createBookDto.Author,
                ISBN = createBookDto.ISBN,
                TotalCopies = createBookDto.TotalCopies,
                AvailableCopies = createBookDto.TotalCopies // Crucial: Initialize available copies
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            var bookDto = new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                Author = book.Author,
                ISBN = book.ISBN,
                AvailableCopies = book.AvailableCopies,
                TotalCopies = book.TotalCopies
            };

            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, bookDto);
        }

        // PUT: api/books/{id} - Update book details
        /// <summary>
        /// Updates an existing book's details.
        /// </summary>
        /// <param name="id">The ID of the book to update.</param>
        /// <param name="updateBookDto">The updated book data.</param>
        /// <returns>No content (204) if successful, otherwise NotFound or BadRequest.</returns>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] // Only Admins can update books
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] UpdateBookDto updateBookDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound($"Book with ID {id} not found.");
            }

            if (!string.IsNullOrEmpty(updateBookDto.Title))
                book.Title = updateBookDto.Title;
            if (!string.IsNullOrEmpty(updateBookDto.Author))
                book.Author = updateBookDto.Author;
            if (!string.IsNullOrEmpty(updateBookDto.ISBN))
                book.ISBN = updateBookDto.ISBN;

            if (updateBookDto.TotalCopies.HasValue)
            {
                if (updateBookDto.TotalCopies.Value < 0)
                {
                    return BadRequest("Total copies cannot be negative.");
                }

                int difference = updateBookDto.TotalCopies.Value - book.TotalCopies;
                book.TotalCopies = updateBookDto.TotalCopies.Value;
                book.AvailableCopies += difference;

                // Ensure available copies don't exceed total or go below zero
                if (book.AvailableCopies < 0) book.AvailableCopies = 0;
                if (book.AvailableCopies > book.TotalCopies) book.AvailableCopies = book.TotalCopies;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/books/{id} - Remove a book
        /// <summary>
        /// Deletes a book by its ID.
        /// </summary>
        /// <param name="id">The ID of the book to delete.</param>
        /// <returns>No content (204) if successful, otherwise NotFound or BadRequest.</returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Only Admins can delete books
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound($"Book with ID {id} not found.");
            }

            // Fix for "IsReturned" LINQ translation error: use ReturnDate == null
            var activeLoans = await _context.Loans.AnyAsync(l => l.BookId == id && l.ReturnDate == null);
            if (activeLoans)
            {
                return BadRequest("Cannot delete book: there are active loans associated with it. Please ensure all copies are returned first.");
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookExists(int id)
        {
            return _context.Books.Any(e => e.Id == id);
        }
    }
}
