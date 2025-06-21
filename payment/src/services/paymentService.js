const API_BASE_URL = "https://localhost:7159";

export const createPayment = async (paymentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error("Failed to create payment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

// Get all payments for a specific user, optionally filtered by year
export const getAllPayments = async (userId, fromYear) => {
  try {
    const queryParams = new URLSearchParams({ userId });
    if (fromYear) {
      queryParams.append("fromYear", fromYear);
    }

    const response = await fetch(
      `http://localhost:5159/api/payments/user?${queryParams}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch payments");
    }

    return await response.json();
  } catch (error) {
    console.error("getAllPayments error:", error);
    throw error;
  }
};
