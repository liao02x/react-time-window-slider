import React, { useState } from "react";
import InputRange from "react-input-range";
import moment from "moment";
import "./timeWindowSlider.scss";

export default function TimeWindowSlider ({
  disabled,
  time: propsTime,
  timeWindow,
  bounds,
  onChangeStart: propsOnChangeStart = () => {},
  onChangeComplete: propsOnChangeComplete = () => {},
  onChange: propsOnChange = () => {},
  formatLabel = time => time.format("HH:mm"),
  step = 1,
  eta
}) {
  const timeRadius = moment.duration(timeWindow.asMinutes() / 2, "minutes");
  const [time, setTime] = useState({
    min: moment(propsTime).subtract(timeRadius),
    max: moment(propsTime).add(timeRadius)
  });

  const validateTime = ({ min, max }) => {
    const minMoment = moment.unix(min)
    const maxMoment = moment.unix(max)
    let start, end;
    if (
      minMoment <= bounds.minValue ||
      maxMoment >= bounds.maxValue ||
      minMoment.isSame(time.min) ||
      maxMoment.isSame(time.max)
    ) {
      start = time.min;
      end = time.max;
    } else {
      start = minMoment;
      end = maxMoment;
    }

    const time = moment((start + end) / 2);

    return { start, end, time };
  };

  const onChange = ({ min, max }) => {
    const { start, end, time } = validateTime({ min, max });

    setTime({
      min: start,
      max: end
    });

    propsOnChange(time);
  };

  const onChangeStart = ({ min, max }) => {
    const { time } = validateTime({ min, max });

    propsOnChangeStart(time);
  };

  const onChangeComplete = ({ min, max }) => {
    const { time } = validateTime({ min, max });

    propsOnChangeComplete(time);
  };

  const getColorForSlider = () => {
    const secondsFromEta = moment((time.min + time.max) / 2).diff(
      eta,
      "seconds"
    );
    const ratio = Math.abs(secondsFromEta / timeRadius.asSeconds());
    if (ratio < 1 / 3) {
      return "time-away-from-target--short";
    } else if (ratio < 2 / 3) {
      return "time-away-from-target--middle";
    } else {
      return "time-away-from-target--long";
    }
  };

  const renderScales = () => {
    const scales = [
      ...Array(
        moment.duration(bounds.maxValue.diff(bounds.minValue)).asHours() + 1
      ).keys()
    ]
      .map(i => moment(bounds.minValue).add(i, "hours"))
      .filter((_, index) => index % 2 === 0);

    return (
      <div className="time-window-scales">
        {scales.map((scale, index) => (
          <div className="time-window-scale" key={index}>
            <div className="time-window-scale__pointer" />
            <span>{scale.format("ha")}</span>
          </div>
        ))}
      </div>
    );
  };

  const calculatePositionForLabel = () => {
    const totalPeriod = moment
      .duration(bounds.maxValue.diff(bounds.minValue))
      .asSeconds();
    const labelPeriod = moment.duration(eta.diff(bounds.minValue)).asSeconds();
    return (labelPeriod / totalPeriod) * 100 + "%";
  };

  return (
    <div className="time-window-slider">
      <div className="time-window-input">
        <div
          className={
            eta ? getColorForSlider() : "time-away-from-target--default"
          }
        />
        <InputRange
          disabled={disabled}
          draggableTrack
          maxValue={bounds.maxValue.unix()}
          minValue={bounds.minValue.unix()}
          onChangeStart={onChangeStart}
          onChange={onChange}
          onChangeComplete={onChangeComplete}
          step={step}
          value={{
            min: time.min.unix(),
            max: time.max.unix()
          }}
          formatLabel={value => formatLabel(moment.unix(value))}
        />
        <div className="time-window-scales__container">
          {renderScales()}
          {eta && (
            <div className="time-window-scales__label-container">
              {eta <= bounds.maxValue && eta >= bounds.minValue && (
                <div
                  className="time-window-scale"
                  style={{
                    position: "absolute",
                    left: calculatePositionForLabel(),
                    bottom: "100%"
                  }}
                >
                  <span>{eta.format("HH:mm")}</span>
                  <div className="time-window-scale__pointer" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
