import React from "react";
import { Container, Form, Button } from "react-bootstrap";

import EmailImage from "../assets/img/email.png";
import LockImage from "../assets/img/lock.png";
import UserImage from "../assets/img/user.png";
import Input from "../components/Form/Input";

export default function Register() {
  return (
    <main
      style={{ backgroundColor: "#E9ECEF", width: "100vw", height: "100vh" }}
    >
      <Container
        className="d-flex align-items-center justify-content-between"
        style={{ height: "100vh" }}
      >
        <div className="d-flex flex-column col-12">
          <header className="mb-1">
            <p
              className="fs-2 d-flex align-items-baseline justify-content-center mb-0"
              style={{ color: "#3E474F" }}
            >
              <h1 className="fs-2">Contract</h1>Hub
            </p>
          </header>
          <Form className="bg-white px-3 py-2 col-4 col-lg-4 col-md-6 align-self-center shadow-sm">
            <p
              className="text-center mt-2"
              style={{ color: "#777777", fontWeight: "600" }}
            >
              Cadastro de novo usuário
            </p>
            {/* <div className="mb-3 col-12">
              <div className="input-group">
                <input
                  type="email"
                  className="form-control border-end-0"
                  placeholder="Email"
                />
                <div className="input-group-prepend">
                  <span
                    style={{ height: 38 }}
                    className="input-group-text border-start-0 bg-white rounded-start-0"
                    id="inputGroupPrepend3"
                  >
                    <img src={EmailImage} alt="Email" style={{ width: 16 }} />
                  </span>
                </div>
              </div>
            </div> */}
            <Input
              image={UserImage}
              placeholder="Nome completo"
              style={{
                container: "mb-3 col-12",
                input: "",
              }}
              type="text"
            />
            <Input
              image={EmailImage}
              placeholder="Email"
              style={{
                container: "mb-3 col-12",
                input: "",
              }}
              type="email"
            />
            <Input
              image={LockImage}
              placeholder="Password"
              style={{
                container: "mb-3 col-12",
                input: "",
              }}
              type="password"
            />
            <Input
              image={LockImage}
              placeholder="Repita o password"
              style={{
                container: "mb-3 col-12",
                input: "",
              }}
              type="password"
            />

            {/* <div className="mb-3 col-12 mt-4">
              <div className="input-group">
                <input
                  type="password"
                  className="form-control border-end-0"
                  placeholder="Password"
                />
                <div className="input-group-prepend">
                  <span
                    style={{ height: 38 }}
                    className="input-group-text border-start-0 bg-white rounded-start-0"
                    id="inputGroupPrepend3"
                  >
                    <img src={LockImage} alt="Email" style={{ width: 16 }} />
                  </span>
                </div>
              </div>
            </div> */}

            <div className="d-flex justify-content-between align-items-center">
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  label={
                    <p style={{ fontWeight: "700", marginBottom: 0 }}>
                      I agree to the{" "}
                      <a style={{ color: "#417AFF" }} href="#terms">
                        terms
                      </a>
                    </p>
                  }
                  style={{ fontWeight: "600", color: "#656565" }}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="col-4">
                Sign In
              </Button>
            </div>

            <div className="mt-1 mb-1">
              <a className="text-decoration-none" href="/">
                Eu já sou cadastrado
              </a>
            </div>
          </Form>
        </div>
      </Container>
    </main>
  );
}
