export default function geoValidation(geo) {
  if (!geo) { return false; }

  const regexGeo = /^(\[(-?\d+\.\d+),\s?(-?\d+\.\d+)\]|(-?\d+\.\d+),\s?(-?\d+\.\d+))$/;
  const regexNumber = /(-?\d+\.\d+)/g;

  const resultGeo = regexGeo.test(geo);

  if (resultGeo) {
    const geoArr = geo.match(regexNumber);
    const latitude = parseFloat(geoArr[0]);
    const longitude = parseFloat(geoArr[1]);

    const condition = (latitude > -90 && latitude < 90) && (longitude > -180 && longitude < 180);

    if (condition) { return { latitude, longitude }; }

    return false;
  }

  return false;
}
