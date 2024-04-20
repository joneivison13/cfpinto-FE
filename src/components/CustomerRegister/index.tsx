import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Input from "../Form/Input";
import { Button, Form } from "react-bootstrap";
import Select from "../Form/Select";
import API from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import { AxiosError } from "axios";
import Cache from "../../services/cache";
import { Context } from "../../context";

// import { Container } from './styles';

const CustomerRegister: React.FC<{
  viewData: (value: boolean) => void;
}> = ({ viewData }) => {
  const api = new API();
  const context = useContext(Context);
  const [selected, setSelected] = useState<"peoples" | "documents" | "address">(
    "peoples"
  );
  const [addresses, setAddresses] = useState<
    { address: string; city: string; state: string; isnew?: boolean }[]
  >([
    {
      address: "",
      city: "",
      state: "",
      isnew: true,
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

  const [documents, setDocuments] = useState<
    {
      documentType: string;
      documentValue: string;
      documentFile: File | null;
      isnew?: boolean;
    }[]
  >([
    {
      documentType: "RG",
      documentValue: "",
      documentFile: null,
      isnew: true,
    },
  ]);

  const [errors, setErrors] = useState({});

  const [isupdate, setIsUpdate] = useState(false);
  const [updateuid, setUpdateuid] = useState("");

  const getUser = useCallback(
    (id: string) => {
      (async () => {
        const api = new API();
        const response = await api.getUserById(id);
        context.setUpdateUserData(response.data);
      })();
    },
    [context]
  );

  useEffect(() => {
    (async () => {
      const urldata = new URLSearchParams(window.location.search);
      const updateid = urldata.get("updateid");
      if (updateid) {
        setIsUpdate(true);
        setUpdateuid(updateid);
        await getUser(updateid);
      }
    })();
  }, []);

  useEffect(() => {
    if (context.updateUserData) {
      setName(context.updateUserData.name);
      setNacionality(context.updateUserData.nacionality);
      setDocument(context.updateUserData.document);
      setBirthDate(context.updateUserData.birthDate);
      setGender(context.updateUserData.gender);
      setPhone(context.updateUserData.phone);
      setTelephone(context.updateUserData.telephone);

      const user_documents = context.updateUserData.Document.map(
        (doc: any) => ({
          documentType: doc.type,
          documentValue: doc.value,
          documentFile: null,
        })
      );
      console.log({ user_documents, a: context.updateUserData });
      setDocuments(
        user_documents.length > 0
          ? user_documents.map((i: any) => ({ ...i, isnew: false }))
          : [
              {
                documentType: "RG",
                documentValue: "",
                documentFile: null,
                isnew: true,
              },
            ]
      );

      const user_addresses = context.updateUserData.Address.map(
        (address: any) => ({
          address: address.street,
          city: address.city,
          state: address.state,
        })
      );

      console.log({ user_addresses, a: context.updateUserData });

      setAddresses(
        user_addresses.length > 0
          ? user_addresses.map((i: any) => ({ ...i, isnew: false }))
          : [{ address: "", city: "", state: "" }]
      );
    }
  }, [context.updateUserData]);

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

          toast.success("Pessoa criada com sucesso");
          setErrors({});
          viewData(false);
          window.location.href = "/home?updateid=" + response.data.id;
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
      const person = isupdate ? updateuid : await Cache.get("person");
      if (!person) {
        return toast.error("Pessoa não encontrada");
      }

      console.log({ documents });

      // documents
      //   .filter((doc) => doc.isnew)
      //   .map(async (document) => {
      //     api
      //       .createDocument({
      //         type: document.documentType,
      //         value: document.documentValue,
      //         person,
      //         file: document.documentFile,
      //       })
      //       .then((response) => {
      //         toast.success("Documento criado com sucesso");
      //         setErrors({});
      //       })
      //       .catch((error) => {
      //         if (error instanceof AxiosError) {
      //           console.log(error.response?.data);
      //           let erros_formated: any = {};
      //           error.response?.data.error.map((error: any) => {
      //             erros_formated[error.path] = error.message;
      //           });
      //           setErrors(erros_formated);
      //           return toast.error(error.response?.data.message);
      //         }
      //         if (error instanceof Error) {
      //           toast.error(error.message);
      //         }
      //       });
      //   });
    })();
  }, [documentFile, documentType, documentValue]);

  const createAddress = useCallback(() => {
    (async () => {
      const api = new API();
      const person = await Cache.get("person");
      if (!person) {
        return toast.error("Pessoa não encontrada");
      }

      addresses
        .filter((address) => address.isnew)
        .map(async (address) => {
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
          {documents.map((document, index) => (
            <div className="card mt-4">
              <div className="card-header bg-success text-white d-flex align-items-start justify-content-between">
                <p className="fs-5">Documento {index + 1}</p>
                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    setDocuments(documents.filter((_, i) => i !== index));
                    try {
                      await api.deleteDocument(
                        context.updateUserData.Document[index].id
                      );
                      toast.success("Documento deletado com sucesso");
                    } catch (error) {
                      toast.error("Erro ao deletar documento");
                    }
                  }}
                >
                  Remover
                </button>
              </div>
              <div className="card-body">
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
                  onChange={(e) => {
                    const newDocuments = [...documents];
                    newDocuments[index].documentType = e.target.value;
                    setDocuments(newDocuments);
                  }}
                  value={document.documentType}
                  disabled={document.isnew}
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
                  onChange={(e) => {
                    const newDocuments = [...documents];
                    newDocuments[index].documentValue = e.target.value;
                    console.log(newDocuments[index].documentValue);
                    setDocuments(newDocuments);
                  }}
                  value={document.documentValue}
                  disabled={document.isnew}
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
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const newDocuments = [...documents];
                    console.log(event.target.files);
                    if (event.target.files && event.target.files[0]) {
                      newDocuments[index].documentFile = event.target.files[0];
                      setDocuments(newDocuments);
                    }
                  }}
                  accept="image/*"
                  disabled={document.isnew}
                />
              </div>
            </div>
          ))}
          <br />
          <br />

          <div>
            <Button
              className="me-3"
              variant="success"
              onClick={() => {
                setDocuments([
                  ...documents,
                  {
                    documentType: "RG",
                    documentValue: "",
                    documentFile: null,
                    isnew: true,
                  },
                ]);
              }}
            >
              Adicionar documento
            </Button>
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
                  onClick={async () => {
                    setAddresses(addresses.filter((_, i) => i !== index));
                    try {
                      await api.deleteAddress(
                        context.updateUserData.Address[index].id
                      );
                      toast.success("Endereço deletado com sucesso");
                    } catch (error) {
                      toast.error("Erro ao deletar endereço");
                    }
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
                  value={address.address}
                  disabled={address.isnew}
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
                  value={address.city}
                  disabled={address.isnew}
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
                  value={address.state}
                  disabled={address.isnew}
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
