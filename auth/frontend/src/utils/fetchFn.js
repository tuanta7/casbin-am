import { DEV_BASE_URL } from "./const";

class FetchError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "FetchError";
    this.code = code;
  }
}

async function fetchPublicGet(url, data) {
  const res = await fetch(`${DEV_BASE_URL}${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  switch (res.status) {
    case 204:
      return "";
  }

  const jsonResponse = await res.json();
  if (jsonResponse.status !== "success") {
    throw new FetchError(jsonResponse.message, res.status);
  }
  return jsonResponse.data;
}

async function fetchWithCredentials(url, method, data) {
  const res = await fetch(`${DEV_BASE_URL}${url}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  switch (res.status) {
    case 204:
      return "";
  }

  const jsonResponse = await res.json();
  if (jsonResponse.status !== "success") {
    throw new FetchError(jsonResponse.message, res.status);
  }

  return jsonResponse.data;
}

export { fetchPublicGet, fetchWithCredentials };
