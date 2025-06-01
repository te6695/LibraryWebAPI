using System.ComponentModel.DataAnnotations; 
using System.ComponentModel.DataAnnotations.Schema; 

namespace LibraryWebAPI.Models
{
    public class Book
    {
        
        [Key]
        public int Id { get; set; }

    
        [Required]
        [StringLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Author { get; set; } = string.Empty;

       
        [Required]
        [StringLength(20)] 
        public string ISBN { get; set; } = string.Empty;

        
        public int AvailableCopies { get; set; }
        public int TotalCopies { get; set; }

      
    }
}