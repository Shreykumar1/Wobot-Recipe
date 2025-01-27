import getToken from "./getToken";

export async function signUpPOST(credentials) {
  try {
    const response = await fetch(
      "/api/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error("Sign up failed");
      error.status = response.status;
      error.info = errorText;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
}

export async function loginPOST(credentials) {
  try {
    const response = await fetch(
      "/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );

    if (!response.ok) {
      const errorInfo = await response.json();
      const error = new Error("Login failed");
      error.status = response.status;
      error.info = errorInfo;
      console.log(error);
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}
