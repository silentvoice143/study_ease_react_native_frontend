export function getRandomAdUnit(adUnits: string[]) {
  const randomIndex = Math.floor(Math.random() * adUnits.length);
  return adUnits[randomIndex];
}
