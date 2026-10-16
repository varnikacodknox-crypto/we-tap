export const MOBILE_LENGTH = 10;

// Keep only digits and cap the length, so letters and extra digits can't be typed.
export const sanitizeMobile = (value) => value.replace(/\D/g, '').slice(0, MOBILE_LENGTH);

export const getMobileError = (value) => {
  const mobile = value.trim();
  if (!mobile) return 'Mobile number is required.';
  if (!/^\d+$/.test(mobile)) return 'Mobile number can contain digits only.';
  if (mobile.length !== MOBILE_LENGTH) return `Mobile number must be ${MOBILE_LENGTH} digits.`;
  return undefined;
};
