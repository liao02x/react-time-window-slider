import React, { useState } from "react";
import InputRange from "react-input-range";
import moment from "moment";
import "./timeWindowSlider.css";

const TimeWindowSlider = ({
  disabled,
  time: parentTime,
  window: parentWindow,
  bounds,
  onChangeStart: parentOnChangeStart,
  onChangeComplete: parentOnChangeComplete,
  onChange: parentOnChange,
  formatLabel: parentFormatLabel,
  step,
  eta: parentEta = null
}) => {
  const window = moment.duration(parentWindow.asMinutes() / 2, "minutes");
  const [time, setTime] = useState({
    min: moment(parentTime.time).subtract(window),
    max: moment(parentTime.time).add(window)
  });
  const [eta] = useState(parentEta);

  const validateTime = ({ min, max }) => {
    let newStart, newEnd;
    if (
      moment.unix(min) <= bounds.minValue ||
      moment.unix(max) >= bounds.maxValue ||
      moment.unix(min).isSame(time.min) ||
      moment.unix(max).isSame(time.max)
    ) {
      newStart = time.min;
      newEnd = time.max;
    } else {
      newStart = moment.unix(min);
      newEnd = moment.unix(max);
    }

    const newTime = moment((newStart + newEnd) / 2);

    return { newStart, newEnd, newTime };
  };

  const onChange = ({ min, max }) => {
    const { newStart, newEnd, newTime } = validateTime({ min, max });

    setTime({
      min: newStart,
      max: newEnd
    });
    parentOnChange(newTime);
  };

  const onChangeStart = ({ min, max }) => {
    const { newTime } = validateTime({ min, max });

    parentOnChangeStart(newTime);
  };

  const onChangeComplete = ({ min, max }) => {
    const { newTime } = validateTime({ min, max });

    parentOnChangeComplete(newTime);
  };

  const formatLabel = time =>
    parentFormatLabel ? parentFormatLabel(time) : time.format("HH:mm");

  const getColorForSlider = () => {
    const timeAwayFromEta = moment((time.min + time.max) / 2).diff(
      eta,
      "seconds"
    );
    const windowToSeconds = window.asSeconds();
    const ratio = Math.abs(timeAwayFromEta / windowToSeconds);
    console.log(timeAwayFromEta / windowToSeconds);
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
      .filter((scale, index) => index % 2 === 0);

    return (
      <React.Fragment>
        {scales.map(scale => (
          <div className="time-window-scale">
            <div className="time-window-scale__pointer"></div>
            <span>{scale.format("ha")}</span>
          </div>
        ))}
      </React.Fragment>
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
        ></div>
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
        <div style={{ position: "relative", height: "16px" }}>
          <div className="time-window-scales">{renderScales()}</div>
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
                  <div className="time-window-scale__pointer"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

TimeWindowSlider.defaultProps = {
  disabled: false,
  onChange: () => {},
  onChangeComplete: () => {},
  onChangeStart: () => {},
  step: 1
};

export default TimeWindowSlider;
