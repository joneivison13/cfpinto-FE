import React, { useEffect, useState } from "react";

import MenuImage from "../assets/img/menu.png";
import Table from "../components/Table";
import CustomerRegister from "../components/CustomerRegister";
import API, { IGetUserResponse } from "../services/api";

import EyeImage from "../assets/img/olho.png";
import useAuth from "../hooks/auth";
import Cache from "../services/cache";
import { Dropdown, Form } from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";

// const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
//   <a
//     href=""
//     ref={ref}
//     onClick={(e) => {
//       e.preventDefault();
//       onClick(e);
//     }}
//   >
//     {children}
//     &#x25bc;
//   </a>
// ));

// // forwardRef again here!
// // Dropdown needs access to the DOM of the Menu to measure it
// const CustomMenu = React.forwardRef(
//   ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
//     const [value, setValue] = useState("");

//     return (
//       <div
//         ref={ref}
//         style={style}
//         className={className}
//         aria-labelledby={labeledBy}
//       >
//         <Form.Control
//           autoFocus
//           className="mx-3 my-2 w-auto"
//           placeholder="Type to filter..."
//           onChange={(e) => setValue(e.target.value)}
//           value={value}
//         />
//         <ul className="list-unstyled">
//           {React.Children.toArray(children).filter(
//             (child) =>
//               !value || child.props.children.toLowerCase().startsWith(value)
//           )}
//         </ul>
//       </div>
//     );
//   }
// );

const Reports: React.FC = () => {
  const api = new API();
  const [formIsVisible, setFormIsVisible] = useState(false);
  const [people, setPeople] = useState<IGetUserResponse[]>([]);
  const [usersid, setusersid] = useState<string[]>([]);

  const params = useParams() as { type: "procuracao" | string };

  useEffect(() => {
    (async () => {
      const token = await Cache.get("assignature");
      console.log({ token });
      if (!token) {
        window.location.href = "/";
      } else {
        const response = await api.getUsers();
        setPeople(response.data);
      }
    })();
  }, []);

  useEffect(() => {
    const urldata = new URLSearchParams(window.location.search);
    const updateid = urldata.get("updateid");
    if (updateid) {
      setFormIsVisible(true);
    }
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
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                Home
              </a>
            </li>
            {/* <li className="nav-item me-3 ms-4 pb-1">
              <p className="text-dark text-decoration-none fw-medium">Home</p>
            </li> */}
            <Dropdown>
              <Dropdown.Toggle
                className="bg-transparent border-0 text-dark text-decoration-none fw-medium p-0"
                // as={CustomToggle}
                id="dropdown-custom-components"
              >
                Relatórios
              </Dropdown.Toggle>

              <Dropdown.Menu
              // as={CustomMenu}
              >
                <Dropdown.Item
                  eventKey="1"
                  onClick={() => {
                    window.location.href = "/report/procuracao";
                  }}
                >
                  Procuração
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ul>
        </nav>
      </header>
      <main
        style={{ backgroundColor: "#E9ECEF", height: "97vh", padding: "20px" }}
      >
        <h1 className="fs-3 fw-medium mb-4">
          {params.type === "procuracao" ? "Procuração" : params.type}
        </h1>
        <div className="shadow-sm bg-white" style={{ width: "100%" }}>
          <div className="d-flex align-items-baseline justify-content-between pe-4 ps-4 pt-2 pb-2">
            <p
              className="fs-5 fw-medium"
              style={{ display: "flex", alignItems: "center" }}
            >
              Clientes
            </p>
            <button
              className="btn btn-primary"
              onClick={async () => {
                await api.createFile({
                  type: params.type,
                  usersid,
                });
              }}
            >
              Gerar relatório
            </button>
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
              setUserId={setusersid}
              usersid={usersid}
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
              is_report
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Reports;
