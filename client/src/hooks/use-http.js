import { useCallback } from "react";
import { useState } from "react";

export default function useHttp(requestConfig) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApi = useCallback(async () => {
    try {
      setIsLoading(true);
      const request = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : "GET",
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      });
      const fetchData = await request.json();

      if (fetchData.results) {
        setData(fetchData.results);
      } else setData(fetchData);

      if (!request.ok) {
        throw new Error("Request failed!!");
      }
    } catch (error) {
      setError(error.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }, [
    requestConfig.url,
    requestConfig.method,
    requestConfig.headers,
    requestConfig.body,
  ]);

  return { data, isLoading, error, fetchApi };
}
