/**
 * Color interpolation utilities for smooth pulsating animations
 * Converts between hex and RGB formats and interpolates colors
 */

/**
 * Convert hex color string to RGB tuple
 * @param hex - Hex color string (e.g., "#00c853" or "00c853")
 * @returns RGB tuple [r, g, b] with values 0-255
 */
export function hexToRgb(hex: string): [number, number, number] {
	// Remove # if present
	const cleanHex = hex.replace(/^#/, "");

	// Parse hex values
	const r = parseInt(cleanHex.slice(0, 2), 16);
	const g = parseInt(cleanHex.slice(2, 4), 16);
	const b = parseInt(cleanHex.slice(4, 6), 16);

	return [r, g, b];
}

/**
 * Convert RGB values to hex color string
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Hex color string with # prefix
 */
export function rgbToHex(r: number, g: number, b: number): string {
	const toHex = (n: number): string => {
		const clamped = Math.max(0, Math.min(255, Math.round(n)));
		return clamped.toString(16).padStart(2, "0");
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Linearly interpolate between two hex colors
 * @param hex1 - Start color (hex string)
 * @param hex2 - End color (hex string)
 * @param t - Interpolation factor (0 = hex1, 1 = hex2)
 * @returns Interpolated hex color string
 */
export function interpolateColors(
	hex1: string,
	hex2: string,
	t: number,
): string {
	const [r1, g1, b1] = hexToRgb(hex1);
	const [r2, g2, b2] = hexToRgb(hex2);

	// Linear interpolation: result = color1 + (color2 - color1) * t
	const r = r1 + (r2 - r1) * t;
	const g = g1 + (g2 - g1) * t;
	const b = b1 + (b2 - b1) * t;

	return rgbToHex(r, g, b);
}
