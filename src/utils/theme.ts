export function getContrastTextColor(backgroundColor: string): string {
  // Convert hex to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r / 255, g / 255, b / 255].map(val => 
      val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  // Parse the background color
  let rgb;
  if (backgroundColor.startsWith('#')) {
    rgb = hexToRgb(backgroundColor);
  } else if (backgroundColor.startsWith('rgb')) {
    const matches = backgroundColor.match(/\d+/g);
    if (matches && matches.length >= 3) {
      rgb = {
        r: parseInt(matches[0]),
        g: parseInt(matches[1]),
        b: parseInt(matches[2])
      };
    }
  } else if (backgroundColor.startsWith('hsl')) {
    // For HSL colors, we'll use a simpler approach based on lightness
    const matches = backgroundColor.match(/\d+/g);
    if (matches && matches.length >= 3) {
      const lightness = parseInt(matches[2]);
      return lightness > 60 ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    }
  }

  if (!rgb) {
    return 'rgba(255, 255, 255, 0.95)'; // Default to light text
  }

  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  return luminance > 0.5 ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)';
}
