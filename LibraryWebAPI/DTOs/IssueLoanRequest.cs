// LibraryWebAPI/DTOs/IssueLoanRequest.cs
using System.ComponentModel.DataAnnotations;

namespace LibraryWebAPI.DTOs
{
    public class IssueLoanRequest
    {
        [Required(ErrorMessage = "BookId is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "BookId must be a positive integer.")]
        public int BookId { get; set; }

        [Required(ErrorMessage = "BorrowerId is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "BorrowerId must be a positive integer.")]
        public int BorrowerId { get; set; }

        [Required(ErrorMessage = "LoanDurationDays is required.")]
        [Range(1, 365, ErrorMessage = "LoanDurationDays must be between 1 and 365 days.")]
        public int LoanDurationDays { get; set; } = 14; // Default to 14 days
    }
}