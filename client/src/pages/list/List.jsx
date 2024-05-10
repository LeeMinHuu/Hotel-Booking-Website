import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useHttp from "../../hooks/use-http";

const List = (props) => {
  const location = useLocation();
  const [destination, setDestination] = useState(location.state.destination);
  const [date, setDate] = useState(location.state.date);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state.options);

  const newDate = {
    checkin: date[0].startDate.toISOString().split('T', 1)[0],
    checkout: date[0].endDate.toISOString().split('T', 1)[0]
  }
  console.log(newDate)
  
  const { data: searchData, fetchApi: searchFetchApi } = useHttp({url: `http://localhost:5000/hotels/search?city=${destination}&checkin=${newDate.checkin}&checkout=${newDate.checkout}&rooms=${options.room}`});

  useEffect(() => {
    searchFetchApi()
  },[searchFetchApi])

  return (
    <div>
      <Navbar isLoggedIn={props.isLoggedIn} setIsLoggedIn={props.setIsLoggedIn} email={props.email} username={props.username} />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input placeholder={destination} type="text" />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                date[0].startDate,
                "dd/MM/yyyy"
              )} to ${format(date[0].endDate, "dd/MM/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDate([item.selection])}
                  minDate={new Date()}
                  ranges={date}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input type="number" className="lsOptionInput" />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input type="number" className="lsOptionInput" />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.adult}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={options.children}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.room}
                  />
                </div>
              </div>
            </div>
            <button>Search</button>
          </div>
          <div className="listResult">
            {/* <SearchItem />
            <SearchItem />
            <SearchItem /> */}
            {searchData.map(item => 
            <SearchItem 
              _id={item._id}
              name={item.name}
              distance={item.distance}
              tag={item.tag}
              type={item.type}
              description={item.desc}
              free_cancel={item.free_cancel}
              price={item.cheapestPrice}
              rate={item.rating}
              rate_text={item.rate_text}
              img_url={item.photos[0]} 
            />)}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default List;
