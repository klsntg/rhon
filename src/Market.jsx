import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

const Market = ({ cryptoData, favorites, setFavorites }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFavorite = (symbol) => {
    if (favorites.includes(symbol)) {
      setFavorites(favorites.filter((fav) => fav !== symbol));
    } else {
      setFavorites([...favorites, symbol]);
    }
  };

  const filteredCryptoData = cryptoData.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Crypto Market</h1>
      <input className="search"
        type="text"
        placeholder="Search Crypto Currencies"
        value={searchTerm}
        onChange={handleSearch}
      />
      <table className="market-table centered-table">
        <thead className="table-market-head">
          <tr>
            <th>Favorite</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>24h</th>
            <th>24h Volume</th>
            <th>Circulating Supply</th>
            <th>Total Supply</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {filteredCryptoData.map((crypto, index) => (
              <tr key={index}>
                <td className="centered-cell">
                  <input
                    type="checkbox"
                    checked={favorites.includes(crypto.symbol)}
                    onChange={() => handleFavorite(crypto.symbol)}
                  />
                </td>
                <td className="centered-cell left-align-content" >
                  <Link to={`/crypto/${crypto.id}`} style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      style={{ width: "35px", height: "35px" }}
                    />
                    <p className="crypto-name">{crypto.name}</p>
                  </Link>
                </td>
                <td className="centered-cell">{crypto.symbol.toUpperCase()}</td>
                <td className="centered-cell">${crypto.current_price.toLocaleString()}</td>
                <td className="centered-cell" style={{ color: crypto.price_change_percentage_24h >= 0? 'green' : 'red' }}>
                  {crypto.price_change_percentage_24h.toFixed(2)}% </td>
                <td className="centered-cell">${crypto.total_volume.toLocaleString()}</td>
                <td className="centered-cell">{crypto.circulating_supply.toLocaleString()}</td>
                <td className="centered-cell">
                  {crypto.total_supply
                   ? crypto.total_supply.toLocaleString()
                    : "-"}
                </td>
                <td className="centered-cell">${crypto.market_cap.toLocaleString()}</td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Market;
