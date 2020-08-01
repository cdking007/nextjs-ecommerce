const baseUrl =
  process.env.NODE_ENV === "production"
    ? "deployment-url.now.sh"
    : "http://localhost:3000";

export default baseUrl;
