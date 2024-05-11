import React from 'react';
import backgroungImage from './assets/background.png'

function Home({ cryptoAssets, totalValue }) {
  return (
    <div>
      <h1>My Portfolio</h1>
      <section>
        <h2>Total Estimated Value</h2>
        <p>${totalValue.toLocaleString()}</p>
      </section>
      <section>
        <h2>Assets</h2>
        <div className='asset-container'>
          {cryptoAssets.filter(asset => asset.amount > 0).map((asset, index) => (
            <div key={index}>
              {/* Display crypto asset information */}
              <div className='asset-card'>
                <p>
                  <img src={asset.image} alt={asset.name} style={{ width: "80px", height: "80px" }} /></p>
                <p className='asset-name'>{asset.name} <span>({asset.symbol})</span></p>
                <p className='asset-amount'>{asset.amount.toLocaleString('en-US', {maximumFractionDigits: 8 })} (${(asset.amount * asset.current_price).toFixed(2).toLocaleString()})</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;