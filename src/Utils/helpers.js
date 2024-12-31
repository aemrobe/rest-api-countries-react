import { TIME_OUT_SEC } from "../config/config";

const timeout = function (TIME_OUT_SEC) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long, Please try Again!`));
    }, TIME_OUT_SEC * 1000);
  });
};

export const getJson = async function (API_URL, errMessage, options = {}) {
  try {
    const res = await Promise.race([
      timeout(TIME_OUT_SEC),
      fetch(API_URL, options),
    ]);

    if (!res.ok) throw new Error(`${errMessage}`);

    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
