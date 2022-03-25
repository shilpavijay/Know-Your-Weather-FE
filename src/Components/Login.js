import React, { useState } from "react";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import "./login.css";
import { Navigate } from "react-router-dom";
import axios from "axios";
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

function Login() {
  const [isValidUser, setIsValidUser] = useState(false);
  let expire_time = parseInt(process.env.REACT_APP_EXPIRY);
  let expiredAt = new Date(new Date().getTime() + expire_time);

  const handleSubmit = (event) => {
    event.preventDefault();
    const username = event.target.username.value || " ";
    const password = event.target.password.value || " ";

    axios
      .get(setUrl() + "api/v1/login", {
        params: { username, password },
      })
      .then((res) => {
        if (res.status === 200) {
          setIsValidUser(true);
          sessionStorage.setItem("isValidUser", "true");
          sessionStorage.setItem("expiry", expiredAt.toISOString());
          Sentry.captureMessage("Get request successful");
        }
      })

      .catch(function (error) {
        if (error.response) {
          Sentry.captureException(error.response.data);
          Sentry.captureException(error.response.status);
          alert("Invalid Credentials. Please Sign up or try again");
          window.location.reload();
        }
      });
  };

  if (isValidUser) {
    return <Navigate to="/home" />;
  }

  const handleSignup = (event) => {
    event.preventDefault();
    const username = event.target.username1.value || " ";
    const password = event.target.password1.value || " ";
    const email = event.target.email1.value || " ";

    axios
      .get(setUrl() + "api/v1/signup", {
        params: { username, password, email },
      })
      .then((res) => {
        console.log(res.status);
        if (res.status === 201) {
          alert("Account Created. Please login");
          window.location.reload();
        }
      })
      .catch(function (error) {
        if (error.response) {
          Sentry.captureException(error.response.data);
          Sentry.captureException(error.response.status);
          alert("Account already exists. Please Login!");
          window.location.reload();
        }
      });
  };

  return (
    <div>
      <Container>
        <h1 className="title">{"Know your Weather"}</h1>
        <Row>
          <Col xs={5}>
            <Form onSubmit={handleSubmit}>
              <h5 className="title">{"LOGIN"}</h5>
              <Form.Group as={Row} className="mb-3" controlId="username">
                <Form.Label column sm={2}>
                  Username
                </Form.Label>
                <Col sm={10}>
                  <Form.Control type="text" placeholder="Username" />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" controlId="password">
                <Form.Label column sm={2}>
                  Password
                </Form.Label>
                <Col sm={10}>
                  <Form.Control type="password" placeholder="Password" />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" controlId="formCheck">
                <Col sm={{ span: 10, offset: 2 }}>
                  <Form.Check label="Remember me" />
                </Col>
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>

          <Col xs={2}></Col>
          <Col xs={5}>
            <Form onSubmit={handleSignup}>
              <h5 className="title">{"SIGN UP"}</h5>
              <Form.Group as={Row} className="mb-3" controlId="username1">
                <Form.Label column sm={2}>
                  Username
                </Form.Label>
                <Col sm={10}>
                  <Form.Control type="text" placeholder="Username" />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" controlId="email1">
                <Form.Label column sm={2}>
                  Email
                </Form.Label>
                <Col sm={10}>
                  <Form.Control type="email" placeholder="Email" />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" controlId="password1">
                <Form.Label column sm={2}>
                  Password
                </Form.Label>
                <Col sm={10}>
                  <Form.Control type="password" placeholder="Password" />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formHorizontalCheck"
              >
                <Col sm={{ span: 10, offset: 2 }}>
                  <Form.Check label="Remember me" />
                </Col>
              </Form.Group>

              <Button variant="dark" type="submit">
                Sign Up
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
