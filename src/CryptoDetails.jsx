import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const CryptoDetails = ({ cryptoData }) => {
  const [chartData, setChartData] = useState(null);
  const { cryptoId } = useParams();

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart`,
          {
            params: { vs_currency: "usd", days: "365" },
            headers: {
              accept: "application/json",
              "x-cg-demo-api-key": "CG-Wdo5iVvwZTf2tJ1AKtXxk4jk",
            },
          }
        );
        const data = response.data.prices.map(([timestamp, price]) => ({
          time: timestamp,
          price,
        }));
        setChartData(data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, [cryptoId]);

  if (!chartData) return <div>Loading chart data...</div>;

  return (
    <div>
      <h1>Historical Price Chart (Last 365 Days)</h1>
      {/* <div style={{ height: '400px', width: '80%' }}> */}
  <Line
    data={{
      labels: chartData.map(({ time }) => new Date(time).toLocaleDateString()),
      datasets: [{
        label: 'Price (USD)',
        data: chartData.map(({ price }) => price),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    }}
  />
{/* </div> */}
      {/* Render other details of the cryptocurrency */}
    </div>
  );
};

export default CryptoDetails;
