import { storageClient } from "./storageClient";

/**
 * Storage, for `localStorage` and `sessionStorage`
 */
export const storage = {
  l: storageClient(),
  s: storageClient(true),
};

export default storage;
