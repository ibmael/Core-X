export interface UploadImagePayload {
  url?: string;
  imageUrl?: string;
  path?: string;
  location?: string;
  secure_url?: string;
}

/**
 * The upload API may return the image URL in several shapes.
 * This interface covers the known variants so the service can
 * extract the URL without resorting to `unknown` or `any`.
 */
export interface UploadImageApiResponse {
  payload?: UploadImagePayload | string;
  data?: UploadImagePayload | string;
  url?: string;
  imageUrl?: string;
}
