import React from "react";

// import { Container } from './styles';

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
}

const Table: React.FC<TableProps> = ({ content, title }) => {
  return (
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
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
          <tr
            key={indx}
            onClick={() => {
              window.location.href = `/customer?id=${c.id}`;
            }}
            style={{ cursor: "pointer" }}
          >
            {title.map((t, indx) => {
              if (t.type === "checkbox") {
                return (
                  <td
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
                    key={indx}
                    style={t.style?.content}
                    className={t.style?.content_class}
                  >
                    <button>Editar</button>
                  </td>
                );
              }
              return (
                <td style={t.style?.content} className={t.style?.content_class}>
                  {t.get ? t.get(c) : c[t.id]}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
