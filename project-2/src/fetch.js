export const loadJsonFetch = (url, callback) => {
    const fetchPromise = async () =>
    {
        const response = await fetch(url);
        callback(await response.json());
    }
    fetchPromise();
  };