import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./ModalDailyDetail.scss";

const ModalDailyDetail = (props) => {
  const { show, setShow, data } = props;

  const handleClose = () => setShow(false);
  console.log("modalDetail", data);

  // Tính nhiệt độ tối thiểu và tối đa từ mảng temperatures
  const getMinTemperature = () => {
    return data.temperatures && data.temperatures.length > 0
      ? Math.min(...data.temperatures).toFixed(1)
      : "N/A";
  };

  const getMaxTemperature = () => {
    return data.temperatures && data.temperatures.length > 0
      ? Math.max(...data.temperatures).toFixed(1)
      : "N/A";
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Weather Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {data && data.weather ? (
            <div className="weather-card">
              <div className="date-time">
                {data.dt !== undefined
                  ? new Date(data.dt * 1000).toLocaleDateString("en-US")
                  : "N/A"}
              </div>
              <div className="weather-icon">
                {data.weather?.length > 0 ? (
                  <img
                    src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
                    alt="weather icon"
                  />
                ) : (
                  "No icon"
                )}
              </div>
              <div className="temperature">
                {data.averageTemp !== undefined
                  ? Math.round(data.averageTemp)
                  : "N/A"}
                °C
                <div className="temp-range">
                  ↓ {getMinTemperature()}° ↑ {getMaxTemperature()}°
                </div>
              </div>
              <div className="description">
                {data?.weather?.length > 0
                  ? data.weather[0].description
                  : "No description"}
              </div>
              <div className="extra-info">
                <div className="info-box">
                  💧{" "}
                  {data.main?.humidity !== undefined
                    ? data.main.humidity
                    : "N/A"}
                  %
                </div>
                <div className="info-box">
                  💨 {data.wind?.speed !== undefined ? data.wind.speed : "N/A"}{" "}
                  m/s
                </div>
              </div>
            </div>
          ) : (
            <div>Loading data...</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalDailyDetail;
