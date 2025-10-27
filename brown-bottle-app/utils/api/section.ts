import Constants from 'expo-constants';

import { buildQueryString } from "@/utils/helper";

import { Section } from '@/types/api';

// Fetches data from the section table
export async function getSection(params?: Partial<Section>) {

  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  // Build Query String
  const queryString = buildQueryString(params || {})

  const url = `${API_BASE_URL}/section?${queryString}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data; // JSON Response

  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }

}