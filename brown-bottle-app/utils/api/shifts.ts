// This file will send a request to the backend python api which will fetch shift info 

import { API_URL, API_PORT } from '@env';

export async function getShifts() {

  const base_url = `${API_URL}:${API_PORT}`;

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

  const base_url = `${API_URL}:${API_PORT}`;

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

