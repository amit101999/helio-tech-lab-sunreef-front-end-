import React from 'react'
import "../App.css"
import logo from "../assets/logo4.png"
import boat from "../assets/boat.jpeg"

const Header = () => {
  return (
    <header className="header">
      <img className="header-img" src={boat} alt="Boat" />
      <div className="logo">
        <img src={logo} alt="Logo" className="logo-icon" />
      </div>
    </header>
  )
}

export default Header