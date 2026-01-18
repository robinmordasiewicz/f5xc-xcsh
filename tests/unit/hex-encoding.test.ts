import { describe, it, expect } from "vitest";
import {
  isHexString,
  encodeToHex,
  decodeFromHex,
  normalizeHex,
  toApiHex,
  isPrintableAscii,
  formatHexForDisplay,
} from "../../src/utils/hex-encoding";

describe("hex encoding utilities", () => {
  describe("isHexString", () => {
    it("detects valid hex without prefix", () => {
      expect(isHexString("50494E47")).toBe(true);
      expect(isHexString("00FF00FF")).toBe(true);
      expect(isHexString("deadbeef")).toBe(true);
      expect(isHexString("DEADBEEF")).toBe(true);
    });

    it("detects valid hex with 0x prefix", () => {
      expect(isHexString("0x50494E47")).toBe(true);
      expect(isHexString("0x00FF00FF")).toBe(true);
      expect(isHexString("0xDEADBEEF")).toBe(true);
    });

    it("handles empty string", () => {
      expect(isHexString("")).toBe(true);
    });

    it("rejects non-hex strings", () => {
      expect(isHexString("PING")).toBe(false);
      expect(isHexString("0xGGGG")).toBe(false);
      expect(isHexString("hello world")).toBe(false);
      expect(isHexString("xyz")).toBe(false);
    });

    it("rejects odd-length hex (incomplete bytes)", () => {
      expect(isHexString("50494E4")).toBe(false);
      expect(isHexString("0x123")).toBe(false);
      expect(isHexString("F")).toBe(false);
    });
  });

  describe("encodeToHex", () => {
    it("encodes plain text to hex", () => {
      expect(encodeToHex("PING")).toBe("50494E47");
      expect(encodeToHex("Hello")).toBe("48656C6C6F");
      expect(encodeToHex("OK")).toBe("4F4B");
    });

    it("handles empty string", () => {
      expect(encodeToHex("")).toBe("");
    });

    it("handles special characters", () => {
      expect(encodeToHex("\n")).toBe("0A");
      expect(encodeToHex(" ")).toBe("20");
      expect(encodeToHex("\r\n")).toBe("0D0A");
    });

    it("encodes multi-byte UTF-8", () => {
      expect(encodeToHex("café")).toBe("636166C3A9");
    });

    it("encodes numbers as text", () => {
      expect(encodeToHex("123")).toBe("313233");
    });
  });

  describe("decodeFromHex", () => {
    it("decodes hex to plain text", () => {
      expect(decodeFromHex("50494E47")).toBe("PING");
      expect(decodeFromHex("48656C6C6F")).toBe("Hello");
      expect(decodeFromHex("4F4B")).toBe("OK");
    });

    it("handles lowercase hex", () => {
      expect(decodeFromHex("50494e47")).toBe("PING");
      expect(decodeFromHex("4f4b")).toBe("OK"); // Hex is case-insensitive, decodes to uppercase ASCII
    });

    it("handles hex with 0x prefix", () => {
      expect(decodeFromHex("0x50494E47")).toBe("PING");
      expect(decodeFromHex("0x4F4B")).toBe("OK");
    });

    it("handles empty string", () => {
      expect(decodeFromHex("")).toBe("");
    });

    it("returns null for invalid hex", () => {
      expect(decodeFromHex("GGGG")).toBe(null);
      expect(decodeFromHex("50494E4")).toBe(null); // Odd length
      expect(decodeFromHex("xyz")).toBe(null);
    });

    it("decodes special characters", () => {
      expect(decodeFromHex("0A")).toBe("\n");
      expect(decodeFromHex("20")).toBe(" ");
      expect(decodeFromHex("0D0A")).toBe("\r\n");
    });
  });

  describe("normalizeHex", () => {
    it("strips 0x prefix", () => {
      expect(normalizeHex("0x50494E47")).toBe("50494E47");
      expect(normalizeHex("0x4F4B")).toBe("4F4B");
    });

    it("passes through hex without prefix", () => {
      expect(normalizeHex("50494E47")).toBe("50494E47");
      expect(normalizeHex("4F4B")).toBe("4F4B");
    });

    it("converts to uppercase", () => {
      expect(normalizeHex("50494e47")).toBe("50494E47");
      expect(normalizeHex("0x50494e47")).toBe("50494E47");
      expect(normalizeHex("deadbeef")).toBe("DEADBEEF");
    });

    it("handles empty string", () => {
      expect(normalizeHex("")).toBe("");
      expect(normalizeHex("0x")).toBe("");
    });

    it("throws on invalid hex", () => {
      expect(() => normalizeHex("GGGG")).toThrow(/Invalid hexadecimal string/);
      expect(() => normalizeHex("50494E4")).toThrow(/Invalid hexadecimal string/); // Odd length
      expect(() => normalizeHex("hello")).toThrow(/Invalid hexadecimal string/);
    });
  });

  describe("toApiHex", () => {
    it("detects and normalizes hex input", () => {
      expect(toApiHex("50494E47")).toBe("50494E47");
      expect(toApiHex("0x50494E47")).toBe("50494E47");
      expect(toApiHex("deadbeef")).toBe("DEADBEEF");
    });

    it("detects and encodes plain text", () => {
      expect(toApiHex("PING")).toBe("50494E47");
      expect(toApiHex("Hello")).toBe("48656C6C6F");
      expect(toApiHex("OK")).toBe("4F4B");
    });

    it("handles edge cases", () => {
      expect(toApiHex("")).toBe("");
      expect(toApiHex("0x")).toBe("");
    });

    it("handles ambiguous all-hex words (treats as hex)", () => {
      // "CAFE" could be plain text or hex - auto-detect treats as hex
      expect(toApiHex("CAFE")).toBe("CAFE");
      expect(toApiHex("DEAD")).toBe("DEAD");
      expect(toApiHex("BEEF")).toBe("BEEF");
    });

    it("handles numbers (treats as hex if valid hex format)", () => {
      // "123" is odd length, so invalid hex → treats as plain text
      expect(toApiHex("12")).toBe("12"); // Valid hex, even length
      expect(toApiHex("1234")).toBe("1234"); // Valid hex, even length
    });

    it("throws on exceeding max length", () => {
      // Create a string that will exceed 2048 hex chars
      const longText = "A".repeat(1025); // 1025 chars = 2050 hex chars
      expect(() => toApiHex(longText)).toThrow(/exceeds maximum length/);
    });

    it("allows max length of 2048 hex chars", () => {
      // 1024 chars = 2048 hex chars (exactly at limit)
      // Use 'X' which is not a hex digit, so it will be treated as plain text and encoded
      const maxText = "X".repeat(1024);
      const result = toApiHex(maxText);
      expect(result.length).toBe(2048);
    });
  });

  describe("isPrintableAscii", () => {
    it("detects printable ASCII", () => {
      expect(isPrintableAscii("PING")).toBe(true);
      expect(isPrintableAscii("Hello World")).toBe(true);
      expect(isPrintableAscii("123")).toBe(true);
      expect(isPrintableAscii("!@#$%")).toBe(true);
    });

    it("handles empty string", () => {
      expect(isPrintableAscii("")).toBe(true);
    });

    it("rejects non-printable characters", () => {
      expect(isPrintableAscii("\x00")).toBe(false);
      expect(isPrintableAscii("Hello\n")).toBe(false);
      expect(isPrintableAscii("\x1b[31m")).toBe(false);
      expect(isPrintableAscii("Test\r\n")).toBe(false);
    });

    it("rejects control characters", () => {
      expect(isPrintableAscii("\t")).toBe(false);
      expect(isPrintableAscii("\b")).toBe(false);
      expect(isPrintableAscii("\x7f")).toBe(false); // DEL
    });

    it("accepts space character (0x20)", () => {
      expect(isPrintableAscii(" ")).toBe(true);
      expect(isPrintableAscii("hello world")).toBe(true);
    });

    it("accepts tilde character (0x7E)", () => {
      expect(isPrintableAscii("~")).toBe(true);
      expect(isPrintableAscii("test~123")).toBe(true);
    });
  });

  describe("formatHexForDisplay", () => {
    it("decodes printable hex to text", () => {
      expect(formatHexForDisplay("50494E47")).toBe("PING");
      expect(formatHexForDisplay("48656C6C6F")).toBe("Hello");
      expect(formatHexForDisplay("4F4B")).toBe("OK");
    });

    it("handles lowercase hex", () => {
      expect(formatHexForDisplay("50494e47")).toBe("PING");
    });

    it("shows hex for non-printable data", () => {
      expect(formatHexForDisplay("00FF00FF")).toBe("00FF00FF");
      expect(formatHexForDisplay("0A0D")).toBe("0A0D"); // \n\r
      expect(formatHexForDisplay("00000000")).toBe("00000000"); // Null bytes
    });

    it("handles empty string", () => {
      expect(formatHexForDisplay("")).toBe("");
    });

    it("handles decoding failures", () => {
      expect(formatHexForDisplay("GGGG")).toBe("GGGG"); // Invalid hex, show as-is
      expect(formatHexForDisplay("50494E4")).toBe("50494E4"); // Odd length, show as-is
    });

    it("shows hex for mixed printable/non-printable", () => {
      const mixed = "48656C6C6F0A"; // "Hello\n"
      expect(formatHexForDisplay(mixed)).toBe(mixed); // Has newline, show hex
    });

    it("handles special printable characters", () => {
      expect(formatHexForDisplay("21402324")).toBe("!@#$"); // Special chars but printable
    });
  });

  describe("integration scenarios", () => {
    it("handles typical TCP healthcheck payloads", () => {
      // Plain text HTTP request
      const httpGet = "GET / HTTP/1.0\r\n\r\n";
      const encoded = toApiHex(httpGet);
      expect(encoded).toBe(encodeToHex(httpGet));
      expect(encoded.length).toBeGreaterThan(0);

      // Should not display nicely due to \r\n
      const display = formatHexForDisplay(encoded);
      expect(display).toBe(encoded); // Non-printable, shows hex
    });

    it("handles simple text payloads", () => {
      // Simple ping/pong
      const ping = toApiHex("PING");
      expect(ping).toBe("50494E47");
      expect(formatHexForDisplay(ping)).toBe("PING");

      const pong = toApiHex("PONG");
      expect(pong).toBe("504F4E47");
      expect(formatHexForDisplay(pong)).toBe("PONG");
    });

    it("handles binary protocols", () => {
      // User provides raw hex for binary protocol
      const binary = toApiHex("0xDEADBEEF");
      expect(binary).toBe("DEADBEEF");
      expect(formatHexForDisplay(binary)).toBe("DEADBEEF"); // Non-printable, shows hex
    });

    it("round-trip encode and decode", () => {
      const original = "Hello World";
      const encoded = encodeToHex(original);
      const decoded = decodeFromHex(encoded);
      expect(decoded).toBe(original);
    });
  });
});
