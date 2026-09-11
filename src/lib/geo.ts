// O'zbekiston viloyat markazlari koordinatalari
export const REGION_COORDS: Record<string, [number, number]> = {
  "Toshkent shahri": [41.3111, 69.2797],
  "Toshkent viloyati": [41.35, 69.65],
  "Andijon viloyati": [40.7821, 72.3442],
  "Farg'ona viloyati": [40.3864, 71.7864],
  "Namangan viloyati": [40.9983, 71.6726],
  "Samarqand viloyati": [39.6542, 66.9597],
  "Buxoro viloyati": [39.7747, 64.4286],
  "Xorazm viloyati": [41.365, 60.36],
  "Navoiy viloyati": [40.0842, 65.3792],
  "Qashqadaryo viloyati": [38.8606, 65.7891],
  "Surxondaryo viloyati": [37.9408, 67.57],
  "Jizzax viloyati": [40.1158, 67.8422],
  "Sirdaryo viloyati": [40.4833, 68.7833],
  "Qoraqalpog'iston Respublikasi": [42.4631, 59.6103],
}

// Deterministik offset: bir xil matn -> har doim bir xil siljish
export function hashOffset(seed: string, range: number): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i)
    h |= 0
  }
  return ((Math.abs(h) % 1000) / 1000 - 0.5) * 2 * range
}

// E'lon koordinatasi: hudud markazi + tuman siljishi + noyob siljish
export function listingCoords(region: string, district: string, id: string): [number, number] {
  const base = REGION_COORDS[region] || [41.3111, 69.2797]
  const dLat = hashOffset(district || region, 0.1) + hashOffset(id, 0.015)
  const dLng = hashOffset((district || region) + "x", 0.1) + hashOffset(id + "x", 0.015)
  return [base[0] + dLat, base[1] + dLng]
}
