import React, { useState } from "react";
import { getAllPayments } from "./services/paymentService";
import AccountDetails from "./AccountDetails";
import PaymentHistory from "./PaymentHistory";
import SendMoney from "./SendMoney";

const Dashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState("");
  const [userId, setUserId] = useState("user123"); // Replace with actual logged-in user's ID

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await getAllPayments(userId, year);
      setPayments(data);
    } catch (error) {
      console.error("Failed to load payments:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Payment Dashboard</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter year (e.g. 2024)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button onClick={handleSearch} style={{ padding: "8px 16px" }}>
          Search
        </button>
      </div>

      {loading ? (
        <p>Loading payments...</p>
      ) : payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Amount</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Payer</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Receiver</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Method</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>${payment.amount}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{payment.payer}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{payment.receiver}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {new Date(payment.date).toLocaleDateString()}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{payment.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
