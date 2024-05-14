import React, { useState } from "react";

const BuySell = ({ cryptoData, cryptoAssets, setCryptoAssets }) => {
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCoins, setFilteredCoins] = useState([]);
    const [buyOrSell, setBuyOrSell] = useState("buy");
    const [amount, setAmount] = useState(0);
    const [usdtValue, setUsdtValue] = useState(0);
    const [selectedOption, setSelectedOption] = useState("amount");
    const [buttonText, setButtonText] = useState("Buy");

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value === "") {
            setFilteredCoins([]);
        } else {
            const filtered = cryptoData.filter((coin) =>
                (coin.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    coin.symbol.toLowerCase().includes(e.target.value.toLowerCase())) &&
                coin.symbol.toLowerCase() !== "usdt"
            );
            setFilteredCoins(filtered);
        }
    };

    const handleCoinSelect = (coin) => {
        setSelectedCoin(coin);
        setSearchTerm("");
        setFilteredCoins([]);
    };

    const handleBuySellSelect = (option) => {
        setBuyOrSell(option);
        setButtonText(option === "buy" ? "Buy" : "Sell"); // Change button text based on action
    };

    const handleAmountChange = (e) => {
        const inputValue = parseFloat(e.target.value);
        setAmount(inputValue);
        if (selectedOption === "amount") {
            setUsdtValue(selectedCoin.current_price * inputValue);
        } else {
            setUsdtValue(inputValue);
        }
    };

    const handleUsdtValueChange = (e) => {
        const inputValue = parseFloat(e.target.value);
        setUsdtValue(inputValue);
        if (selectedOption === "usdt") {
            setAmount(inputValue / selectedCoin.current_price);
        } else {
            setAmount(inputValue * selectedCoin.current_price);
        }
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleBuy = () => {
        if (buyOrSell === "buy") {
            if (usdtValue <= cryptoAssets.find(asset => asset.symbol === "USDT").amount) {
                setCryptoAssets((prevAssets) => {
                    const usdtIndex = prevAssets.findIndex((asset) => asset.symbol === "USDT");
                    const updatedAssets = [...prevAssets];
                    updatedAssets[usdtIndex].amount -= usdtValue;

                    const existingAssetIndex = prevAssets.findIndex((asset) => asset.symbol === selectedCoin.symbol.toUpperCase());
                    if (existingAssetIndex !== -1) {
                        // Update the amount of the existing asset
                        updatedAssets[existingAssetIndex].amount += amount;
                    } else {
                        // Add a new asset to the array
                        updatedAssets.push({
                            image: selectedCoin.image,
                            name: selectedCoin.name,
                            symbol: selectedCoin.symbol.toUpperCase(),
                            amount: amount,
                            current_price: selectedCoin.current_price,
                        });
                    }
                    return updatedAssets;
                });
            } else {
                alert("Insufficient USDT balance to complete purchase.");
            }
        } else { // Sell logic
            const coinExists = cryptoAssets.some((asset) => asset.symbol === selectedCoin.symbol.toUpperCase());
            if (coinExists) {
                const coinAmount = cryptoAssets.find((asset) => asset.symbol === selectedCoin.symbol.toUpperCase()).amount;
                if (amount <= coinAmount) {
                    const usdtAmount = amount * selectedCoin.current_price;
                    setCryptoAssets((prevAssets) => {
                        const updatedAssets = prevAssets.map((asset) => {
                            if (asset.symbol === selectedCoin.symbol.toUpperCase()) {
                                // Update the amount of the selected coin
                                return { ...asset, amount: asset.amount - amount };
                            }
                            return asset;
                        });
                        const usdtIndex = prevAssets.findIndex((asset) => asset.symbol === "USDT");
                        updatedAssets[usdtIndex].amount += usdtAmount;
                        return updatedAssets;
                    });
                } else {
                    alert("Insufficient cryptocurrency balance to complete sale.");
                }
            } else {
                alert("You don't own this cryptocurrency.");
            }
        }
    };

    return (
        <div>
            <h1>Buy and Sell</h1>
                    <div className="searchCoin-container">
                        <div className="searchCoin">
                            <input className="search-coin" type="text" value={searchTerm} onChange={handleSearchTermChange} placeholder="Search Coin" />
                            <div className="filtered-coins">
                                {filteredCoins.length > 0 && (
                                    <div style={{ height: "300px", width: "270px", overflowY: "auto" }}>
                                    {filteredCoins.map((coin) => (
                        <div key={coin.id} onClick={() => handleCoinSelect(coin)} className={`coin-item ${selectedCoin === coin ? "selected-coin" : ""}`}>
                            <img
                                src={coin.image}
                                alt={coin.name}
                                style={{ width: "30px", height: "30px" }}
                            />
                            <span className="coin-name">{coin.name} ({coin.symbol.toUpperCase()})</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
</div>
            {selectedCoin ? (
                <>
                    <div className="buy-sell-card-container">
                        <div className="buy-sell-card">
                            <div>
                                <img src={selectedCoin.image} alt={selectedCoin.name} style={{ width: "40px", height: "40px" }} />
                                <span className="selected-coin-name">{selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})</span>
                            </div>
                            <br />
                            <div>
                                <label>Buy or Sell:</label>
                                <select className="input-select" select value={buyOrSell} onChange={(e) => handleBuySellSelect(e.target.value)}>
                                    <option value="buy">Buy</option>
                                    <option value="sell">Sell</option>
                                </select>
                            </div>
                            <br />
                            <div>
                                <label>Market Price: {selectedCoin.current_price}</label>
                            </div>
                            <br />
                            <div>
                                <label>Currency:</label>
                                <select className="input-select" select value={selectedOption} onChange={(e) => handleOptionSelect(e.target.value)}>
                                    <option value="amount">{selectedCoin.symbol.toUpperCase()}</option>
                                    <option value="usdt">USDT</option>
                                </select>
                                {selectedOption === "amount" ? (
                                    <div>
                                        <label>Amount:</label>
                                        <input className="input-amount" type="number" value={amount} onChange={handleAmountChange} />
                                        {amount > 0 && ( // Show equivalent value only when amount > 0
                                            <div>
                                                <span>Equivalent: {usdtValue.toFixed(2)} USDT</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <label>Amount:</label>
                                        <input className="input-amount" type="number" value={usdtValue} onChange={handleUsdtValueChange} />
                                        {usdtValue > 0 && ( // Show equivalent value only when usdtValue > 0
                                            <div>
                                                <span>Equivalent: {amount.toLocaleString('en-US', { maximumFractionDigits: 8 })} {selectedCoin.symbol.toUpperCase()}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <br />
                            <div>
                                {buyOrSell === "buy" ? (
                                    <>
                                        <label>Available:</label>
                                        <span>{cryptoAssets.find(asset => asset.symbol === 'USDT').amount.toFixed(2)} USDT</span>
                                    </>
                                ) : (
                                    <>
                                        <label>Available:</label>
                                        <span>{cryptoAssets.find(asset => asset.symbol === selectedCoin.symbol.toUpperCase())?.amount?.toLocaleString('en-US', { maximumFractionDigits: 8 }) || 0} {selectedCoin.symbol.toUpperCase()}</span>
                                    </>
                                )}
                            </div>
                            <br />
                            <button className="buy-sell-button" onClick={handleBuy} disabled={buyOrSell === 'sell' && (!cryptoAssets.some(asset => asset.symbol === selectedCoin.symbol.toUpperCase()) || amount > cryptoAssets.find(asset => asset.symbol === selectedCoin.symbol.toUpperCase())?.amount)}>
                                {buttonText}
                            </button>
                            <br />
                            <br />
                        </div>
                    </div>
                </>
            ) : (
                <div>
                    <p>Please select a coin from the search bar.</p>
                </div>
            )}
        </div>
    );
};

export default BuySell;
