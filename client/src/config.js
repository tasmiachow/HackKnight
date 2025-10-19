// client/src/config.js

// If VITE_BACKEND_URL exists (on Render), use that.
// Otherwise, fall back to localhost.
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:10000";

export default BACKEND_URL;