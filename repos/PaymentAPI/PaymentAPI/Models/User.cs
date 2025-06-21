using System.ComponentModel.DataAnnotations;

namespace PaymentAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Username { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Email { get; set; }
        
        [Required]
        public string PasswordHash { get; set; }
        
        [Required]
        [StringLength(20)]
        public string AccountId { get; set; } // This will be the public account ID for transfers
        
        [Required]
        [Range(0, double.MaxValue)]
        public decimal Balance { get; set; } = 0;
        
        [Required]
        public DateTime DateJoined { get; set; } = DateTime.UtcNow;
        
        [Required]
        public bool IsActive { get; set; } = true;
    }
}