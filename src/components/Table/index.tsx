import React, { useState } from "react";

// import { Container } from './styles';
import DrawImage from "../../assets/img/draw.png";
import CloseImage from "../../assets/img/close.png";
import API from "../../services/api";

interface TableProps {
  content: any[];
  title: {
    name: string;
    id: string;
    type?: "checkbox" | "button" | "text";
    style?: {
      content?: React.CSSProperties | undefined;
      content_class?: string;
    };
    get?: (data: any) => any;
  }[];
  is_report?: boolean;
  setUserId?: any;
  usersid?: string[];
}

const Table: React.FC<TableProps> = ({
  content,
  title,
  is_report,
  setUserId,
  usersid,
}) => {
  return (
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          {is_report && <th style={{ textAlign: "center" }}>#</th>}
          {title.map((t) => (
            <th
              key={t.id}
              style={t.style?.content}
              className={t.style?.content_class}
              scope="col"
            >
              {t.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {content.map((c, indx) => (
          <tr key={indx} style={{ cursor: "pointer" }}>
            {is_report && (
              <td className="col-1">
                <div className="d-flex align-items-center justify-content-center">
                  <input
                    onChange={() => {
                      if (usersid) {
                        if (usersid.includes(c.id)) {
                          setUserId((u: string[]) =>
                            u.filter((id) => id !== c.id)
                          );
                        } else {
                          setUserId((u: string[]) => [...u, c.id]);
                        }
                      }
                    }}
                    type="checkbox"
                    style={{ height: 25, width: 15 }}
                  />
                </div>
              </td>
            )}
            {title.map((t, indx) => {
              if (t.type === "checkbox") {
                return (
                  <td
                    onClick={() => {
                      window.location.href = `/customer?id=${c.id}`;
                    }}
                    key={indx}
                    style={t.style?.content}
                    className={t.style?.content_class}
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      <input
                        type="checkbox"
                        checked={c[t.id]}
                        style={{ height: 25, width: 15 }}
                      />
                    </div>
                  </td>
                );
              }
              if (t.type === "button") {
                return (
                  <td
                    onClick={() => {
                      window.location.href = `/customer?id=${c.id}`;
                    }}
                    key={indx}
                    style={t.style?.content}
                    className={t.style?.content_class}
                  >
                    <button>Editar</button>
                  </td>
                );
              }
              return (
                <td
                  onClick={() => {
                    window.location.href = `/customer?id=${c.id}`;
                  }}
                  style={t.style?.content}
                  className={t.style?.content_class}
                >
                  {t.get ? t.get(c) : c[t.id]}
                </td>
              );
            })}

            {!is_report && (
              <td className="col-1" style={{}}>
                <a className="btn pt-0 pb-0" href={"/home?updateid=" + c.id}>
                  <img src={DrawImage} style={{ width: 20 }} />
                </a>
                <button
                  className="btn pt-0 pb-0"
                  style={{ zIndex: 10 }}
                  onClick={async () => {
                    const api = new API();
                    await api.deleteUser(c.id);
                    const response = await api.getUsers();
                    window.location.href = "/home";
                  }}
                >
                  <img src={CloseImage} style={{ width: 20 }} />
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
