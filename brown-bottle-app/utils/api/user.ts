import Constants from "expo-constants";

// Gets a particular user's employee data with a GET Request
export async function getUserData(employee_id: number) {

  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const baseURL = API_BASE_URL;

  try {
    // Sending the assignee_id as a query parameter in the URL
    const response = await fetch(`${baseURL}/employee?employee_id=${employee_id}`, {
      method: "GET", // GET is appropriate for fetching data
      headers: {
        "Content-Type": "application/json", // Ensure the backend understands the content type
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    return data; // This will be the JSON response from Flask, containing the task ID

  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }

}