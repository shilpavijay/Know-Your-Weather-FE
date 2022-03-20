import React, { useState } from "react";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import "./login.css";
import { Navigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [isValidUser, setIsValidUser] = useState(false);
  let expiredAt = new Date(new Date().getTime() + 60000 * 20);

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = event.target.username.value;
    const pwd = event.target.password.value;

    axios
      .get("http://127.0.0.1:8000/api/v1/login", {
        params: { username: user, password: pwd },
      })
      .then((res) => {
        if (res.status === 200) {
          setIsValidUser(true);
          sessionStorage.setItem("isValidUser", "true");
          sessionStorage.setItem("expiry", expiredAt.toISOString());
        }
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
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
    const username = event.target.username1.value;
    const password = event.target.password1.value;
    const email = event.target.email1.value;

    axios
      .get("http://127.0.0.1:8000/api/v1/signup", {
        params: { username: username, password: password, email: email },
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
          console.log(error.response.data);
          console.log(error.response.status);
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
