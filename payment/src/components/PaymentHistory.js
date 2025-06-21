import React, { useState, useEffect } from "react";
import { getAllPayments } from "../services/paymentService";

const PaymentHistory = ({ user }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    loadPayments();
  }, [user.accountId]);

  const loadPayments = async (searchYear = "") => {
    const isSearch = searchYear !== undefined;
    if (isSearch) {
      setSearchLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await getAllPayments(user.accountId, searchYear);
      setPayments(data);
    } catch (error) {
      console.error("Failed to load payments:", error);
    } finally {
      if (isSearch) {
        setSearchLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleSearch = () => {
    loadPayments(year);
  };

  const clearSearch = () => {
    setYear("");
    loadPayments("");
  };

  const getPaymentType = (payment) => {
    return payment.payer === user.accountId ? "Sent" : "Received";
  };

  const getPaymentAmount = (payment) => {
    const type = getPaymentType(payment);
    return type === "Sent" ? `-$${payment.amount.toFixed(2)}` : `+$${payment.amount.toFixed(2)}`;
  };

  const getPaymentColor = (payment) => {
    const type = getPaymentType(payment);
    return type === "Sent" ? "#dc3545" : "#28a745";
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading payment history...</h2>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
      }}>
        <h2 style={{ margin: 0, color: "#333" }}>Payment History</h2>
        
        {/* Search Controls */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Enter year (e.g. 2024)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "14px",
              width: "150px"
            }}
          />
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            style={{
              padding: "10px 20px",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: searchLoading ? "not-allowed" : "pointer",
              fontSize: "14px"
            }}
          >
            {searchLoading ? "Searching..." : "Search"}
          </button>
          {year && (
            <button
              onClick={clearSearch}
              style={{
                padding: "10px 15px",
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {payments.length === 0 ? (
        <div style={{
          background: "white",
          padding: "50px",
          borderRadius: "10px",
          textAlign: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ color: "#666", marginBottom: "10px" }}>No payments found</h3>
          <p style={{ color: "#999" }}>
            {year ? `No payments found for year ${year}` : "You haven't made any payments yet"}
          </p>
        </div>
      ) : (
        <div style={{
          background: "white",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          overflow: "hidden"
        }}>
          <div style={{
            padding: "20px",
            borderBottom: "1px solid #eee",
            background: "#f8f9fa"
          }}>
            <h3 style={{ margin: 0, color: "#333" }}>
              {payments.length} payment{payments.length === 1 ? '' : 's'} found
              {year && ` for year ${year}`}
            </h3>
          </div>

          <div style={{ maxHeight: "600px", overflowY: "auto" }}>
            {payments.map((payment, index) => (
              <div
                key={payment.id || index}
                style={{
                  padding: "20px",
                  borderBottom: index < payments.length - 1 ? "1px solid #eee" : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#f8f9fa"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    marginBottom: "8px"
                  }}>
                    <span style={{
                      background: getPaymentType(payment) === "Sent" ? "#fee" : "#efe",
                      color: getPaymentColor(payment),
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}>
                      {getPaymentType(payment)}
                    </span>
                    <span style={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}>
                      {getPaymentType(payment) === "Sent" 
                        ? `To: ${payment.receiver}` 
                        : `From: ${payment.payer}`
                      }
                    </span>
                  </div>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    {new Date(payment.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
                    Method: {payment.paymentMethod}
                  </div>
                </div>
                
                <div style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: getPaymentColor(payment),
                  textAlign: "right"
                }}>
                  {getPaymentAmount(payment)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;