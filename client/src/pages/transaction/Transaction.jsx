
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import "./transaction.css";
import useHttp from '../../hooks/use-http';
import { useEffect, useLayoutEffect } from "react";

const Transaction = (props) => {
  const userId = props.id;
  const getFormattedPrice = (price) => `VND ${price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}.000`;
  
  const { data: transactionData, fetchApi: transactionPostApi } = useHttp({
    url: "http://localhost:5000/transaction",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: {
      userId: userId
    }
  })
 
  useEffect(() => {
    if(props.isLoggedIn) {
      transactionPostApi();
    }
  },[props.isLoggedIn])

  return (
    <>
      <Navbar isLoggedIn={props.isLoggedIn} setIsLoggedIn={props.setIsLoggedIn} email={props.email} username={props.username} />
      {!props.isLoggedIn && <h1 style={{textAlign: "center", color: "red", padding: "50px"}}>Please Login to access.</h1>}
      <div className="transactionDisplay">
        {props.isLoggedIn && 
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Hotel</th>
              <th>Room</th>
              <th>Date</th>
              <th>Price</th>
              <th>Payment Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactionData.map((item, index) => (
              <tr key={index}>
                <td>{index+1}</td>
                <td><strong>{item.hotel.name}</strong></td>
                <td>{item.room.sort((a,b) => a-b).join(", ")}</td>
                <td>{new Date(item.dateStart).toLocaleDateString("vi-VN")} - {new Date(item.dateEnd).toLocaleDateString("vi-VN")}</td>
                <td>{getFormattedPrice(item.price)}</td>
                <td>{item.payment}</td>
                <td><strong>{item.status}</strong></td>
              </tr>
            )
            )}
          </tbody>
        </table>
        }

      <MailList/>
      <Footer/>
      </div>
    </>
  );
};

export default Transaction;
