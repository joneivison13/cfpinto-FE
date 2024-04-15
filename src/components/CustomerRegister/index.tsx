import React, { ChangeEvent, useCallback, useState } from "react";
import Input from "../Form/Input";
import { Button, Form } from "react-bootstrap";
import Select from "../Form/Select";
import API from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import { AxiosError } from "axios";
import Cache from "../../services/cache";

// import { Container } from './styles';

const CustomerRegister: React.FC<{
  viewData: (value: boolean) => void;
}> = ({ viewData }) => {
  const [selected, setSelected] = useState<"peoples" | "documents" | "address">(
    "peoples"
  );
  const [addresses, setAddresses] = useState<
    { address: string; city: string; state: string }[]
  >([
    {
      address: "",
      city: "",
      state: "",
    },
  ]);

  const [name, setName] = useState("");
  const [nacionality, setNacionality] = useState("");
  const [document, setDocument] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("masculino");
  const [phone, setPhone] = useState("");
  const [telephone, setTelephone] = useState("");

  const [documentType, setDocumentType] = useState("RG");
  const [documentValue, setDocumentValue] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>();

  const [errors, setErrors] = useState({});

  const createPerson = useCallback(
    (e: any) => {
      (async () => {
        e.preventDefault();
        try {
          const api = new API();

          const response = await api.createUser({
            name,
            nacionality,
            document,
            birthDate,
            gender,
            phone,
            telephone,
          });

          await Cache.set("person", response.data.id);
          toast.success("Pessoa criada com sucesso");
          setErrors({});
          viewData(false);
        } catch (error) {
          if (error instanceof AxiosError) {
            console.log(error.response?.data);
            let erros_formated: any = {};
            error.response?.data.error.map((error: any) => {
              erros_formated[error.path] = error.message;
            });
            setErrors(erros_formated);
            return toast.error(error.response?.data.message);
          }
          if (error instanceof Error) {
            toast.error(error.message);
          }
        }
      })();
    },
    [birthDate, document, gender, nacionality, name, phone, telephone, viewData]
  );

  const createDocument = useCallback(() => {
    (async () => {
      const api = new API();
      const person = await Cache.get("person");
      if (!person) {
        return toast.error("Pessoa não encontrada");
      }

      console.log({
        type: documentType,
        value: documentValue,
        person,
        file: documentFile,
      });

      api
        .createDocument({
          type: documentType,
          value: documentValue,
          person,
          file: documentFile,
        })
        .then((response) => {
          toast.success("Documento criado com sucesso");
          setErrors({});
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            console.log(error.response?.data);
            let erros_formated: any = {};
            error.response?.data.error.map((error: any) => {
              erros_formated[error.path] = error.message;
            });
            setErrors(erros_formated);
            return toast.error(error.response?.data.message);
          }
          if (error instanceof Error) {
            toast.error(error.message);
          }
        });
    })();
  }, [documentFile, documentType, documentValue]);

  const createAddress = useCallback(() => {
    (async () => {
      const api = new API();
      const person = await Cache.get("person");
      if (!person) {
        return toast.error("Pessoa não encontrada");
      }

      addresses.map(async (address) => {
        await api.createAddress({
          street: address.address,
          city: address.city,
          state: address.state,
          person: person,
        });
      });

      toast.success("Endereço criado com sucesso");
    })();
  }, [addresses]);

  return (
    <div className="p-4 pt-0">
      <ToastContainer />
      <ul className="nav nav-tabs">
        <li
          className="nav-item"
          style={{ cursor: "pointer" }}
          onClick={() => setSelected("peoples")}
        >
          <p
            className={`nav-link ${selected === "peoples" ? "active" : ""}`}
            aria-current="page"
          >
            Pessoas
          </p>
        </li>
        <li
          className="nav-item"
          style={{ cursor: "pointer" }}
          onClick={() => setSelected("documents")}
        >
          <p className={`nav-link ${selected === "documents" ? "active" : ""}`}>
            Documents
          </p>
        </li>
        <li
          className="nav-item"
          style={{ cursor: "pointer" }}
          onClick={() => setSelected("address")}
        >
          <p className={`nav-link ${selected === "address" ? "active" : ""}`}>
            Endereços
          </p>
        </li>
      </ul>
      {selected === "peoples" && (
        <Form className="mt-4">
          <Input
            image={undefined}
            placeholder="Nome completo"
            label="Nome completo"
            style={{
              container: "mb-3 col-12",
              input: "",
            }}
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            name="name"
            errors={errors}
          />
          <Input
            image={undefined}
            placeholder="Nacionalidade"
            label="Nacionalidade"
            style={{
              container: "mb-3 col-12",
              input: "",
            }}
            type="text"
            onChange={(e) => setNacionality(e.target.value)}
            value={nacionality}
            name="nacionality"
            errors={errors}
          />
          <Input
            image={undefined}
            placeholder="CPF"
            label="CPF"
            style={{
              container: "mb-3 col-12",
              input: "",
            }}
            type="text"
            mask="cpf"
            onChange={(e) => setDocument(e.target.value)}
            value={document}
            name="document"
            errors={errors}
          />
          <Input
            image={undefined}
            placeholder="Data de Nascimento"
            label="Data de Nascimento"
            style={{
              container: "mb-3 col-12",
              input: "",
            }}
            type="date"
            onChange={(e) => setBirthDate(e.target.value)}
            value={birthDate}
            name="birthDate"
            errors={errors}
          />
          <Select
            data={[
              {
                id: "masculino",
                label: "Masculino",
              },
              {
                id: "feminino",
                label: "Feminino",
              },
            ]}
            label="Gênero"
            onChange={(e) => setGender(e.target.value)}
            value={gender}
            name="gender"
            errors={errors}
          />
          <Input
            image={undefined}
            placeholder="Celular"
            label="Celular"
            style={{
              container: "mb-3 col-12",
              input: "",
            }}
            type="text"
            mask="phone"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            name="phone"
            errors={errors}
          />
          <Input
            image={undefined}
            placeholder="Telefone"
            label="Telefone"
            style={{
              container: "mb-3 col-12",
              input: "",
            }}
            type="text"
            mask="phone"
            onChange={(e) => setTelephone(e.target.value)}
            value={telephone}
            name="telephone"
            errors={errors}
          />

          <button
            type="submit"
            className="btn btn-primary"
            onClick={createPerson}
          >
            Salvar
          </button>
        </Form>
      )}
      {selected === "documents" && (
        <Form className="mt-4">
          <Select
            data={[
              {
                id: "rg",
                label: "RG",
              },
              {
                id: "cnh",
                label: "CNH",
              },
            ]}
            label="Gênero"
            onChange={(e) => setDocumentType(e.target.value)}
            value={documentType}
          />
          <Input
            image={undefined}
            placeholder="Valor do documento"
            label="Valor do documento"
            style={{
              container: "mb-3 col-12",
              input: "",
            }}
            type="text"
            onChange={(e) => setDocumentValue(e.target.value)}
            value={documentValue}
          />
          <Input
            image={undefined}
            placeholder="Cópia do documento"
            label="Cópia do documento"
            style={{
              container: "mb-3 col-12",
              input: "",
            }}
            type="file"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setDocumentFile(
                event.target.files && event.target.files[0]
                  ? event.target.files[0]
                  : null
              )
            }
          />
          <div>
            {/* <Button  className="me-3" variant="success">
              Adicionar documento
            </Button> */}
            <Button variant="primary" onClick={createDocument}>
              Salvar
            </Button>
          </div>
        </Form>
      )}
      {selected === "address" && (
        <div className="mt-4">
          {addresses.map((address, index) => (
            <div className="card mt-4">
              <div className="card-header bg-success text-white d-flex align-items-start justify-content-between">
                <p className="fs-5">Endereço {index + 1}</p>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setAddresses(addresses.filter((_, i) => i !== index));
                  }}
                >
                  Remover
                </button>
              </div>
              <div className="card-body">
                <Input
                  image={undefined}
                  placeholder="Endereço"
                  label="Endereço"
                  style={{
                    container: "mb-3 col-12",
                    input: "",
                  }}
                  type="text"
                  errors={errors}
                  name="street"
                  onChange={(e) => {
                    const newAddresses = [...addresses];
                    newAddresses[index].address = e.target.value;
                    setAddresses(newAddresses);
                  }}
                />
                <Input
                  image={undefined}
                  placeholder="Cidade"
                  label="Cidade"
                  style={{
                    container: "mb-3 col-12",
                    input: "",
                  }}
                  type="text"
                  errors={errors}
                  name="city"
                  onChange={(e) => {
                    const newAddresses = [...addresses];
                    newAddresses[index].city = e.target.value;
                    setAddresses(newAddresses);
                  }}
                />
                <Input
                  image={undefined}
                  placeholder="Estado"
                  label="Estado"
                  style={{
                    container: "mb-3 col-12",
                    input: "",
                  }}
                  type="text"
                  errors={errors}
                  name="state"
                  onChange={(e) => {
                    const newAddresses = [...addresses];
                    newAddresses[index].state = e.target.value;
                    setAddresses(newAddresses);
                  }}
                />
              </div>
            </div>
          ))}
          <div className="mt-4">
            <Button
              className="me-3"
              variant="success"
              onClick={() => {
                setAddresses([
                  ...addresses,
                  { address: "", city: "", state: "" },
                ]);
              }}
            >
              Adicionar documento
            </Button>
            <Button variant="primary" onClick={createAddress}>
              Salvar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerRegister;
