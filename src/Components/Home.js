import { React, useState } from "react";
import {
  Col,
  Container,
  Form,
  Row,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import "./home.css";
import axios from "axios";
import { Navigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "https://3539b88db17548dcb4313fb3c2e353c7@o1174977.ingest.sentry.io/6271485",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

function setUrl() {
  let base_url;
  if (process.env.NODE_ENV === "development") {
    base_url = process.env.REACT_APP_LOCAL_BASE_URL;
  } else {
    base_url = process.env.REACT_APP_PROD_BASE_URL;
  }
  return base_url;
}

function Home() {
  const [weatherinfo, setWeatherinfo] = useState([]);
  const [isLogout, setLogout] = useState(false);

  const onSearchHandler = (event) => {
    event.preventDefault();
    const city = event.target.searchString.value;

    axios
      .get(setUrl() + "api/v1/search", {
        params: { city },
      })
      .then((res) => {
        if (res.status === 200) {
          setWeatherinfo([res.data]);
        }
      })
      .catch(function (error) {
        if (error.response) {
          Sentry.captureException(error.response.data);
          Sentry.captureException(error.response.status);
        }
      });
  };

  const handleLogout = (event) => {
    event.preventDefault();
    axios
      .get(setUrl() + "api/v1/logout")
      .then((res) => {
        if (res.status === 200) {
          alert("Logged out Successfully");
          setLogout(true);
          sessionStorage.setItem("isValidUser", "false");
        }
      })
      .catch(function (error) {
        if (error.response) {
          Sentry.captureException(error.response.data);
          Sentry.captureException(error.response.status);
        }
      });
  };

  if (isLogout) {
    return <Navigate to="/" />;
  }

  function isLoggedIn() {
    const auth = sessionStorage.getItem("isValidUser");
    const expiry = new Date(sessionStorage.getItem("expiry"));
    const current_time = new Date(new Date().getTime());
    if (auth === "true" && current_time <= expiry) {
      return true;
    } else {
      return false;
    }
  }

  if (isLoggedIn()) {
    return (
      <div>
        <Row className="main">
          <Col xs={11}></Col>
          <Col xs={1}>
            <Button variant="primary" id="logout" onClick={handleLogout}>
              Logout
            </Button>
          </Col>
        </Row>
        <h1 className="title">{"Know your Weather"}</h1>
        <Container>
          <Row>
            <Col xs={3}></Col>
            <Col xs={5}>
              <p>
                Key-in the city to get the <b>Current Weather Condition</b>:
              </p>
              <Form onSubmit={onSearchHandler}>
                <InputGroup className="mb-3">
                  <FormControl
                    id="searchString"
                    placeholder="City Name"
                    aria-label="City Name"
                    aria-describedby="button2"
                  />
                  <Button variant="primary" id="search" type="submit">
                    Search
                  </Button>
                </InputGroup>
              </Form>

              <div className="weather_info">
                {weatherinfo.map((data) => {
                  return (
                    <div>
                      <p key={data.city}>
                        <b>City: </b>
                        {data.city}
                      </p>
                      <p key={data.time}>
                        <b>Time: </b>
                        {data.time}
                      </p>
                      <p key={data.weathertxt}>
                        <b>Weather Condition:</b> {data.weathertxt}
                      </p>
                      <p key={data.precipitation}>
                        <b>Precipitation:</b> {data.precipitation}
                      </p>
                      <p key={data.temperature}>
                        <b>Temperature:</b> {data.temperature}
                      </p>
                      <p key={data.link}>
                        <b>Link to more details:</b>{" "}
                        <a href={data.link}>{data.link}</a>
                      </p>
                    </div>
                  );
                })}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  } else {
    return <Navigate to="/" />;
  }
}

export default Home;
