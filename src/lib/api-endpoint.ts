const PROD_ENDPOINT = "https://fill.papermc.io";

function getApiEndpoint() {
  if (import.meta.env.DEV) {
    if (import.meta.env.VITE_USE_PROD_ENDPOINT === "true") {
      return PROD_ENDPOINT;
    }
    return "http://localhost:8080";
  }
  return PROD_ENDPOINT;
}

export const API_ENDPOINT = getApiEndpoint();
