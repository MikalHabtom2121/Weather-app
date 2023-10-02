import { useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Today from "./component/Today";

function App() {
  const [data, setData] = useState(null);
  const [suggest, setSuggest] = useState([]);
  const input = useRef(null);

  const handleClick = (city) => {
    input.current.value = city;
    const manualEnter = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
      target: input.current.value,
    });
    keyPress(manualEnter);
    console.log("pressed enter");
  };
  const autofill = (e) => {
    const cities = localStorage.getItem("city")
      ? JSON.parse(localStorage.getItem("city"))
      : [];
    if (cities && e.target.value) {
      setSuggest((prev) =>
        cities.filter((city) => city.startsWith(e.target.value))
      );
    }
    if (!e.target.value) {
      setSuggest(() => []);
    }
  };
  async function keyPress(e) {
    if (e.which == 13 && e.target.value) {
      await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${e.target.value}&APPID=ApiKey`
      )
        .then((resp) => resp.json())
        .then((api_data) => {
          if (api_data.cod === "200") {
            console.log(api_data);
            const dailyWeather = getDayIndices(api_data);
            setData({ city: e.target.value, weatherData: dailyWeather });

            localStorage.setItem(
              "city",
              JSON.stringify([...cities, e.target.value])
            );
            return true;
          } else return false;
        });
    }
  }
  const getDayIndices = (data) => {
    console.log(data);
    let dayIndices = [];
    dayIndices.push(0);

    let index = 0;
    let tmp = data.list[index].dt_txt.slice(8, 10);

    for (let i = 0; i < 4; i++) {
      while (
        tmp === data.list[index].dt_txt.slice(8, 10) ||
        data.list[index].dt_txt.slice(11, 13) !== "15"
      ) {
        index++;
      }
      dayIndices.push(index);
      tmp = data.list[index].dt_txt.slice(8, 10);
    }
    console.log(dayIndices);
    return sanitizeData(dayIndices, data);
  };
  const sanitizeData = (dayIndices, data) => {
    const days = [];
    for (let i = 0; i < 5; i++) {
      days.push({
        date: data.list[dayIndices[i]].dt_txt,
        weather_desc: data.list[dayIndices[i]].weather[0].description,
        icon: data.list[dayIndices[i]].weather[0].icon,
        temp: data.list[dayIndices[i]].main.temp,
      });
    }
    console.log(days);
    return days;
  };

  return (
    <>
      <div style={{ margin: "25px", position: "relative" }}>
        <input
          type="text"
          placeholder="Enter a city ..."
          className="input"
          ref={input}
          onKeyUp={(e) => keyPress(e)}
          onChange={(e) => autofill(e)}
        />
        <div
          style={{
            width: "200px",
            position: "absolute",
            top: "20px",
            left: "30%",
          }}
        >
          {" "}
          {suggest.map((city, index) => (
            <p
              onClick={() => handleClick(city)}
              style={{ cursor: "pointer" }}
              key={index}
            >
              {city}
            </p>
          ))}
        </div>
      </div>

      <div className="mainContainer"> {data && <Today data={data} />}</div>
    </>
  );
}

export default App;
