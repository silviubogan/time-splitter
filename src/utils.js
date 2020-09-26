/**
 * time string to minutes count
 * @param {*} s
 */
export const timeStringToInt = (s) => {
  const [p1, p2] = s.split(':');
  return parseInt(p1, 10) * 60 + parseInt(p2, 10);
};

export const intToTimeString = (x, baseTime) => {
  if (baseTime) {
    const y = timeStringToInt(baseTime);
    let h = (y / 60);
    let m = (y % 60);

    h += x / 60;
    m += x % 60;

    // debugger;
    if (m / 60 >= 1) {
      h += 1;
      m -= 60;
    }

    h = Math.floor(h).toFixed(0);
    m = Math.floor(m).toFixed(0);

    const mm = m < 10 ? `0${m}` : m;

    return `${h}:${mm}`;
  }

  const h = (x / 60).toFixed(0);
  const m = (x % 60).toFixed(0);

  const mm = m < 10 ? `0${m}` : m;

  return `${h}:${mm}`;
};
