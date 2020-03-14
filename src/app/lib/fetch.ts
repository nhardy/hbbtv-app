/**
 * Takes a fetch response and either returns resolved {@code Response}
 * if {@code 200 <= response.status < 300}, or otherwise a rejected
 * Promise with the status and response.
 * @param {Response} response
 */
export function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  }
  const error = new Error(response.statusText);
  error.status = response.status;
  error.response = response;
  return Promise.reject(error);
}
