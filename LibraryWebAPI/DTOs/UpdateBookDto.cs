// LibraryWebAPI/DTOs/UpdateBookDto.cs
using System.ComponentModel.DataAnnotations;

namespace LibraryWebAPI.DTOs
{
    public class UpdateBookDto
    {
        // Properties are nullable to allow partial updates
        [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
        public string? Title { get; set; }

        [StringLength(100, ErrorMessage = "Author cannot exceed 100 characters.")]
        public string? Author { get; set; }

        [StringLength(17, MinimumLength = 10, ErrorMessage = "ISBN must be between 10 and 17 characters.")]
        public string? ISBN { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "TotalCopies must be a non-negative number.")]
        public int? TotalCopies { get; set; } // Nullable int
    }
}