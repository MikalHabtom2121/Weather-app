import style from "../mycss/Dailyinfo.module.css";
function Dailyinfo({ data }) {
  const getDay = (date) => {
    return ["Sun", "Mon", "Tue", "Wend", "Thur", "Fri", "Sat"][
      new Date(date).getDay()
    ];
  };
  const icon = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
  return (
    <div className={style.container}>
      <h5>{getDay(data.date)}</h5>
      <img src={icon} className={style.img} />
      <p>{data.temp}</p>
    </div>
  );
}
export default Dailyinfo;
