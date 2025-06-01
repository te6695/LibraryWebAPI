// LibraryWebAPI/DTOs/CreateBookDto.cs
using System.ComponentModel.DataAnnotations;

namespace LibraryWebAPI.DTOs
{
    public class CreateBookDto
    {
        [Required(ErrorMessage = "Title is required.")]
        [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Author is required.")]
        [StringLength(100, ErrorMessage = "Author cannot exceed 100 characters.")]
        public string Author { get; set; } = string.Empty;

        [Required(ErrorMessage = "ISBN is required.")]
        [StringLength(17, MinimumLength = 10, ErrorMessage = "ISBN must be between 10 and 17 characters.")]
        public string ISBN { get; set; } = string.Empty;

        [Required(ErrorMessage = "TotalCopies is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "TotalCopies must be at least 1.")]
        public int TotalCopies { get; set; }
    }
}









