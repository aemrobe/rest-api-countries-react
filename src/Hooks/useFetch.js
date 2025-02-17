import { useState, useEffect } from "react";
import { getJson } from "../Utils/helpers";

const useFetch = (
  url,
  error,
  dependencyVariable,
  signal = false,
  arrangeDataFunction = "",
  arrageDataFunctionType = ""
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const signalOrg = controller.signal;

    const fetchData = async function () {
      try {
        const data = await getJson(
          url,
          error,
          signal ? { signal: signalOrg } : {}
        );

        return data;
      } catch (err) {
        throw err;
      }
    };

    if (
      typeof dependencyVariable === "string" &&
      dependencyVariable.length === 0
    ) {
      setData(null);
      return;
    }

    (async function () {
      try {
        setLoading(true);
        setErr(null);
        const data = await fetchData();

        if (
          typeof arrangeDataFunction === "function" &&
          arrageDataFunctionType === "async"
        ) {
          const dataObj = await arrangeDataFunction(data);

          setData(dataObj);
        } else {
          setData(arrangeDataFunction(data));
        }
      } catch (err) {
        if (!(err.name === "AbortError")) {
          setErr(err.message);
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    })();

    if (signal) {
      return function () {
        controller.abort();
      };
    }
  }, [
    url,
    error,
    dependencyVariable,
    signal,
    arrangeDataFunction,
    arrageDataFunctionType,
  ]);

  return { data, loading, err, setData, setErr };
};

export default useFetch;
