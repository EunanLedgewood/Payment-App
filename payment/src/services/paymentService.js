const API_BASE_URL = "http://localhost:5159";

// User authentication services
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Login failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Registration failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Payment services
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
      `${API_BASE_URL}/api/payments/user?${queryParams}`
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

// Send money between accounts
export const sendPayment = async (paymentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Payment failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Send payment error:", error);
    throw error;
  }
};

// Get user information
export const getUserInfo = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    return await response.json();
  } catch (error) {
    console.error("Get user info error:", error);
    throw error;
  }
};

// Get user by account ID
export const getUserByAccountId = async (accountId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/account/${accountId}`);

    if (!response.ok) {
      throw new Error("User not found");
    }

    return await response.json();
  } catch (error) {
    console.error("Get user by account ID error:", error);
    throw error;
  }
};