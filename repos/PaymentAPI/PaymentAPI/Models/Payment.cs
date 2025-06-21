using System.ComponentModel.DataAnnotations;

namespace PaymentAPI.Models
{
    public class Payment
    {
        public int Id { get; set; } // Primary Key

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero")]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(100)]
        public string Payer { get; set; }

        [Required]
        [StringLength(100)]
        public string Receiver { get; set; }

        [Required]
        public DateTime Date { get; set; } = DateTime.UtcNow; // Changed from DateOfPayment to Date

        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; } = "Transfer";
    }
}