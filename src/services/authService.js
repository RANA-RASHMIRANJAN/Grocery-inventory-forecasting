// Authentication adapter boundary for future Spring Boot integration.
// Demo access is intentionally owned by AuthContext and is not real authentication.
export const signIn = async () => {
  throw new Error('Backend authentication is not configured. Use the labelled demo access.');
};
