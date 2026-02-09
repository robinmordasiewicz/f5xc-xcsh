/**
 * Hex encoding utilities for TCP healthcheck payload fields
 *
 * These utilities handle conversion between plain text and hex-encoded strings
 * for F5 XC API fields that require hex encoding with validation.
 */

/**
 * Detect if string is valid hex (all chars 0-9a-fA-F, optional 0x prefix)
 *
 * @param value - String to check
 * @returns true if valid hex string, false otherwise
 */
export function isHexString(value: string): boolean {
  if (!value) return true; // Empty string is valid

  // Strip optional 0x prefix
  const normalized = value.toLowerCase().startsWith("0x")
    ? value.slice(2)
    : value;

  // Must have even length (hex bytes are 2 chars each)
  if (normalized.length % 2 !== 0) return false;

  // Must contain only hex characters
  return /^[0-9a-f]*$/i.test(normalized);
}

/**
 * Encode plain text string to hex (no 0x prefix)
 *
 * @param text - Plain text to encode
 * @returns Hex-encoded string (uppercase, no prefix)
 * @example encodeToHex("PING") → "50494E47"
 */
export function encodeToHex(text: string): string {
  if (!text) return "";

  return Buffer.from(text, "utf-8").toString("hex").toUpperCase();
}

/**
 * Decode hex string to plain text
 *
 * @param hex - Hex string to decode (with or without 0x prefix)
 * @returns Decoded plain text, or null if decoding fails
 * @example decodeFromHex("50494E47") → "PING"
 */
export function decodeFromHex(hex: string): string | null {
  if (!hex) return "";

  try {
    // Strip optional 0x prefix
    const normalized = hex.toLowerCase().startsWith("0x") ? hex.slice(2) : hex;

    // Validate it's proper hex
    if (!isHexString(normalized)) return null;

    return Buffer.from(normalized, "hex").toString("utf-8");
  } catch {
    return null;
  }
}

/**
 * Normalize hex string: strip 0x prefix, validate format, convert to uppercase
 *
 * @param value - Hex string to normalize
 * @returns Normalized hex string (no prefix, uppercase)
 * @throws Error if invalid hex format
 * @example normalizeHex("0x50494e47") → "50494E47"
 */
export function normalizeHex(value: string): string {
  if (!value) return "";

  // Strip optional 0x prefix
  const normalized = value.toLowerCase().startsWith("0x")
    ? value.slice(2)
    : value;

  // Validate hex format
  if (!isHexString(normalized)) {
    throw new Error(
      "Invalid hexadecimal string. Must contain only 0-9, a-f, A-F and have even length",
    );
  }

  return normalized.toUpperCase();
}

/**
 * Check if decoded hex is printable ASCII (0x20-0x7E)
 *
 * @param text - Text to check
 * @returns true if all characters are printable ASCII
 */
export function isPrintableAscii(text: string): boolean {
  if (!text) return true;

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    // Printable ASCII range: space (0x20) to tilde (0x7E)
    if (code < 0x20 || code > 0x7e) {
      return false;
    }
  }

  return true;
}

/**
 * Smart conversion: auto-detect if hex or plain text
 *
 * - If valid hex: normalize (strip 0x, uppercase)
 * - If plain text: encode to hex
 *
 * @param value - User input (hex or plain text)
 * @returns Hex string ready for API (no 0x prefix, uppercase)
 * @throws Error if hex is invalid or exceeds max length
 * @example toApiHex("PING") → "50494E47" (plain text encoded)
 * @example toApiHex("50494e47") → "50494E47" (hex normalized)
 * @example toApiHex("0x50494e47") → "50494E47" (hex with prefix)
 */
export function toApiHex(value: string): string {
  if (!value) return "";

  let hexValue: string;

  // If value starts with 0x prefix, user intends it as hex - validate strictly
  if (value.toLowerCase().startsWith("0x")) {
    if (!isHexString(value)) {
      throw new Error(
        `Invalid hexadecimal string. Value with 0x prefix must contain only 0-9, a-f, A-F and have even length`,
      );
    }
    hexValue = normalizeHex(value);
  } else if (isHexString(value)) {
    // Input is valid hex without prefix - normalize it
    hexValue = normalizeHex(value);
  } else {
    // Input is plain text - encode it
    hexValue = encodeToHex(value);
  }

  // Validate max length (API limit: 2048 chars)
  if (hexValue.length > 2048) {
    throw new Error(
      `Hex payload exceeds maximum length of 2048 characters (got ${hexValue.length})`,
    );
  }

  return hexValue;
}

/**
 * Format hex for display: decode if printable, otherwise show hex
 *
 * @param hex - Hex string from API
 * @returns Decoded text if printable, otherwise hex string
 * @example formatHexForDisplay("50494E47") → "PING" (printable)
 * @example formatHexForDisplay("00FF00FF") → "00FF00FF" (non-printable)
 */
export function formatHexForDisplay(hex: string): string {
  if (!hex) return "";

  const decoded = decodeFromHex(hex);

  // If decoding failed, show hex as-is
  if (decoded === null) return hex;

  // If decoded text is printable ASCII, show it
  if (isPrintableAscii(decoded)) return decoded;

  // Otherwise, show hex
  return hex;
}
