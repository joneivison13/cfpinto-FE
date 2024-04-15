import React, { useEffect, useState } from "react";

import MenuImage from "../assets/img/menu.png";
import Table from "../components/Table";
import CustomerRegister from "../components/CustomerRegister";
import API, { IGetUserResponse } from "../services/api";

const Customers: React.FC = () => {
  const [formIsVisible, setFormIsVisible] = useState(false);
  const [people, setPeople] = useState<IGetUserResponse[]>([]);

  useEffect(() => {
    (async () => {
      const api = new API();
      const response = await api.getUsers();
      setPeople(response.data);
    })();
  }, []);
  return (
    <div style={{ minHeight: "100vh" }}>
      <header className="p-2 bg-white d-flex align-items-center">
        <img src={MenuImage} alt="" style={{ width: 20 }} />
        <nav>
          <ul className="navbar-nav d-flex flex-row">
            <li className="nav-item me-3 ms-4 pb-1">
              <a
                href="/home"
                className="text-dark text-decoration-none fw-medium"
              >
                Home
              </a>
            </li>
            <li className="nav-item pb-1 text-dark fw-medium">Contact</li>
          </ul>
        </nav>
      </header>
      <main
        style={{ backgroundColor: "#E9ECEF", height: "97vh", padding: "20px" }}
      >
        <h1 className="fs-3 fw-medium mb-4">Clientes</h1>
        <div className="shadow-sm bg-white" style={{ width: "100%" }}>
          <div className="d-flex align-items-baseline justify-content-between pe-4 ps-4 pt-2 pb-2">
            <p className="fs-5 fw-medium">
              {!formIsVisible ? "Clientes" : "Cadastro de clientes"}
            </p>
            {!formIsVisible && (
              <button
                className="btn btn-primary"
                onClick={() => setFormIsVisible((v) => !v)}
              >
                Novo cliente
              </button>
            )}
          </div>
          {formIsVisible ? (
            <CustomerRegister
              viewData={async (data) => {
                const api = new API();
                const response = await api.getUsers();
                setPeople(response.data);
                setFormIsVisible(data);
              }}
            />
          ) : (
            <Table
              content={people}
              title={[
                {
                  name: "Nome",
                  id: "name",
                },
                {
                  name: "Idade",
                  id: "years",
                  style: {
                    content_class: "col-1",
                  },
                  get: (data) => {
                    console.log(data);
                    return (
                      new Date().getFullYear() -
                      new Date(data.birthDate).getFullYear()
                    );
                  },
                },
                {
                  name: "Endereço",
                  id: "Address.street",
                  get: (data) => {
                    return data.Address[0]?.street || "";
                  },
                },
                {
                  name: "País",
                  id: "nacionality",
                },
                {
                  id: "is_client",
                  name: "é cliente",
                  type: "checkbox",
                  style: {
                    content_class: "col-1",
                  },
                },
              ]}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Customers;
