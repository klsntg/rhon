import React from 'react';
import { Link } from 'react-router-dom';
import dashboard from './assets/dashboard.svg'
import logo from './assets/logo.svg'
import market from './assets/market.svg'
import watchlist from './assets/watchlist.svg'
import buyandsell from './assets/buyandsell.svg'

const Navbar = () => {
  return (
    <nav className='sidebar'>
      <ul>
        <li style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" />
          <p className='logoName'>Crypto Crack</p>
        </li>
        <li>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={dashboard} alt="dashboard icon" />
            <p className='sidebarText'>Dashboard</p></Link>
        </li>
        <li>
          <Link to="/market" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={market} alt="market icon" />
            <p className='sidebarText'>Market</p>
          </Link>
        </li>
        <li>
            <Link to="/watchlist" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={watchlist} alt="watchlist icon" />
            <p className='sidebarText'>Watchlist</p>
            </Link>
        </li>
        <li>
            <Link to="/buysell" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={buyandsell} alt="buyandsell icon" />
            <p className='sidebarText'>Buy and Sell</p>
            </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
