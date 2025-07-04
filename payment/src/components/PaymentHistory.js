import React, { useState, useEffect } from "react";

const PaymentHistory = ({ user }) => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadPayments();
    }, [user.accountId]);

    const loadPayments = async (searchYear = "") => {
        console.log("🔄 Starting to load payments...");

        try {
            const isSearch = searchYear !== undefined && searchYear !== "";

            if (isSearch) {
                setSearchLoading(true);
            } else {
                setLoading(true);
            }

            setError("");

            const queryParams = new URLSearchParams({ userId: user.accountId });
            if (searchYear) {
                queryParams.append("fromYear", searchYear);
            }

            const url = `http://localhost:5159/api/payments/user?${queryParams}`;
            console.log("📞 Making API call to:", url);

            const response = await fetch(url);
            console.log("📝 Response status:", response.status);

            if (!response.ok) {
                throw new Error(`Failed to fetch payments: ${response.status}`);
            }

            const data = await response.json();
            console.log("✅ Payment data received:", data);
            console.log("📊 Number of payments:", data.length);

            setPayments(data);

        } catch (error) {
            console.error("❌ Error loading payments:", error);
            setError(error.message);
        } finally {
            console.log("🏁 Finished loading payments");
            setLoading(false);
            setSearchLoading(false);
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

    console.log("🎨 Rendering PaymentHistory - Loading:", loading, "Payments count:", payments.length);

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <h2>Loading payment history...</h2>
                <p>User Account ID: {user.accountId}</p>
                <div style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
                    If this is taking too long, check the browser console for details.
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <h2 style={{ color: "red" }}>Error loading payments</h2>
                <p>{error}</p>
                <button
                    onClick={() => loadPayments()}
                    style={{
                        padding: "10px 20px",
                        background: "#667eea",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Retry
                </button>
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
                <h2 style={{ margin: 0, color: "#333" }}>
                    Payment History ({payments.length} payments)
                </h2>

                {/* Search Controls */}
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                        type="text"
                        placeholder="Enter year (e.g. 2025)"
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
                    {payments.map((payment, index) => (
                        <div
                            key={payment.id || index}
                            style={{
                                padding: "20px",
                                borderBottom: index < payments.length - 1 ? "1px solid #eee" : "none",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
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
                                    Method: {payment.paymentMethod} | ID: {payment.id}
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
            )}
        </div>
    );
};

export default PaymentHistory;