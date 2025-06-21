using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PaymentAPI.Data;
using PaymentAPI.Models;

namespace PaymentAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly PaymentDbContext _context;

        public PaymentsController(PaymentDbContext context)
        {
            _context = context;
        }

        // GET: api/Payments/user
        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPaymentsByUserId(
            [FromQuery] string userId,
            [FromQuery] int? fromYear)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID is required.");
            }

            var query = _context.Payments.AsQueryable();

            // Filter by userId as payer or receiver
            query = query.Where(p => p.Payer == userId || p.Receiver == userId);

            // Optional: filter by year
            if (fromYear.HasValue)
            {
                query = query.Where(p => p.Date.Year >= fromYear.Value);
            }

            var payments = await query.OrderByDescending(p => p.Date).ToListAsync();

            return Ok(payments);
        }

        // POST: api/Payments/send
        [HttpPost("send")]
        public async Task<ActionResult<Payment>> SendPayment(SendPaymentRequest request)
        {
            // Validate sender exists
            var sender = await _context.Users.FirstOrDefaultAsync(u => u.AccountId == request.SenderAccountId);
            if (sender == null)
            {
                return BadRequest("Sender account not found");
            }

            // Validate receiver exists
            var receiver = await _context.Users.FirstOrDefaultAsync(u => u.AccountId == request.ReceiverAccountId);
            if (receiver == null)
            {
                return BadRequest("Receiver account not found");
            }

            // Check if sender has sufficient balance
            if (sender.Balance < request.Amount)
            {
                return BadRequest("Insufficient balance");
            }

            // Create payment record
            var payment = new Payment
            {
                Amount = request.Amount,
                Payer = sender.AccountId,
                Receiver = receiver.AccountId,
                Date = DateTime.UtcNow,
                PaymentMethod = "Transfer"
            };

            // Update balances
            sender.Balance -= request.Amount;
            receiver.Balance += request.Amount;

            // Save everything in a transaction
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    _context.Payments.Add(payment);
                    _context.Users.Update(sender);
                    _context.Users.Update(receiver);
                    
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return Ok(payment);
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(500, "Payment failed");
                }
            }
        }

        // GET: api/Payments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetAllPayments()
        {
            return await _context.Payments.OrderByDescending(p => p.Date).ToListAsync();
        }

        // GET: api/Payments/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);

            if (payment == null)
            {
                return NotFound();
            }

            return payment;
        }

        // DELETE: api/Payments/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
            {
                return NotFound();
            }

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    // DTOs
    public class SendPaymentRequest
    {
        public string SenderAccountId { get; set; }
        public string ReceiverAccountId { get; set; }
        public decimal Amount { get; set; }
    }
}