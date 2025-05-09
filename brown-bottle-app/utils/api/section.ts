import Constants from 'expo-constants';

// GET Request that fetches ALL sections
export async function getAllSections() {

  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const baseURL = API_BASE_URL;

  try {
    
    const response = await fetch(`${baseURL}/section/get-all-sections`, {
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
    console.error("Failed to fetch sections:", error);
    throw error;
  }

}