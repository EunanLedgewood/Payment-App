import React, { useState } from "react";
import AccountDetails from "./AccountDetails";
import PaymentHistory from "./PaymentHistory";
import SendMoney from "./SendMoney";

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("account");

  const tabs = [
    { id: "account", label: "Account" },
    { id: "payments", label: "Payments" },
    { id: "send", label: "Send Money" }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountDetails user={user} />;
      case "payments":
        return <PaymentHistory user={user} />;
      case "send":
        return <SendMoney user={user} />;
      default:
        return <AccountDetails user={user} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* Header */}
      <div style={{
        background: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        padding: "0 20px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px 0"
        }}>
          <h1 style={{ margin: 0, color: "#333" }}>PaymentApp</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <span style={{ color: "#666" }}>Welcome, {user.username}</span>
            <button
              onClick={onLogout}
              style={{
                padding: "8px 16px",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        background: "white",
        borderBottom: "1px solid #eee"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px"
        }}>
          <div style={{ display: "flex", gap: "0" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "15px 25px",
                  background: activeTab === tab.id ? "#667eea" : "transparent",
                  color: activeTab === tab.id ? "white" : "#666",
                  border: "none",
                  borderBottom: activeTab === tab.id ? "3px solid #667eea" : "3px solid transparent",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: activeTab === tab.id ? "bold" : "normal",
                  transition: "all 0.3s"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px 20px"
      }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;