import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import BookingForm from "../../components/bookingForm/BookingForm";

const Hotel = (props) => {
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  // const photos = [
  //   {
  //     src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707778.jpg?k=56ba0babbcbbfeb3d3e911728831dcbc390ed2cb16c51d88159f82bf751d04c6&o=&hp=1",
  //   },
  //   {
  //     src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707367.jpg?k=cbacfdeb8404af56a1a94812575d96f6b80f6740fd491d02c6fc3912a16d8757&o=&hp=1",
  //   },
  //   {
  //     src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261708745.jpg?k=1aae4678d645c63e0d90cdae8127b15f1e3232d4739bdf387a6578dc3b14bdfd&o=&hp=1",
  //   },
  //   {
  //     src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707776.jpg?k=054bb3e27c9e58d3bb1110349eb5e6e24dacd53fbb0316b9e2519b2bf3c520ae&o=&hp=1",
  //   },
  //   {
  //     src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261708693.jpg?k=ea210b4fa329fe302eab55dd9818c0571afba2abd2225ca3a36457f9afa74e94&o=&hp=1",
  //   },
  //   {
  //     src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707389.jpg?k=52156673f9eb6d5d99d3eed9386491a0465ce6f3b995f005ac71abc192dd5827&o=&hp=1",
  //   },
  // ];

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber)
  };

const handleBookingForm = () => {
    setBookingForm(!bookingForm)
    // navigate(`/hotels/${id}`, { state: { bookingForm } });
  };

  const { data: hotelDetailData, fetchApi: hotelDetailFetchApi } = useHttp({url: `http://localhost:5000/hotels/${id}`});

  useEffect(() => {
    hotelDetailFetchApi()
  }, [hotelDetailFetchApi])
  
  const photos = hotelDetailData.photos;
  console.log(hotelDetailData.rooms)

  return (
    <div>
      <Navbar isLoggedIn={props.isLoggedIn} setIsLoggedIn={props.setIsLoggedIn} email={props.email} username={props.username} />
      <Header type="list" isLoggedIn={props.isLoggedIn} setIsLoggedIn={props.setIsLoggedIn} email={props.email} username={props.username} />
      <div className="hotelContainer">

        {open && (
          <div className="slider">
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="close"
              onClick={() => setOpen(false)}
            />
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className="arrow"
              onClick={() => handleMove("l")}
            />
            <div className="sliderWrapper">
              <img src={photos[slideNumber]} alt="" className="sliderImg" />
            </div>
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className="arrow"
              onClick={() => handleMove("r")}
            />
          </div>
        )}

        <div className="hotelWrapper">
          <button className="bookNow" onClick={handleBookingForm}>Reserve or Book Now!</button>
          <h1 className="hotelTitle">{hotelDetailData.name}</h1>
          <div className="hotelAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{hotelDetailData.address}</span>
          </div>
          <span className="hotelDistance">
            Excellent location – {hotelDetailData.distance}m from center
          </span>
          <span className="hotelPriceHighlight">
            Book a stay over {hotelDetailData.cheapestPrice}.000 VNĐ at this property and get a free airport taxi
          </span>

          <div className="hotelImages">
            {photos && photos.map((photo, i) => (
              <div className="hotelImgWrapper" key={i}>
                <img
                  onClick={() => handleOpen(i)}
                  src={photo}
                  alt=""
                  className="hotelImg"
                />
              </div>
            ))}
          </div>
          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              <h1 className="hotelTitle">{hotelDetailData.title}</h1>
              <p className="hotelDesc">
                {hotelDetailData.desc}
              </p>
            </div>
            <div className="hotelDetailsPrice">
              <h1>Perfect for staying!</h1>
              <span>
                Located in {hotelDetailData.city}, this property has an
                excellent location score of {hotelDetailData.rating}/5!
              </span>
              <h2>
                <b>VNĐ {hotelDetailData.cheapestPrice}.000</b> (1 night)
              </h2>
              <button onClick={handleBookingForm}>Reserve or Book Now!</button>
            </div>
          </div>
          {bookingForm && <BookingForm 
              header={props.header}
              id={props.id}              
              isLoggedIn={props.isLoggedIn}
              email={props.email}
              username={props.username}
              isAdmin={props.isAdmin}
              phoneNumber={props.phoneNumber}
              fullName={props.fullName} 
              hotelDetailData={hotelDetailData} />}
        </div>

        
        <MailList />
        <Footer />
      </div>
    </div>
  );
};

export default Hotel;
