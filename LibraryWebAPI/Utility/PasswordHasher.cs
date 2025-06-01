// Utility/PasswordHasher.cs (Simple example, use BCrypt.Net for production)
using System.Security.Cryptography;
using System.Text;

namespace LibraryWebAPI.Utility
{
    public static class PasswordHasher
    {
        public static string HashPassword(string password)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // Generate a salt (for production, store salt with hash)
                byte[] salt = new byte[16];
                new Random().NextBytes(salt);

                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password + Convert.ToBase64String(salt)));
                return Convert.ToBase64String(bytes) + ":" + Convert.ToBase64String(salt); // Store hash:salt
            }
        }

        public static bool VerifyPassword(string password, string storedHashWithSalt)
        {
            var parts = storedHashWithSalt.Split(':');
            if (parts.Length != 2) return false;

            string storedHash = parts[0];
            string storedSalt = parts[1];

            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password + storedSalt));
                return Convert.ToBase64String(bytes) == storedHash;
            }
        }
    }
}