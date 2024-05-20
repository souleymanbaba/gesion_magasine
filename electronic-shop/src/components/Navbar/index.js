import React from 'react';
import { Link } from 'react-router-dom';
import '../../style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  return (
    <>
      <div className="container-fluid p-2">
        <div className="d-flex justify-content-end">
          <button className="">
            <FontAwesomeIcon icon={faSignInAlt} /> Login
          </button>
          <p> <p></p></p>
          <button className="">
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </button>
        </div>
      </div>
      <nav className="navbar navbar-expand-lg  " id="navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" id="logo">
            <span id="span1">E</span>Lectronic <span>Shop</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/" onClick={() => document.getElementById('navbarSupportedContent').classList.remove('show')}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products" onClick={() => document.getElementById('navbarSupportedContent').classList.remove('show')}>
                  Products
                </Link>
              </li>
              {/* Add more navbar items here */}
              <li className="nav-item">
                <Link className="nav-link" to="/about" onClick={() => document.getElementById('navbarSupportedContent').classList.remove('show')}>
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact" onClick={() => document.getElementById('navbarSupportedContent').classList.remove('show')}>
                  Contact
                </Link>
              </li>
            </ul>
            <form className="d-flex" id="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
