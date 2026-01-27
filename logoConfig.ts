
/**
 * BRAND SYSTEM CONFIGURATION (CLOUDINARY MODE)
 * 
 * INSTRUCTIONS:
 * 1. Upload your images to Cloudinary.
 * 2. Copy the "Direct Link" (URL ending in .png or .svg) for each image.
 * 3. Paste the links inside the quotes below replacing 'PASTE_YOUR_LINK_HERE'.
 */

export const BASE_URL = ''; // Leave empty for external URLs

export const BRAND_ASSETS = {
  // Primary horizontal logo (Symbol + Text) - Used in White Header
  fullPrimary: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1768817715/logo-full-horizontal-primary_hbs9gw.png',
  
  // White horizontal logo (Symbol + Text) - Used in Dark Footer
  fullLight: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1768817715/logo-full-horizontal-light_plrq7m.png',
  
  // 3D/Metallic Symbol - The floating logo in the Hero section (Use PNG for best results)
  hero3d: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1768818411/logo-hero-3d_1_oyxssi.png', 
  
  // Primary Symbol (Icon only) - Purple
  symbolPrimary: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1768817716/logo-symbol-primary-2d_mxab3d.svg',
  
  // Light Symbol (Icon only) - White
  symbolLight: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1768817715/logo-symbol-light_nynlkj.svg',
  
  // Metallic Symbol (Icon only) - Silver/Gradient
  symbolMetallic: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1768817717/logo-symbol-metallic_mrvgns.svg',
  
  // Standalone Text (No Symbol) - Purple
  wordmarkPrimary: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1768817717/logo-wordmark-primary_ojcsfm.svg',
  
  // Standalone Text (No Symbol) - White
  wordmarkLight: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1768817717/logo-wordmark-light_lkz7vl.svg',
} as const;

export type BrandAssetKey = keyof typeof BRAND_ASSETS;

export const getAssetUrl = (key: BrandAssetKey) => {
  // Cast to string to avoid TypeScript narrowing to "never" because all values in BRAND_ASSETS are currently identical literals.
  const path = BRAND_ASSETS[key] as string;
  
  // Safety check: If you haven't pasted a link yet, return empty string to prevent crashes
  if (path === 'PASTE_YOUR_LINK_HERE') {
    return ''; 
  }

  // If the path is a full URL (Cloudinary), return it directly
  if (path.startsWith('http')) {
    return path;
  }
  
  return `${BASE_URL}${path}`;
};
