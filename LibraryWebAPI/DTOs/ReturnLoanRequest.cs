// LibraryWebAPI/DTOs/ReturnLoanRequest.cs
using System.ComponentModel.DataAnnotations;

namespace LibraryWebAPI.DTOs
{
    public class ReturnLoanRequest
    {
        [Required(ErrorMessage = "LoanId is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "LoanId must be a positive integer.")]
        public int LoanId { get; set; }
    }
}
