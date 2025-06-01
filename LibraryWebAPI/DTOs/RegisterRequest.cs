namespace LibraryWebAPI.DTOs
{
    // DTOs/RegisterRequest.cs
    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // DTOs/LoginRequest.cs
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // DTOs/AuthResponse.cs
    public class AuthResponse
    {
        public string Username { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string Role { get; internal set; }
    }
}
