﻿
namespace LibraryWebAPI.DTOS
{
    namespace LibraryWebAPI.DTOs
    {
        public class AuthResponse
        {
            public string Username { get; set; } = string.Empty;
            public string Token { get; set; } = string.Empty;
            public string Role { get; set; } = string.Empty; 
        }
    }
}