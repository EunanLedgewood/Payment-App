import React, { useState } from "react";
import { sendPayment } from "../services/paymentService";

const SendMoney = ({ user, onBalanceUpdate }) => {
  const [formData, setFormData] = useState({
    receiverAccountId: "",
    amount: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [receiverInfo, setReceiverInfo] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage({ text: "", type: "" });
  };

  const lookupReceiver = async () => {
    if (!formData.receiverAccountId) return;

    try {
      const response = await fetch(`http://localhost:5159/api/users/account/${formData.receiverAccountId}`);
      if (response.ok) {
        const userData = await response.json();
        setReceiverInfo(userData);
        setMessage({ text: "", type: "" });
      } else {
        setReceiverInfo(null);
        setMessage({ text: "Account not found", type: "error" });
      }
    } catch (error) {
      console.error("Lookup error:", error);
      setReceiverInfo(null);
      setMessage({ text: "Error looking up account", type: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!receiverInfo) {
      setMessage({ text: "Please verify the receiver's account ID first", type: "error" });
      return;
    }

    if (formData.receiverAccountId === user.accountId) {
      setMessage({ text: "You cannot send money to yourself", type: "error" });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setMessage({ text: "Amount must be greater than zero", type: "error" });
      return;
    }

    if (amount > user.balance) {
      setMessage({ text: "Insufficient balance", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const response = await sendPayment({
        senderAccountId: user.accountId,
        receiverAccountId: formData.receiverAccountId,
        amount: amount
      });

      console.log("Payment response:", response);

      setMessage({ 
        text: `Successfully sent $${amount.toFixed(2)} to ${receiverInfo.username}`, 
        type: "success" 
      });
      setFormData({ receiverAccountId: "", amount: "" });
      setReceiverInfo(null);
      
      // Update the user's balance in the parent component
      if (onBalanceUpdate) {
        onBalanceUpdate(user.balance - amount);
      }

    } catch (error) {
      console.error("Payment error:", error);
      setMessage({ text: error.message || "Payment failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "30px", color: "#333" }}>Send Money</h2>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        gap: "30px"
      }}>
        {/* Send Money Form */}
        <div style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          {message.text && (
            <div style={{
              background: message.type === "success" ? "#d4edda" : "#f8d7da",
              color: message.type === "success" ? "#155724" : "#721c24",
              padding: "15px",
              borderRadius: "5px",
              marginBottom: "20px",
              border: `1px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "25px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
                color: "#333"
              }}>
                Recipient Account ID
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  name="receiverAccountId"
                  value={formData.receiverAccountId}
                  onChange={handleInputChange}
                  placeholder="Enter account ID (e.g. ABC123XYZ4)"
                  required
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    fontSize: "16px",
                    fontFamily: "monospace"
                  }}
                />
                <button
                  type="button"
                  onClick={lookupReceiver}
                  style={{
                    padding: "12px 20px",
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Verify
                </button>
              </div>
              
              {receiverInfo && (
                <div style={{
                  marginTop: "10px",
                  padding: "10px",
                  background: "#d4edda",
                  border: "1px solid #c3e6cb",
                  borderRadius: "5px",
                  color: "#155724"
                }}>
                  ✓ Account found: {receiverInfo.username} ({receiverInfo.email})
                </div>
              )}
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
                color: "#333"
              }}>
                Amount
              </label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "16px",
                  color: "#666"
                }}>
                  $
                </span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  max={user.balance}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 30px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    fontSize: "16px",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !receiverInfo}
              style={{
                width: "100%",
                padding: "15px",
                background: loading || !receiverInfo ? "#ccc" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: loading || !receiverInfo ? "not-allowed" : "pointer",
                transition: "background-color 0.3s"
              }}
            >
              {loading ? "Processing..." : `Send Money`}
            </button>
          </form>
        </div>

        {/* Balance & Info Sidebar */}
        <div>
          {/* Current Balance */}
          <div style={{
            background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            color: "white",
            marginBottom: "20px"
          }}>
            <h3 style={{ marginBottom: "15px", color: "white" }}>Available Balance</h3>
            <div style={{
              fontSize: "28px",
              fontWeight: "bold",
              marginBottom: "5px"
            }}>
              ${user.balance.toFixed(2)}
            </div>
          </div>

          {/* Transaction Info */}
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            <h4 style={{ marginBottom: "15px", color: "#333" }}>Transaction Info</h4>
            <ul style={{
              margin: 0,
              paddingLeft: "20px",
              color: "#666",
              lineHeight: "1.6"
            }}>
              <li>Transfers are instant</li>
              <li>No transaction fees</li>
              <li>All transfers are secure</li>
              <li>Maximum transfer: ${user.balance.toFixed(2)}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;