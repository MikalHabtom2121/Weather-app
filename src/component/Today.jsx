import style from "../mycss/Today.module.css";
import Dailyinfo from "./Dailyinfo";
const Today = ({ data }) => {
  console.log(data);
  const icon = `https://openweathermap.org/img/wn/${data.weatherData[0].icon}@2x.png`;
  const nextDays = data.weatherData.slice(1);
  const Dailyinfos = nextDays.map((data, index) => (
    <Dailyinfo key={index} data={data} />
  ));
  return (
    <>
      <div className={style.container}>
        <img src={icon} className={style.img} />
        <div>
          <p>Today</p>
          <h1>{data.city}</h1>
          <p>Temperature: {data.weatherData[0].temp}</p>
          <p>{data.weatherData[0].weather_desc}</p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        {Dailyinfos}
      </div>
    </>
  );
};
export default Today;
