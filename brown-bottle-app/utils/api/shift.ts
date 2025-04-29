// This file will send a request to the backend python api which will fetch shift info 

import Constants from 'expo-constants';

export async function getShifts() {
  
  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const base_url = API_BASE_URL;

  try {
    console.log(base_url);
    const response = await fetch(`${base_url}/shifts`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data; // This will be your JSON response from Flask
  } catch (error) {
    console.error("Failed to fetch shifts:", error);
    throw error;
  }

}

export async function getTables() {

  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const base_url = API_BASE_URL;

  try {
    const response = await fetch(`${base_url}/tables`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data; // This will be your JSON response from Flask
  } catch (error) {
    console.error("Failed to fetch tables:", error);
    throw error;
  }

}

