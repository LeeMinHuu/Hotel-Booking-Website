import "./featured.css";

const Featured = (props) => {

  return (
    <div className="featured">
      <div className="featuredItem">
        <img
          src="images/city_1.jpg"
          alt="Hà Nội"
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Hà Nội</h1>
          <h2>{props.hotelsInHn ? `${props.hotelsInHn.length} properties` : "Loading..."}</h2>
        </div>
      </div>
      
      <div className="featuredItem">
        <img
          src="images/city_2.jpg"
          alt="Hồ Chí Minh"
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Hồ Chí Minh</h1>
          <h2>{props.hotelsInHcm ? `${props.hotelsInHcm.length} properties` : "Loading..."}</h2>
        </div>
      </div>
      <div className="featuredItem">
        <img
          src="images/city_3.jpg"
          alt="Đà Nẵng"
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Đà Nẵng</h1>
          <h2>{props.hotelsInDng ? `${props.hotelsInDng.length} properties` : "Loading..."}</h2>
        </div>
      </div>
    </div>
  );
};

export default Featured;
