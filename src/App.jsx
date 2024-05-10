import React, { useState, useEffect } from "react";
import Home from './Home';
import Market from './Market';
import Watchlist from './Watchlist';
import Navbar from './Navbar';
import CryptoDetails from './CryptoDetails';
import BuySell from "./BuySell";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from "axios";

function App() {
  const [favorites, setFavorites] = useState([]);
  const [cryptoData, setCryptoData] = useState([]);
  const [cryptoAssets, setCryptoAssets] = useState([]);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              x_cg_demo_api_key: "CG-Wdo5iVvwZTf2tJ1AKtXxk4jk",
            },
            headers: {
              accept: "application/json",
            },
          }
        );
        setCryptoData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const tetherData = cryptoData.find(asset => asset.symbol === 'usdt');
  
    if (tetherData) {
      const initialAssets = cryptoData.map(asset => {
        if (asset.symbol === 'usdt') {
          return {
            image: tetherData.image,
            name: tetherData.name,
            symbol: tetherData.symbol.toUpperCase(),
            amount: 100000, // Set your initial balance for USDT here
            current_price: 1,
          };
        } else {
          return {
            image: asset.image,
            name: asset.name,
            symbol: asset.symbol.toUpperCase(),
            amount: 0, // Set the amount of other cryptocurrencies to 0
            current_price: asset.current_price,
          };
        }
      });
  
      setCryptoAssets(initialAssets);
    }
  }, [cryptoData]);

  useEffect(() => {
    const total = cryptoAssets.reduce((acc, asset) => {
      return acc + (asset.current_price * asset.amount);
    }, 0);

    setTotalValue(total);
  }, [cryptoAssets]); 

  return (
    <Router>
      <div className="app-container"> {/* New container for layout */}
        <Navbar />
        <div className="main-content"> {/* Main content area */}
          <Routes>
            <Route path="/" element={<Home cryptoAssets={cryptoAssets} totalValue={totalValue} />} />
            <Route path="/market" element={<Market cryptoData={cryptoData} favorites={favorites} setFavorites={setFavorites} />} />
            <Route path="/watchlist" element={<Watchlist cryptoData={cryptoData} favorites={favorites} />} />
            <Route path="/crypto/:cryptoId" element={<CryptoDetails cryptoData={cryptoData} />} />
            <Route path="/buysell" element={<BuySell cryptoData={cryptoData} cryptoAssets={cryptoAssets} setCryptoAssets={setCryptoAssets}/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;