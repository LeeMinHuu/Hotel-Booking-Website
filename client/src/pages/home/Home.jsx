import axios from "axios";
import Featured from "../../components/featured/Featured";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import PropertyList from "../../components/propertyList/PropertyList";
import "./home.css";
import useHttp from '../../hooks/use-http';
import { useEffect } from "react";

const Home = (props) => {
    // Fetch data By City
    const { data: hotelsInHn, fetchApi: hotelsInHnFetchApi } = useHttp({url: "http://localhost:5000/hotels?city=hn"});
    const { data: hotelsInHcm, fetchApi: hotelsInHcmFetchApi } = useHttp({url: "http://localhost:5000/hotels?city=hcm"});
    const { data: hotelsInDng, fetchApi: hotelsInDngFetchApi } = useHttp({url: "http://localhost:5000/hotels?city=dng"});
    
    // Fetch data By Type
    const { data: hotelType, fetchApi: hotelTypeFetchApi } = useHttp({url: "http://localhost:5000/hotels?type=hotel"});
    const { data: apartmentsType, fetchApi: apartmentsTypeFetchApi } = useHttp({url: "http://localhost:5000/hotels?type=apartments"});
    const { data: resortsType, fetchApi: resortsTypeFetchApi } = useHttp({url: "http://localhost:5000/hotels?type=resorts"});
    const { data: villasType, fetchApi: villasTypeFetchApi } = useHttp({url: "http://localhost:5000/hotels?type=villas"});
    const { data: cabinsType, fetchApi: cabinsTypeFetchApi } = useHttp({url: "http://localhost:5000/hotels?type=cabins"});
    
    // Fetch Top Rated
    const { data: topRated, fetchApi: topRatedFetchApi } = useHttp({url: "http://localhost:5000/hotels?topRated=true"});

  useEffect(() => {
    // Fetch By City
    hotelsInHnFetchApi();
    hotelsInHcmFetchApi();
    hotelsInDngFetchApi();  

    // Fetch By Type
    hotelTypeFetchApi();
    apartmentsTypeFetchApi();
    resortsTypeFetchApi();
    villasTypeFetchApi();
    cabinsTypeFetchApi();

    // Fetch Top Rated
    topRatedFetchApi();
  },[
    hotelsInHnFetchApi,
    hotelsInHcmFetchApi,
    hotelsInDngFetchApi,
    hotelTypeFetchApi,
    apartmentsTypeFetchApi,
    resortsTypeFetchApi,
    villasTypeFetchApi,
    cabinsTypeFetchApi,
    topRatedFetchApi
  ]);

  return (
    <div>
      <Navbar isLoggedIn={props.isLoggedIn} setIsLoggedIn={props.setIsLoggedIn} email={props.email} username={props.username} />
      <Header isLoggedIn={props.isLoggedIn} email={props.email} username={props.username} />
      <div className="homeContainer">
        <Featured 
        hotelsInDng={hotelsInDng} hotelsInHn={hotelsInHn} hotelsInHcm={hotelsInHcm} 
        />
        <h1 className="homeTitle">Browse by property type</h1>
        <PropertyList hotel={hotelType} apartments={apartmentsType} resorts={resortsType} villas={villasType} cabins={cabinsType} />
        <h1 className="homeTitle">Homes guests love</h1>
        <FeaturedProperties list={topRated} />
        <MailList/>
        <Footer/>
      </div>
    </div>
  );
};

export default Home;
