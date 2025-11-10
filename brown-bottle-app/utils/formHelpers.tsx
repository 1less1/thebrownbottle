// Input: phone number string
// Output: formatted phone number string (XXX-XXX-XXXX)
export const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
};

// Input: phone string
// Output: true or false depending on phone formatting (XXX-XXX-XXXX)
export const isValidPhone = (phone: string) => {
  return /^\d{3}-\d{3}-\d{4}$/.test(phone);
};

// Input: email string
// Output: true or false depending on email formatting (email@domain.com)
export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Input: wage string
// Output: formatted wage string (00.00)
export const formatWage = (value: string) => {
  // Remove invalid characters
  const cleaned = value.replace(/[^0-9.]/g, "");

  // Prevent multiple dots
  const parts = cleaned.split(".");
  if (parts.length > 2) return parts[0] + "." + parts[1];

  // Limit to two decimal places
  if (parts[1]?.length > 2) {
    parts[1] = parts[1].slice(0, 2);
  }

  return parts.join(".");
};