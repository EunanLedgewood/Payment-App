using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
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

        // GET: api/Payments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetDbSet()
        {
            if (_context.DbSet == null)
            {
                return NotFound();
            }
            return await _context.DbSet.ToListAsync();
        }

        // GET: api/Payments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPayment(int id)
        {
            if (_context.DbSet == null)
            {
                return NotFound();
            }
            var payment = await _context.DbSet.FindAsync(id);

            if (payment == null)
            {
                return NotFound();
            }

            return payment;
        }

        [HttpGet]
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


        // PUT: api/Payments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayment(int id, Payment payment)
        {
            if (id != payment.Id)
            {
                return BadRequest();
            }

            _context.Entry(payment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Payments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Payment>> PostPayment(Payment payment)
        {
            if (_context.DbSet == null)
            {
                return Problem("Entity set 'PaymentDbContext.DbSet'  is null.");
            }
            _context.DbSet.Add(payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPayment", new { id = payment.Id }, payment);
        }

        // DELETE: api/Payments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            if (_context.DbSet == null)
            {
                return NotFound();
            }
            var payment = await _context.DbSet.FindAsync(id);
            if (payment == null)
            {
                return NotFound();
            }

            _context.DbSet.Remove(payment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymentExists(int id)
        {
            return (_context.DbSet?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
