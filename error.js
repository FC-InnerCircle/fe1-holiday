export class HTTPError extends Error {
  constructor(response) {
    super(`HTTP error! status: ${response.status}`);
    this.code = response.status;
    this.response = response;
  }
}

export const isHTTPError = (error) => error instanceof HTTPError;
