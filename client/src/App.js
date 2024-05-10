import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Auth from "./pages/auth/Auth";
import Transaction from "./pages/transaction/Transaction";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [headers, setHeaders] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
      const token = localStorage.getItem("token");
      setId(jwtDecode(token).id);
      setUsername(jwtDecode(token).username);
      setEmail(jwtDecode(token).email);
      setIsAdmin(jwtDecode(token).isAdmin);
      setPhoneNumber(jwtDecode(token).phoneNumber);
      setFullName(jwtDecode(token).fullName);

      setHeaders({
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      });
    }
  }, [isLoggedIn]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              id={id}
              email={email}
              username={username}
              isAdmin={isAdmin}
              phoneNumber={phoneNumber}
              fullName={fullName}
            />
          }
        />
        <Route
          path="/hotels"
          element={
            <List
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              id={id}
              email={email}
              username={username}
              isAdmin={isAdmin}
              phoneNumber={phoneNumber}
              fullName={fullName}
            />
          }
        />
        <Route
          path="/hotels/:id"
          element={
            <Hotel
              headers={headers}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              id={id}
              email={email}
              username={username}
              isAdmin={isAdmin}
              phoneNumber={phoneNumber}
              fullName={fullName}
            />
          }
        />
        <Route
          path="/auth"
          element={
            <Auth
              headers={headers}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              id={id}
              email={email}
              username={username}
              isAdmin={isAdmin}
              phoneNumber={phoneNumber}
              fullName={fullName}
            />
          }
        />
        <Route
          path="/transaction"
          element={
            <Transaction
              headers={headers}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              id={id}
              email={email}
              username={username}
              isAdmin={isAdmin}
              phoneNumber={phoneNumber}
              fullName={fullName}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
