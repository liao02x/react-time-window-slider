import React, { useState } from "react";
import moment from "moment";
import TimeWindowSlider from "react-time-window-slider";
import "react-time-window-slider/dist/css/style.css";

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
  const [window] = useState(moment.duration(6, "hours"));
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
    <React.Fragment>
      <div>
        <span>Out Time: {time.format("hh:mm a")}</span>
      </div>
      <div style={{ width: "500px", margin: "20px" }}>
        <div className="time-range-slider">
          <TimeWindowSlider
            disabled={false}
            time={time}
            window={window}
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
    </React.Fragment>
  );
};

export default App;
