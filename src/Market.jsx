import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import Pagination from './Pagination'; // Ensure this component is correctly imported

const Market = ({ cryptoData, favorites, setFavorites }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  const searchRef = useRef(false); // Reference to track search term changes

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFavorite = (symbol, checked) => {
    let confirmationMessage = "";
    let successMessage = "";
    
    if (checked) {
      confirmationMessage = "Are you sure you want to add this cryptocurrency to favorites?";
      successMessage = "Successfully added to Watchlist.";
    } else {
      confirmationMessage = "Are you sure you want to remove this cryptocurrency from favorites?";
      successMessage = "Successfully removed from Watchlist.";
    }

    const confirmed = window.confirm(confirmationMessage);
    if (confirmed) {
      if (checked) {
        setFavorites([...favorites, symbol]);
      } else {
        setFavorites(favorites.filter((fav) => fav!== symbol));
      }
      alert(successMessage);
    }
  };

  const filteredCryptoData = cryptoData.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCryptoData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredCryptoData.length / itemsPerPage);

  // Reset page index to 1 when search term changes
  useEffect(() => {
    if (searchRef.current) {
      setCurrentPage(1);
    }
    searchRef.current = true;
  }, [searchTerm]);

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
          {currentItems.map((crypto, index) => (
            <tr key={index}>
              <td className="centered-cell">
                <input
                  type="checkbox"
                  checked={favorites.includes(crypto.symbol)}
                  onChange={(e) => handleFavorite(crypto.symbol, e.target.checked)}
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
      <div className="pagination-container">
        <Pagination onPageChange={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default Market;
