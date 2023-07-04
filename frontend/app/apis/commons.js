export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://www.citegraph.io/apis"
    : "http://localhost:8080/apis";
export const DEFAULT_SEARCH_LIMIT = 100;
export const MAX_SEARCH_LIMIT = 1000;