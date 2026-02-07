export const decodeGeohash = (geohash: string) => {
  const base32 = "0123456789bcdefghjkmnpqrstuvwxyz";

  const newGeohash = geohash.toLowerCase();

  let evenBit = true;
  let latMin = -90;
  let latMax = 90;
  let lonMin = -180;
  let lonMax = 180;

  for (let i = 0; i < newGeohash.length; i++) {
    const chr = newGeohash.charAt(i);
    const idx = base32.indexOf(chr);

    if (idx == -1) throw new Error("Invalid geohash");

    for (let n = 4; n >= 0; n--) {
      const bitN = (idx >> n) & 1;
      if (evenBit) {
        const lonMid = (lonMin + lonMax) / 2;
        if (bitN == 1) {
          lonMin = lonMid;
        } else {
          lonMax = lonMid;
        }
      } else {
        const latMid = (latMin + latMax) / 2;
        if (bitN == 1) {
          latMin = latMid;
        } else {
          latMax = latMid;
        }
      }
      evenBit = !evenBit;
    }
  }

  const bounds = {
    sw: { lat: latMin, lon: lonMin },
    ne: { lat: latMax, lon: lonMax },
  };

  const latMinBounds = bounds.sw.lat,
    lonMinBounds = bounds.sw.lon;
  const latMaxBounds = bounds.ne.lat,
    lonMaxBounds = bounds.ne.lon;

  const lat = ((latMinBounds + latMaxBounds) / 2).toFixed(
    Math.floor(2 - Math.log(latMaxBounds - latMinBounds) / Math.LN10),
  );
  const lon = ((lonMinBounds + lonMaxBounds) / 2).toFixed(
    Math.floor(2 - Math.log(lonMaxBounds - lonMinBounds) / Math.LN10),
  );

  return { latitude: Number(lat), longitude: Number(lon) };
};
