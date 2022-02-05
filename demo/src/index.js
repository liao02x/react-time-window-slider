import React, { useState } from "react";
import { render } from "react-dom";
import moment from "moment";
import TimeWindowSlider from "../../src";

const App = () => {
  const [time, setTime] = useState(moment());
  const [bounds, setBounds] = useState({
    maxValue: moment(time)
      .add(6, "hours")
      .set("minute", 0)
      .set("second", 0)
      .set("millisecond", 0),
    minValue: moment(time)
      .subtract(6, "hours")
      .set("minute", 0)
      .set("second", 0)
      .set("millisecond", 0)
  });
  const [timeWindow] = useState(moment.duration(6, "hours"));
  const [eta] = useState(
    moment()
      .set("hour", 13)
      .set("minute", 14)
      .set("second", 0)
      .set("millisecond", 0)
  );

  const changeStartHandler = time => {
    console.log("Start Handler Called", time);
  };

  const timeChangeHandler = time => {};

  const changeCompleteHandler = time => {
    setTime(time);
    setBounds({
      maxValue: moment(time)
        .add(6, "hours")
        .set("minute", 0)
        .set("second", 0)
        .set("millisecond", 0),
      minValue: moment(time)
        .subtract(6, "hours")
        .set("minute", 0)
        .set("second", 0)
        .set("millisecond", 0)
    });
  };

  const formatLabel = time => time.format("hh:mm a");

  return (
    <div>
      <div>
        <span>Time: {time.format("hh:mm a")}</span>
        <span>ETA: {eta.format("hh:mm a")}</span>
      </div>
      <div style={{ width: "500px", margin: "20px" }}>
        <TimeWindowSlider
          disabled={false}
          time={time}
          timeWindow={timeWindow}
          bounds={bounds}
          onChangeStart={changeStartHandler}
          onChangeComplete={changeCompleteHandler}
          onChange={timeChangeHandler}
          formatLabel={formatLabel}
          step={1}
          eta={eta}
        />
      </div>
    </div>
  );
};

render(<App />, document.querySelector("#demo"));
