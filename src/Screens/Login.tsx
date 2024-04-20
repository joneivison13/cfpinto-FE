import React, { useCallback, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

import EmailImage from "../assets/img/email.png";
import LockImage from "../assets/img/lock.png";
import Input from "../components/Form/Input";
import API from "../services/api";
import Cache from "../services/cache";
import { ToastContainer, toast } from "react-toastify";

export default function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const api = new API();

  const login = useCallback(() => {
    (async () => {
      try {
        const response = await api.login({ email, password });

        if (response.status === 200) {
          const { data } = response;

          Cache.set("assignature", JSON.stringify({ email, password }));

          window.location.href = "/home";
        } else {
          toast.error("Usuário ou senha inválidos");
        }
      } catch (error) {
        toast.error("Usuário ou senha inválidos");
        console.error(error);
      }
    })();
  }, [email, password]);

  return (
    <main
      style={{ backgroundColor: "#E9ECEF", width: "100vw", height: "100vh" }}
    >
      <ToastContainer />
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
              Faça login para iniciar sua sessão
            </p>
            <Input
              image={EmailImage}
              placeholder="Usuário"
              style={{
                container: "mb-3 col-12",
                input: "",
              }}
              type="text"
              onChange={(e) => setemail(e.target.value)}
              value={email}
            />
            <Input
              image={LockImage}
              placeholder="Password"
              style={{
                container: "mb-3 col-12",
                input: "",
              }}
              type="password"
              onChange={(e) => setpassword(e.target.value)}
              value={password}
            />

            <div className="d-flex justify-content-between align-items-center">
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  label="Lembre de mim"
                  style={{ fontWeight: "600", color: "#656565" }}
                />
              </Form.Group>

              <button
                type="button"
                className="col-4 btn btn-primary"
                onClick={login}
              >
                Sign In
              </button>
            </div>

            <div className="mt-3">
              <a className="text-decoration-none" href="/register">
                Registre uma nova associação
              </a>
            </div>
          </Form>
        </div>
      </Container>
    </main>
  );
}
