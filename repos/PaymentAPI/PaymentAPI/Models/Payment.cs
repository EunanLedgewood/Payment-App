namespace PaymentAPI.Models
{
    using System.ComponentModel.DataAnnotations;
    public class Payment
    {
        
        public int Id { get; set; } //This is the Primary Key

        [Required]
        [Range(0.01,double.MaxValue, ErrorMessage = "Amount must be greater than zero")]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(100)]
        public string Payer { get; set; }

        [Required]
        [StringLength(100)]
        public string Receiver { get; set; }

        [Required]
        public DateTime DateOfPayment { get; set; }

        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; }
    }
}
