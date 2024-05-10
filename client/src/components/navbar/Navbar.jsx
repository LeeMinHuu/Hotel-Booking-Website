import React from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css"

const Navbar = (props) => {
  const navigate = useNavigate()

  return (
    <div className="navbar">
      <div className="navContainer">
        <span className="logo">Booking Website</span>

        {!props.isLoggedIn && 
        <div className="navItems">
        <button className="navButton" onClick={() => navigate("/auth", { state: "register" })}>Register</button>
        <button className="navButton" onClick={() => navigate("/auth", { state: "login" })}>Login</button> 
        </div>}

        {props.isLoggedIn &&
        <div className="navItems">
        <span>Hello {props.username} ({props.email})</span>
        <button className="navButton" onClick={() => navigate("/transaction")}>Transactions</button>
        <button className="navButton" onClick={() => {
          localStorage.removeItem("token");
          props.setIsLoggedIn(false);
          alert("Logout successful")}}>Logout</button> 
        </div>}
      </div>
    </div>
  )
}

export default Navbar
