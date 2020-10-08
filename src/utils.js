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
    // console.log('time string to int:', baseTime, y);

    // // destructure the base time
    // let h = (y / 60);
    // let m = (y % 60);

    // h += x / 60;
    // m += x % 60;


    const m = y + x;

    // // debugger;
    // if (m / 60 >= 1) {
    //   h += m / 60;
    //   m -= m;
    // }

    // h = Math.floor(h).toFixed(0);
    // m = Math.floor(m).toFixed(0);

    const h = (Math.floor(m / 60)).toFixed(0);
    const mm = (Math.floor(m % 60)).toFixed(0);
    const mstr = mm < 10 ? `0${mm}` : mm;

    console.log("Y", { y, m, h, mm, mstr });

    return `${h}:${mstr}`;
  }

  const h = (x / 60).toFixed(0);
  const m = (x % 60).toFixed(0);

  const mm = m < 10 ? `0${m}` : m;

  return `${h}:${mm}`;
};

export const getCurrentTimeString = () => {
  const d = new Date();
  const m = d.getMinutes();
  const s = d.getSeconds();
  return `${d.getHours()}:${m < 10 ? `0${m}` : m}`;
};

export const compareTimeStrings = (a, b) => {
  const aa = parseInt(a.replace(':', ''));
  const bb = parseInt(b.replace(':', ''));

  return aa < bb ? -1 : (a === bb ? 0 : 1);
};
