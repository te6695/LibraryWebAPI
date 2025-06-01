using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;
using LibraryWebAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;
using LibrarywebAPI.DTOs; // For DTO validation attributes

namespace LibraryWebAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BorrowersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BorrowersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/borrowers - List all borrowers
        /// <summary>
        /// Retrieves a list of all borrowers.
        /// </summary>
        /// <returns>A list of BorrowerDto objects.</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<BorrowerDto>>> GetBorrowers()
        {
            var borrowers = await _context.Borrowers
                                        .Select(b => new BorrowerDto
                                        {
                                            Id = b.Id,
                                            Name = b.Name,
                                            Email = b.Email,
                                            PhoneNumber = b.PhoneNumber
                                        })
                                        .ToListAsync();
            return Ok(borrowers);
        }

        // GET: api/borrowers/{id} - Retrieve a single borrower
        /// <summary>
        /// Retrieves a single borrower by their ID.
        /// </summary>
        /// <param name="id">The ID of the borrower.</param>
        /// <returns>A BorrowerDto object if found, otherwise NotFound.</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BorrowerDto>> GetBorrower(int id)
        {
            var borrower = await _context.Borrowers.FindAsync(id);

            if (borrower == null)
            {
                return NotFound($"Borrower with ID {id} not found.");
            }

            return Ok(new BorrowerDto
            {
                Id = borrower.Id,
                Name = borrower.Name,
                Email = borrower.Email,
                PhoneNumber = borrower.PhoneNumber
            });
        }
        
        // POST: api/borrowers - Add a new borrower
        /// <summary>
        /// Adds a new borrower to the system.
        /// </summary>
        /// <param name="createBorrowerDto">The data for the new borrower.</param>
        /// <returns>The created BorrowerDto object and a 201 Created status.</returns>
        [HttpPost]
        [Authorize(Roles = "Admin")] // Only Admins can add borrowers
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<BorrowerDto>> AddBorrower([FromBody] CreateBorrowerDto createBorrowerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var borrower = new Borrower
            {
                Name = createBorrowerDto.Name,
                Email = createBorrowerDto.Email,
                PhoneNumber = createBorrowerDto.PhoneNumber
            };

            _context.Borrowers.Add(borrower);
            await _context.SaveChangesAsync();

            var borrowerDto = new BorrowerDto
            {
                Id = borrower.Id,
                Name = borrower.Name,
                Email = borrower.Email,
                PhoneNumber = borrower.PhoneNumber
            };

            return CreatedAtAction(nameof(GetBorrower), new { id = borrower.Id }, borrowerDto);
        }

        // PUT: api/borrowers/{id} - Update borrower details
        /// <summary>
        /// Updates an existing borrower's details.
        /// </summary>
        /// <param name="id">The ID of the borrower to update.</param>
        /// <param name="updateBorrowerDto">The updated borrower data.</param>
        /// <returns>No content (204) if successful, otherwise NotFound or BadRequest.</returns>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] // Only Admins can update borrowers
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateBorrower(int id, [FromBody] UpdateBorrowerDto updateBorrowerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var borrower = await _context.Borrowers.FindAsync(id);
            if (borrower == null)
            {
                return NotFound($"Borrower with ID {id} not found.");
            }

            if (!string.IsNullOrEmpty(updateBorrowerDto.Name))
                borrower.Name = updateBorrowerDto.Name;
            if (!string.IsNullOrEmpty(updateBorrowerDto.Email))
                borrower.Email = updateBorrowerDto.Email;
            if (!string.IsNullOrEmpty(updateBorrowerDto.PhoneNumber))
                borrower.PhoneNumber = updateBorrowerDto.PhoneNumber;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BorrowerExists(id))
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

        // DELETE: api/borrowers/{id} - Remove a borrower
        /// <summary>
        /// Deletes a borrower by their ID.
        /// </summary>
        /// <param name="id">The ID of the borrower to delete.</param>
        /// <returns>No content (204) if successful, otherwise NotFound or BadRequest.</returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Only Admins can delete borrowers
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteBorrower(int id)
        {
            var borrower = await _context.Borrowers.FindAsync(id);
            if (borrower == null)
            {
                return NotFound($"Borrower with ID {id} not found.");
            }

            // Fix for "IsReturned" LINQ translation error: use ReturnDate == null
            var activeLoans = await _context.Loans.AnyAsync(l => l.BorrowerId == id && l.ReturnDate == null);
            if (activeLoans)
            {
                return BadRequest("Cannot delete borrower: there are active loans associated with them.");
            }

            _context.Borrowers.Remove(borrower);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BorrowerExists(int id)
        {
            return _context.Borrowers.Any(e => e.Id == id);
        }
    }
}
