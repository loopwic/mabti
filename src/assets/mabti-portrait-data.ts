export const mabtiPortraitData = {
  ASZHCW: '/images/ASZ×C×.png',
  AGZHCW: '/images/AGZ×C×.png',
  ASZFCW: '/images/ASZ×W×.png',
  AGZFCW: '/images/AGZ×W×.png',
  ASRHCW: '/images/ASR×C×.png',
  AGRHCW: '/images/AGR×C×.png',
  ASRFCW: '/images/ASR×W×.png',
  AGRFCW: '/images/AGR×W×.png',
  DSZHCW: '/images/DSZ×C×.png',
  DGZHCW: '/images/DGZ×C×.png',
  DSZFCW: '/images/DSZ×W×.png',
  DGZFCW: '/images/DGZ×W×.png',
  DSRHCW: '/images/DSR×C×.png',
  DGRHCW: '/images/DGR×C×.png',
  DSRFCW: '/images/DSR×W×.png',
  DGRFCW: '/images/DGR×W×.png',
} as const

// Map actual 6-letter DNA codes to the correct images based on your previous mapping
// A/D, S/G, R/Z, F/H, C/W, L/T
// Note: Your images only have 4 letters in the filename (e.g. ASZ×C×.png).
// The user originally mapped:
// ENFJ -> ASZ×C×
// ENFP -> AGZ×C×
// ENTJ -> ASZ×W×
// ENTP -> AGZ×W×
// ESFJ -> ASR×C×
// ESFP -> AGR×C×
// ESTJ -> ASR×W×
// ESTP -> AGR×W×
// INFJ -> DSZ×C×
// INFP -> DGZ×C×
// INTJ -> DSZ×W×
// INTP -> DGZ×W×
// ISFJ -> DSR×C×
// ISFP -> DGR×C×
// ISTJ -> DSR×W×
// ISTP -> DGR×W×

export function getMabtiImage(typeCode: string): string {
  // Extract the relevant 4 letters that match the image filename pattern
  const energy = typeCode[0] // A or D
  const variance = typeCode[1] // S or G
  const instinct = typeCode[2] // R or Z
  const team = typeCode[4] // C or W
  
  const key = `${energy}${variance}${instinct}×${team}×`
  return `/images/${key}.png`
}
