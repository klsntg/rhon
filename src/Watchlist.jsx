import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { Line } from "react-chartjs-2";

const Watchlist = ({ cryptoData, favorites }) => {
  const [viewMode, setViewMode] = useState('grid'); // Initialize view mode to 'grid'
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart`,
          {
            params: { vs_currency: "usd", days: "7" },
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
  }, []);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid'? 'list' : 'grid'); // Toggle between 'grid' and 'list'
  };

  const favoriteCryptoData = cryptoData.filter((crypto) =>
    favorites.includes(crypto.symbol)
  );

  // Determine the button text based on the current view mode
  const buttonText = viewMode === 'grid'? "Change to List View" : "Change to Card View";

  // Determine the color of the last data point
  const lastDataPointColor = chartData && chartData.length > 1 ?
    chartData[chartData.length - 1].price > chartData[chartData.length - 2].price ?
    'green' : 'red' : 'green'; // Default color is green if there's only one data point

  return (
    <div className="watchlist-container">
      <h1>Watchlist</h1>
      <button onClick={toggleViewMode} className="toggle-button">{buttonText}</button> 
      <div className={`crypto-cards ${viewMode}`}> 
        {favoriteCryptoData.map((crypto, index) => (
          <Link to={`/crypto/${crypto.id}`} key={index}>
            <div className={`crypto-card ${viewMode === 'list' ? 'list' : ''}`}> 
              <div className="left-side">
                <div className="crypto-image">
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    style={{ width: "50px", height: "50px" }}
                  />
                </div>
                <h3>{crypto.name}</h3>
                {viewMode === 'list' && chartData && (
                  <div className="watchlist-chart">
                    <Line
                      data={{
                        labels: chartData.map(({ time }) => ''), // Empty array to remove labels
                        datasets: [{
                          label: '',
                          data: chartData.map(({ price }) => price),
                          fill: false,
                          borderColor: lastDataPointColor, // Set color based on the last data point
                          backgroundColor: 'transparent',
                          tension: 0.1
                        }]
                      }}
                      options={{
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          x: {
                            display: false // Hide x-axis
                          },
                          y: {
                            display: false // Hide y-axis
                          }
                        },
                        layout: {
                          padding: {
                            left: 20, 
                            right: 20, 
                            top: 20, 
                            bottom: 20
                          }
                        },
                        maintainAspectRatio: false, // Ensure chart doesn't maintain aspect ratio
                        aspectRatio: 3 // Adjust aspect ratio as needed
                      }}
                      width={400} // Set width of the chart
                    />
                  </div>
                )}
              </div>
              <div className="right-side">
                <p>Symbol: {crypto.symbol.toUpperCase()}</p>
                <p>Price: ${crypto.current_price.toLocaleString()}</p>
                <p>24h Change: <span style={{ color: crypto.price_change_percentage_24h >= 0? 'green' : 'red' }}>{crypto.price_change_percentage_24h.toFixed(2)}%</span></p>
              </div>
            </div>
          </Link>
        ))}
        <Link to="/market" className="add-to-watchlist-card">
          <div className="add-to-watchlist-card-content">
            <p>+</p>
            <p>Add to Watchlist</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Watchlist;