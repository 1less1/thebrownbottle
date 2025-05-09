import Constants from "expo-constants";

// GET Request that fetches ALL roles
export async function getAllRoles() {

  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const baseURL = API_BASE_URL;

  try {
    
    const response = await fetch(`${baseURL}/role/get-all-roles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", 
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;

  } catch (error) {
    console.error("Failed to fetch roles:", error);
    throw error;
  }
  
}
    
    