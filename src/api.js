export const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:5000");

const R2_PUBLIC_ORIGIN = "https://media.penielbeachotel.com";

export const api = async (path, options = {}) => {
  const token = localStorage.getItem("peniel_admin_token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed." }));
    throw new Error(error.message);
  }
  return response.status === 204 ? null : response.json();
};

export const imageUrl = (url) => {
  if (url?.startsWith("/uploads/")) return `${API_URL}${url}`;
  if (
    process.env.NODE_ENV === "production" &&
    url?.startsWith(`${R2_PUBLIC_ORIGIN}/`)
  )
    return `/media/${url.slice(R2_PUBLIC_ORIGIN.length + 1)}`;
  return url;
};
