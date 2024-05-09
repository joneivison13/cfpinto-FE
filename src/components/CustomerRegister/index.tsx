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
import API, { IDocumentTypes } from "../../services/api";
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
    {
      address: string;
      city: string;
      state: string;
      isnew?: boolean;
      country: string;
      main: string;
      neighborhood: string;
      number: string;
      postal_code: string;
    }[]
  >([
    {
      address: "",
      city: "",
      state: "",
      isnew: true,
      country: "",
      main: "",
      neighborhood: "",
      number: "",
      postal_code: "",
    },
  ]);

  const [name, setName] = useState("");
  const [nacionality, setNacionality] = useState("");
  const [document, setDocument] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("M");
  const [phone, setPhone] = useState("");
  const [telephone, setTelephone] = useState("");
  const [civil_state, setCivil_state] = useState("Solteiro(a)");
  const [email, setEmail] = useState("");
  const [father, setFather] = useState("");
  const [mother, setMother] = useState("");
  const [profession, setProfession] = useState("");
  const [isclient, setIsclient] = useState(false);
  const [natural_city, setNatural_city] = useState("");
  const [natural_state, setNatural_state] = useState("");
  const [natural_country, setNatural_country] = useState("");

  const [documents, setDocuments] = useState<
    {
      documentType: string;
      documentValue: string;
      documentFile: File | null;
      isnew?: boolean;
      expedit: Date | string;
      expDate: Date | string;
      expCorp: string;
    }[]
  >([
    {
      documentType: "RG",
      documentValue: "",
      documentFile: null,
      isnew: true,
      expCorp: "",
      expDate: "",
      expedit: "",
    },
  ]);

  const [documentTypes, setDocumentTypes] = useState<IDocumentTypes[]>();

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
    (async () => {
      const { data: response } = await api.getDocumentTypes();

      console.log({ response });

      setDocumentTypes(response.data);
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
      setCivil_state(context.updateUserData.civil_state);
      setEmail(context.updateUserData.email);
      setFather(context.updateUserData.father_name);
      setMother(context.updateUserData.mother_name);
      setProfession(context.updateUserData.profession);
      setNatural_city(context.updateUserData.natural_city);
      setNatural_state(context.updateUserData.natural_state);
      setNatural_country(context.updateUserData.natural_country);

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
                expCorp: "",
                expDate: "",
                expedit: "",
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
          : [
              {
                address: "",
                city: "",
                state: "",
                isnew: true,
                country: "",
                main: "",
                neighborhood: "",
                number: "",
                postal_code: "",
              },
            ]
      );
    }
  }, [context.updateUserData]);

  const createPerson = useCallback(
    (e: any) => {
      (async () => {
        e.preventDefault();
        const api = new API();
        if (isupdate) {
          try {
            const response = await api.updateUser(updateuid, {
              name,
              nacionality,
              document,
              birthDate,
              gender,
              phone,
              telephone,
              civil_state,
              email,
              father_name: father,
              mother_name: mother,
              profession,
              natural_city,
              natural_country,
              is_client: isclient,
              natural_state,
            });
            toast.success("Pessoa criada com sucesso");
            setErrors({});
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
        } else {
          try {
            const response = await api.createUser({
              name,
              nacionality,
              document,
              birthDate,
              gender,
              phone,
              telephone,
              civil_state,
              email,
              father_name: father,
              mother_name: mother,
              profession,
              natural_city,
              natural_country,
              is_client: isclient,
              natural_state,
            });

            toast.success("Pessoa criada com sucesso");
            setErrors({});
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
        }
      })();
    },
    [
      isupdate,
      updateuid,
      name,
      nacionality,
      document,
      birthDate,
      gender,
      phone,
      telephone,
      civil_state,
      email,
      father,
      mother,
      profession,
      natural_city,
      natural_country,
      isclient,
      natural_state,
    ]
  );

  const createDocument = useCallback(() => {
    (async () => {
      const api = new API();
      const person = isupdate ? updateuid : await Cache.get("person");
      console.log({ documents, person, updateuid });
      if (!person) {
        return toast.error("Pessoa não encontrada");
      }

      for (const document of documents) {
        if (document.isnew) {
          await api.createDocument({
            type: document.documentType,
            value: document.documentValue,
            person,
            file: document.documentFile,
          });
        }
      }

      toast.success("Documento criado com sucesso");
      setErrors({});
      setDocuments((documents) =>
        documents.map((document) => ({ ...document, isnew: false }))
      );
    })();
  }, [documents, isupdate, updateuid]);

  const createAddress = useCallback(() => {
    (async () => {
      const api = new API();
      const person = isupdate ? updateuid : await Cache.get("person");

      console.log({ addresses, person, aaa: addresses[0].isnew });
      if (!person) {
        return toast.error("Pessoa não encontrada");
      }

      for (const address of addresses) {
        if (address.isnew) {
          await api.createAddress({
            street: address.address,
            city: address.city,
            state: address.state,
            person: person,
          });
        }
      }

      toast.success("Endereço criado com sucesso");
      setAddresses((addresses) =>
        addresses.map((address) => ({ ...address, isnew: false }))
      );
    })();
  }, [addresses, isupdate, updateuid]);

  const hasUpdateTab = () => {
    const formdata = [
      isupdate,
      updateuid,
      name,
      nacionality,
      document,
      birthDate,
      gender,
      phone,
      telephone,
      civil_state,
      email,
      father,
      mother,
      profession,
      natural_city,
      natural_country,
      isclient,
      natural_state,
    ];

    console.log({
      formdata,
      d: {
        isupdate,
        updateuid,
        name,
        nacionality,
        document,
        birthDate,
        gender,
        phone,
        telephone,
        civil_state,
        email,
        father,
        mother,
        profession,
        natural_city,
        natural_country,
        isclient,
        natural_state,
      },
      a: formdata.some((data) => data !== "" || !data) && isupdate === false,
      a1: formdata.some((data) => data !== "" || !data),
      a2: isupdate === false,
    });

    if (formdata.some((data) => data !== "" || !data) && isupdate === false) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="p-4 pt-0">
      <ToastContainer />
      <ul className="nav nav-tabs">
        <li
          className="nav-item"
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (!hasUpdateTab()) {
              setSelected("peoples");
            } else {
              toast.info("Você tem dados não salvos");
            }
          }}
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
          onClick={() => {
            if (!hasUpdateTab()) {
              setSelected("documents");
            } else {
              toast.info("Você tem dados não salvos");
            }
          }}
        >
          <p className={`nav-link ${selected === "documents" ? "active" : ""}`}>
            Documents
          </p>
        </li>
        <li
          className="nav-item"
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (!hasUpdateTab()) {
              setSelected("address");
            } else {
              toast.info("Você tem dados não salvos");
            }
          }}
        >
          <p className={`nav-link ${selected === "address" ? "active" : ""}`}>
            Endereços
          </p>
        </li>
      </ul>
      {selected === "peoples" && (
        <>
          <Form
            className="mt-4"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: 40,
            }}
          >
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
                  id: "M",
                  label: "Masculino",
                },
                {
                  id: "F",
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
            <Input
              image={undefined}
              placeholder="Email"
              label="Email"
              style={{
                container: "mb-3 col-12",
                input: "",
              }}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name="email"
              errors={errors}
            />
            <Select
              data={[
                {
                  id: "Solteiro(a)",
                  label: "Solteiro(a)",
                },
                {
                  id: "Casado(a)",
                  label: "Casado(a)",
                },
                {
                  id: "União Estável",
                  label: "União Estável",
                },
                {
                  id: "Divorciado(a)",
                  label: "Divorciado(a)",
                },
                {
                  id: "Viúvo(a)",
                  label: "Viúvo(a)",
                },
              ]}
              label="Estado Civil"
              onChange={(e) => setCivil_state(e.target.value)}
              value={civil_state}
              name="civil_state"
              errors={errors}
            />
            <Input
              image={undefined}
              placeholder="Nome do pai"
              label="Nome do pai"
              style={{
                container: "mb-3 col-12",
                input: "",
              }}
              type="father"
              onChange={(e) => setFather(e.target.value)}
              value={father}
              name="father"
              errors={errors}
            />
            <Input
              image={undefined}
              placeholder="Nome da mãe"
              label="Nome da mãe"
              style={{
                container: "mb-3 col-12",
                input: "",
              }}
              type="mother"
              onChange={(e) => setMother(e.target.value)}
              value={mother}
              name="mother"
              errors={errors}
            />
            <Input
              image={undefined}
              placeholder="Profissão"
              label="Profissão"
              style={{
                container: "mb-3 col-12",
                input: "",
              }}
              type="profession"
              onChange={(e) => setProfession(e.target.value)}
              value={profession}
              name="profession"
              errors={errors}
            />
            <Input
              image={undefined}
              placeholder="Cidade de nascimento"
              label="Cidade de nascimento"
              style={{
                container: "mb-3 col-12",
                input: "",
              }}
              type="natural_city"
              onChange={(e) => setNatural_city(e.target.value)}
              value={natural_city}
              name="natural_city"
              errors={errors}
            />
            <Input
              image={undefined}
              placeholder="Estado de nascimento"
              label="Estado de nascimento"
              style={{
                container: "mb-3 col-12",
                input: "",
              }}
              type="natural_state"
              onChange={(e) => setNatural_state(e.target.value)}
              value={natural_state}
              name="natural_state"
              errors={errors}
            />
            <Input
              image={undefined}
              placeholder="País de nascimento"
              label="País de nascimento"
              style={{
                container: "mb-3 col-12",
                input: "",
              }}
              type="natural_country"
              onChange={(e) => setNatural_country(e.target.value)}
              value={natural_country}
              name="natural_country"
              errors={errors}
            />
          </Form>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={createPerson}
          >
            Salvar
          </button>
        </>
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
                  // data={[
                  //   {
                  //     id: "rg",
                  //     label: "RG",
                  //   },
                  //   {
                  //     id: "cnh",
                  //     label: "CNH",
                  //   },
                  // ]}
                  data={
                    documentTypes?.map((type) => ({
                      id: type.id,
                      label: type.name,
                    })) || [
                      {
                        id: "rg",
                        label: "RG",
                      },
                      {
                        id: "cnh",
                        label: "CNH",
                      },
                    ]
                  }
                  label="Gênero"
                  onChange={(e) => {
                    const newDocuments = [...documents];
                    newDocuments[index].documentType = e.target.value;
                    setDocuments(newDocuments);
                  }}
                  value={document.documentType}
                  disabled={!document.isnew}
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
                  disabled={!document.isnew}
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
                  disabled={!document.isnew}
                />
                <Input
                  image={undefined}
                  placeholder="Data de expedição"
                  label="Data de expedição"
                  style={{
                    container: "mb-3 col-12",
                    input: "",
                  }}
                  type="date"
                  onChange={(e) => {
                    const newDocuments = [...documents];
                    newDocuments[index].expedit = e.target.value;
                    console.log(newDocuments[index].expedit);
                    setDocuments(newDocuments);
                  }}
                  value={document.expedit.toString()}
                  disabled={!document.isnew}
                />
                <Input
                  image={undefined}
                  placeholder="Data de expiração"
                  label="Data de expiração"
                  style={{
                    container: "mb-3 col-12",
                    input: "",
                  }}
                  type="date"
                  onChange={(e) => {
                    const newDocuments = [...documents];
                    newDocuments[index].expDate = e.target.value;
                    console.log(newDocuments[index].expDate);
                    setDocuments(newDocuments);
                  }}
                  value={document.expDate.toString()}
                  disabled={!document.isnew}
                />
                <Input
                  image={undefined}
                  placeholder="Orgão de emissão"
                  label="Orgão de emissão"
                  style={{
                    container: "mb-3 col-12",
                    input: "",
                  }}
                  type="text"
                  onChange={(e) => {
                    const newDocuments = [...documents];
                    newDocuments[index].expCorp = e.target.value;
                    console.log(newDocuments[index].expCorp);
                    setDocuments(newDocuments);
                  }}
                  value={document.expCorp.toString()}
                  disabled={!document.isnew}
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
                    expCorp: "",
                    expDate: "",
                    expedit: "",
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
                  disabled={!address.isnew}
                />
                <Input
                  image={undefined}
                  placeholder="Bairro"
                  label="Bairro"
                  style={{
                    container: "mb-3 col-12",
                    input: "",
                  }}
                  type="text"
                  errors={errors}
                  name="neighborhood"
                  onChange={(e) => {
                    const newAddresses = [...addresses];
                    newAddresses[index].neighborhood = e.target.value;
                    setAddresses(newAddresses);
                  }}
                  value={address.neighborhood}
                  disabled={!address.isnew}
                />
                <Input
                  image={undefined}
                  placeholder="Número"
                  label="Número"
                  style={{
                    container: "mb-3 col-12",
                    input: "",
                  }}
                  type="text"
                  errors={errors}
                  name="number"
                  onChange={(e) => {
                    const newAddresses = [...addresses];
                    newAddresses[index].number = e.target.value;
                    setAddresses(newAddresses);
                  }}
                  value={address.number}
                  disabled={!address.isnew}
                />
                <Input
                  image={undefined}
                  placeholder="Código postal"
                  label="Código postal"
                  style={{
                    container: "mb-3 col-12",
                    input: "",
                  }}
                  type="text"
                  errors={errors}
                  name="postal_code"
                  onChange={(e) => {
                    const newAddresses = [...addresses];
                    newAddresses[index].postal_code = e.target.value;
                    setAddresses(newAddresses);
                  }}
                  value={address.postal_code}
                  disabled={!address.isnew}
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
                  disabled={!address.isnew}
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
                  disabled={!address.isnew}
                />
                <Input
                  image={undefined}
                  placeholder="País"
                  label="País"
                  style={{
                    container: "mb-3 col-12",
                    input: "",
                  }}
                  type="text"
                  errors={errors}
                  name="country"
                  onChange={(e) => {
                    const newAddresses = [...addresses];
                    newAddresses[index].country = e.target.value;
                    setAddresses(newAddresses);
                  }}
                  value={address.country}
                  disabled={!address.isnew}
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
                  {
                    address: "",
                    city: "",
                    state: "",
                    isnew: true,
                    country: "",
                    main: "",
                    neighborhood: "",
                    number: "",
                    postal_code: "",
                  },
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
