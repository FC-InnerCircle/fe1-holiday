import { HTTPError } from "./error.js";

export const requestJsonFromUrl = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new HTTPError(res);
  }

  return res.json();
};
