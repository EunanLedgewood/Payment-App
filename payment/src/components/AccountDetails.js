import React from "react";

const AccountDetails = ({ user }) => {
  const calculateMembershipDuration = (joinDate) => {
    const now = new Date();
    const joined = new Date(joinDate);
    const diffTime = Math.abs(now - joined);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months === 1 ? '' : 's'}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years === 1 ? '' : 's'}${remainingMonths > 0 ? ` and ${remainingMonths} month${remainingMonths === 1 ? '' : 's'}` : ''}`;
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "30px", color: "#333" }}>Account Details</h2>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px"
      }}>
        {/* Account Info Card */}
        <div style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginBottom: "20px", color: "#667eea" }}>Account Information</h3>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "5px" }}>
              Account ID
            </label>
            <div style={{
              padding: "10px",
              background: "#f8f9fa",
              borderRadius: "5px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#333",
              fontFamily: "monospace"
            }}>
              {user.accountId}
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "5px" }}>
              Username
            </label>
            <div style={{
              padding: "10px",
              background: "#f8f9fa",
              borderRadius: "5px",
              fontSize: "16px",
              color: "#333"
            }}>
              {user.username}
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "5px" }}>
              Email
            </label>
            <div style={{
              padding: "10px",
              background: "#f8f9fa",
              borderRadius: "5px",
              fontSize: "16px",
              color: "#333"
            }}>
              {user.email}
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          color: "white"
        }}>
          <h3 style={{ marginBottom: "20px", color: "white" }}>Current Balance</h3>
          
          <div style={{
            fontSize: "36px",
            fontWeight: "bold",
            marginBottom: "10px"
          }}>
            ${user.balance.toFixed(2)}
          </div>
          
          <div style={{
            fontSize: "14px",
            opacity: "0.9"
          }}>
            Available for transactions
          </div>
        </div>

        {/* Membership Info Card */}
        <div style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginBottom: "20px", color: "#667eea" }}>Membership</h3>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "5px" }}>
              Member Since
            </label>
            <div style={{
              padding: "10px",
              background: "#f8f9fa",
              borderRadius: "5px",
              fontSize: "16px",
              color: "#333"
            }}>
              {new Date(user.dateJoined).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "5px" }}>
              Membership Duration
            </label>
            <div style={{
              padding: "10px",
              background: "#f8f9fa",
              borderRadius: "5px",
              fontSize: "16px",
              color: "#333",
              fontWeight: "bold"
            }}>
              {calculateMembershipDuration(user.dateJoined)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;