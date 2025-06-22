using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PaymentAPI.Data;
using PaymentAPI.Models;
using System.Security.Cryptography;
using System.Text;

namespace PaymentAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly PaymentDbContext _context;

        public UsersController(PaymentDbContext context)
        {
            _context = context;
        }

        // POST: api/Users/register
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(RegisterRequest request)
        {
            // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest("Username already exists");
            }

            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest("Email already exists");
            }

            // Generate unique account ID
            string accountId;
            do
            {
                accountId = GenerateAccountId();
            } while (await _context.Users.AnyAsync(u => u.AccountId == accountId));

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = HashPassword(request.Password),
                AccountId = accountId,
                Balance = 1000.00m, // Give new users $1000 to start
                DateJoined = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Don't return password hash
            var userResponse = new UserResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                AccountId = user.AccountId,
                Balance = user.Balance,
                DateJoined = user.DateJoined
            };

            return Ok(userResponse);
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public async Task<ActionResult<UserResponse>> Login(LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username && u.IsActive);

            if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid username or password");
            }

            var userResponse = new UserResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                AccountId = user.AccountId,
                Balance = user.Balance,
                DateJoined = user.DateJoined
            };

            return Ok(userResponse);
        }

        // GET: api/Users/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponse>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null || !user.IsActive)
            {
                return NotFound();
            }

            var userResponse = new UserResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                AccountId = user.AccountId,
                Balance = user.Balance,
                DateJoined = user.DateJoined
            };

            return Ok(userResponse);
        }

        // GET: api/Users/account/{accountId}
        [HttpGet("account/{accountId}")]
        public async Task<ActionResult<UserResponse>> GetUserByAccountId(string accountId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.AccountId == accountId && u.IsActive);

            if (user == null)
            {
                return NotFound("Account not found");
            }

            var userResponse = new UserResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                AccountId = user.AccountId,
                Balance = user.Balance,
                DateJoined = user.DateJoined
            };

            return Ok(userResponse);
        }

        // PUT: api/Users/{id}/balance
        [HttpPut("{id}/balance")]
        public async Task<IActionResult> UpdateBalance(int id, UpdateBalanceRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null || !user.IsActive)
            {
                return NotFound();
            }

            user.Balance = request.NewBalance;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private string GenerateAccountId()
        {
            // Generate a 10-character alphanumeric account ID
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 10)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "PaymentAppSalt"));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        private bool VerifyPassword(string password, string hash)
        {
            return HashPassword(password) == hash;
        }
    }

    // DTOs
    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class UserResponse
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string AccountId { get; set; } = string.Empty;
        public decimal Balance { get; set; }
        public DateTime DateJoined { get; set; }
    }

    public class UpdateBalanceRequest
    {
        public decimal NewBalance { get; set; }
    }
}