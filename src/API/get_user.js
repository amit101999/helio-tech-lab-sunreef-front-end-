import { useEffect } from "react";

  const fetchData = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BURL+"7000/get-users"); // Replace with your API
      const res = await response.json();
      setAllData(res.data);
      setHasFetched(true);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    const emails = allData.map((item) => item.cf?.cf_email || "");
    setFilteredData(emails);
  }, [allData]);


export default fetchData