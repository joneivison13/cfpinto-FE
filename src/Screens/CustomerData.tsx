import React, { useEffect, useState } from "react";

import MenuImage from "../assets/img/menu.png";
import API, { IGetUserByIdResponse } from "../services/api";
import DrawImage from "../assets/img/draw.png";
import CloseImage from "../assets/img/close.png";

const CustomerData: React.FC = () => {
  const [data, setData] = useState<IGetUserByIdResponse>();
  const [uid, setUid] = useState<null | string>(null);
  const api = new API();

  useEffect(() => {
    (async () => {
      const search_data = new URLSearchParams(window.location.search);
      const id = search_data.get("id");

      if (!id) {
        window.location.href = "/home";
      } else {
        const userdata = await api.getUserById(id);
        setData(userdata.data);
        setUid(id);
      }
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
          </ul>
        </nav>
      </header>
      <main
        style={{ backgroundColor: "#E9ECEF", height: "97vh", padding: "20px" }}
      >
        <h1 className="fs-3 fw-medium mb-4">DataTables</h1>
        <div className="shadow-sm bg-white" style={{ width: "100%" }}>
          <div className="d-flex align-items-baseline justify-content-between pe-4 ps-4 pt-2 pb-2">
            <p className="fs-5 fw-medium">Detalhes do cliente</p>
          </div>
          <div className="ps-4 pe-4 border border-top-black">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <p className="fs-4 fw-medium mb-0">Informações do cliente:</p>
              <a className="btn pt-0 pb-0" href={"/home?updateid=" + uid}>
                <img src={DrawImage} style={{ width: 20 }} />
              </a>
            </div>
            <ul className="ms-3">
              <li>
                <p className="mb-0">
                  <span className="fw-bold">Nome Completo:</span> {data?.name}
                </p>
              </li>
              <li>
                <p className="mb-0">
                  <span className="fw-bold">Nacionalidade:</span>{" "}
                  {data?.nacionality}
                </p>
              </li>
              <li>
                <p className="mb-0">
                  <span className="fw-bold">CPF:</span> {data?.document}
                </p>
              </li>
              <li>
                <p className="mb-0">
                  <span className="fw-bold">Data de nascimento:</span>{" "}
                  {new Date(data?.birthDate ?? "").toLocaleDateString("pt-BR")}
                </p>
              </li>
              <li>
                <p className="mb-0">
                  <span className="fw-bold">Gênero:</span> {data?.gender}
                </p>
              </li>
              <li>
                <p className="mb-0">
                  <span className="fw-bold">Celular:</span> {data?.phone}
                </p>
              </li>
              <li>
                <p className="mb-0">
                  <span className="fw-bold">Telefone:</span> {data?.telephone}
                </p>
              </li>
            </ul>
            <p className="fs-4 fw-medium mb-2">Endereços:</p>
            <div
              className="d-flex align-items-center gap-5"
              style={{
                maxWidth: "calc(100vw - 48px)",
                overflowX: "auto",
              }}
            >
              {data?.Address.map((address, indx) => (
                <div key={indx} style={{ minWidth: 200 }}>
                  <p className="mb-1">Endereço {indx + 1}</p>
                  <p className="">
                    <span className="fw-bold">Endereço:</span> {address.street}
                  </p>
                  <p className="">
                    <span className="fw-bold">Cidade:</span> {address.city}
                  </p>
                  <p className="">
                    <span className="fw-bold">Estado:</span> {address.state}
                  </p>
                </div>
              ))}
            </div>
            <p className="fs-4 fw-medium mb-2">Documentos:</p>
            <div
              className="d-flex"
              style={{
                justifyContent: "flex-start",
                gap: 20,
                maxWidth: "calc(100vw - 48px)",
                overflowX: "auto",
              }}
            >
              {data?.Document &&
                data?.Document.map((document, indx) => (
                  <div key={indx} className={indx.toString()}>
                    {document.file && (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span className="fw-bold">{document.type}</span>
                        <img
                          src={api.getImageUrl(document.file)}
                          alt=""
                          style={{ width: 350 }}
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>
            <br />
            <br />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerData;
