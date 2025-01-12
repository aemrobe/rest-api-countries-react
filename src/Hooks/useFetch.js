import { useState, useEffect } from "react";
import { getJson } from "../Utils/helpers";

const useFetch = (url, error, dependencyVariable, signal = false) => {
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

        setData(data);
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
  }, [url, error, dependencyVariable, signal]);

  return { data, loading, err };
};

export default useFetch;
