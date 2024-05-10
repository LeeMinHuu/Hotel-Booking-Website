import React, { useEffect, useState, useRef } from 'react';
import { DateRange } from "react-date-range";
import "./bookingForm.css"
import useHttp from '../../hooks/use-http';
import { useNavigate } from 'react-router-dom';

const BookingForm = (props) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    identityCardNumber: '',
    checkInDate: '',
    checkOutDate: '',
    hotel: '',
    rooms: '',
    totalPrice: '',
    payment: '',
    status: ''
  });

  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

const [payment,setPayment]=useState(null);

const getFormattedPrice = (price) => `VND ${price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}.000`;


const [stayDays,setStayDays] = useState(1);
  
  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  // Handle RoomNumber Checkbox
  const rooms = props.hotelDetailData.rooms;

  const [checkedItems, setCheckedItems] = useState({});
  // const [oneNightPrice, setOneNightPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkedRoomNumbers, setCheckedRoomNumbers] = useState([]);
  const [checkedRoomIds, setCheckedRoomIds] = useState([]); 


  // Function
  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    const roomNumber = event.target.name;

    // Find roomNumber and price
    let price = 0;
    let roomIds = [];
    for (let room of rooms) {
      if (room.roomNumbers.includes(parseInt(roomNumber))) {
        price = room.price;
        roomIds = room._id;
        break;
      }
    }
    console.log(roomIds)
    setCheckedItems({ ...checkedItems, [roomNumber]: isChecked });

// Update Total Price
    if (isChecked) {
      setTotalPrice(totalPrice + price * stayDays);
      setCheckedRoomNumbers([...checkedRoomNumbers, roomNumber]);
      setCheckedRoomIds([...checkedRoomIds, roomIds]);
    } else {
      setTotalPrice(totalPrice - price * stayDays);
      setCheckedRoomNumbers(
        checkedRoomNumbers.filter((number) => number !== roomNumber)
      );
      setCheckedRoomIds(checkedRoomIds.filter(id => !roomIds.includes(id))); 
    }

  };
  console.log(checkedRoomIds)

  const requestBody = {
      user: props.id,
      hotel: props.hotelDetailData._id,
      room: checkedRoomNumbers,
      roomId: checkedRoomIds,
      dateStart: date[0].startDate,
      dateEnd: date[0].endDate,
      price: totalPrice,
      payment: payment,
      status: "Booked",
      createdAt: new Date().toLocaleString(),
  }

  const { data: formDataPost, fetchApi: formDataPostApi } = useHttp({
    url: "http://localhost:5000/booking",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: requestBody
  })
  console.log(requestBody);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Send data to server
    formDataPostApi();
    console.log(formDataPost);

    // Navigate after booking
    if(formDataPost) {
      navigate("/transaction");
      // window.location.reload();
    } else alert("Something went wrong!")
    
  };


  useEffect(() => {
    if(props.isLoggedIn)  {
      setFormData({ ...formData, 
        fullName: props.fullName, 
        email: props.email, 
        phoneNumber: props.phoneNumber,
        checkInDate: date[0].startDate.toISOString().substring(0, 10), 
        checkOutDate: date[0].endDate.toISOString().substring(0, 10)
      });
    } else {
      setFormData({ ...formData, 
        checkInDate: date[0].startDate.toISOString().substring(0, 10), 
        checkOutDate: date[0].endDate.toISOString().substring(0, 10)
       });
    }
    setStayDays(Math.round((date[0].endDate - date[0].startDate)/(1000 * 3600 * 24)));
  },[date]);

  return (
    <>
      {!props.isLoggedIn && <h1 style={{textAlign: "center"}}>Please Login to continue...</h1>}
      {props.isLoggedIn && 
      <div className="bookingForm">
        <div className="datePicker">
          <h2 style={{textAlign: "center"}}>Check-in - Check-out</h2>
          <DateRange
          editableDateInputs={true}
          onChange={(item) => setDate([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={date}
          minDate={new Date()}
          />
        </div>

      <div className="inputContainer">
        <h2>Reverse Info</h2>
          <input type="text" value={formData.fullName} placeholder="Your full name" name="fullName" onChange={handleChange} className="inputBox" required />
          <br />

          <input type="email" value={formData.email} placeholder="Your email" name="email"   onChange={handleChange} className="inputBox" required />
          <br />

          <input type="tel" value={formData.phoneNumber} placeholder="Your phone number" name="phoneNumber" onChange={handleChange} className="inputBox" required />
          <br />

          <input type="text" value={formData.identityCardNumber} placeholder="Your identity card number" name="identityCardNumber" onChange={handleChange} className="inputBox" />
          <br />
      </div>

      

      <div className="bottom">
        <h2>Select Rooms</h2>

        {date[0].startDate ? 
        <p>Pay nothing until {date[0].startDate.toLocaleDateString("vi-VN").split(' ')[0]}
        <br />
        Free cancellation before {date[0].startDate.toLocaleDateString("vi-VN").split(' ')[0]}
        <br />
        </p>        
        : ""
        }
        
        <div className="selectRooms">
          {rooms.map((room, index) => (
            <div className="roomDetail" key={index}>
            <h3 style={{textTransform: "uppercase"}}>
              {room.title}
            </h3>

            {room.roomNumbers.map((roomNumber, index) => (
            <label key={index}>
              <input
                  type="checkbox"
                  name={roomNumber}
                  value={{roomNumber} || "" }
                  checked={checkedItems[roomNumber]}
                  onChange={handleCheckboxChange}
                />
              <div className="label">{roomNumber}</div>
            </label>
            ))}
            <div style={{display: "block", height: "50px", padding: "10px", fontStyle: "italic"}}><p>{room.desc}</p></div>
            
            <p style={{fontWeight: "bold", fontSize: "20px"}}>Max People: {room.maxPeople}</p>
            <p style={{fontWeight: "bold", fontSize: "20px"}}>Price: {room.price}.000 VNĐ</p>
            </div>
          ))}


        </div>
      </div>
      <div className="bottom">
      {/* {!dateSelectedState ? <p>Please select date!</p> : ""} */}
      <p style={{fontWeight: "bold", fontSize: "40px", alignSelf: "center"}}>Total Bill: {getFormattedPrice(totalPrice)}</p>      
      <p style={{fontSize: "20px", alignSelf: "center"}}>Selected Rooms: {checkedRoomNumbers.sort((a,b) => a-b).join(", ")}</p>      
  
        <br />
        <select name="payment" id="payment" className="inputBox" onChange={(e)=>{setPayment(e.target.value)}} required>
          <option value="" selected disabled hidden>Select Payment Method</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Cash">Cash</option>
        </select>
      <div className="buttonContainer">
      <button type="submit" className="inputButton" onClick={handleSubmit}>Reserve Now</button>
      </div>
      </div>
    </div>
    }
    </>
  );
};

export default BookingForm;