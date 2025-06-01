namespace LibraryWebAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty; // Store hashed passwords
        public string Role { get; set; } = "User"; // e.g., "Admin", "User"
    }
}
