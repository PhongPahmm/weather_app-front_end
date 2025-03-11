import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./ModalHourlyDetail.scss";

const ModalHourlyDetail = (props) => {
  const { show, setShow, data } = props;

  const handleClose = () => setShow(false);
  console.log("modalDetail", data);

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Weather Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {data && data.main && data.weather && data.wind ? (
            <div className="weather-card">
              <div className="date-time">
                {data.dt !== undefined
                  ? new Date(data.dt * 1000).toLocaleDateString("en-US")
                  : "N/A"}
                ,{" "}
                {data.dt !== undefined
                  ? new Date(data.dt * 1000).toLocaleTimeString("en-US")
                  : "N/A"}
              </div>
              <div className="weather-icon">
                {data.weather[0] ? (
                  <img
                    src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
                    alt="weather icon"
                  />
                ) : (
                  "No icon"
                )}
              </div>
              <div className="temperature">
                {data.main.temp !== undefined
                  ? Math.round(data.main.temp)
                  : "N/A"}
                °C
                <div className="temp-range">
                  ↓{" "}
                  {data.main.temp_min !== undefined
                    ? Math.round(data.main.temp_min)
                    : "N/A"}
                  ° ↑{" "}
                  {data.main.temp_max !== undefined
                    ? Math.round(data.main.temp_max)
                    : "N/A"}
                  °
                </div>
              </div>
              <div className="description">
                {data.weather[0]?.description || "No description"}
              </div>
              <div className="extra-info">
                <div className="info-box">
                  💧{" "}
                  {data.main.humidity !== undefined
                    ? data.main.humidity
                    : "N/A"}
                  %
                </div>
                <div className="info-box">
                  💨 {data.wind.speed !== undefined ? data.wind.speed : "N/A"}{" "}
                  m/s
                </div>
              </div>
            </div>
          ) : (
            "No data available"
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

export default ModalHourlyDetail;
