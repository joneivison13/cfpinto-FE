import axios, { AxiosInstance } from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export interface IGetUserResponse {
  id: string;
  name: string;
  nacionality: string;
  document: string;
  birthDate: string;
  gender: string;
  phone: string;
  telephone: string;
  createdAt: string;
  updatedAt: string;
  Address: [
    {
      id: string;
      street: string;
      city: string;
      state: string;
      personId: string;
      createdAt: string;
      updatedAt: string;
    }
  ];
}

export interface ICreateUserRequest {
  name: string;
  nacionality: string;
  document: string;
  birthDate: string;
  gender: string;
  phone: string;
  telephone: string;
}

export interface ICreateDocumentRequest {
  type: string;
  value: string;
  person: string;
  file: any;
}

export interface ICreateAddressRequest {
  street: string;
  city: string;
  state: string;
  person: string;
}

export interface IIdResponse {
  id: string;
}

export interface IGetUserByIdResponse {
  birthDate: string;
  Address: {
    id: string;
    street: string;
    city: string;
    state: string;
    personId: string;
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  Document: {
    id: string;
    file: null;
    value: string;
  }[];
  document: string;
  gender: string;
  id: string;
  nacionality: string;
  name: string;
  phone: string;
  telephone: string;
  updatedAt: string;
}

export default class API {
  api: AxiosInstance;

  constructor() {
    this.api = api;
  }

  async getUsers() {
    return this.api.get<IGetUserResponse[]>("/person");
  }

  async createUser(data: ICreateUserRequest) {
    return this.api.post<IIdResponse>("/person/create", data);
  }

  async createDocument(data: ICreateDocumentRequest) {
    const formData = new FormData();
    console.log({ data });
    formData.append("type", data.type);
    formData.append("value", data.value);
    formData.append("person", data.person.replaceAll('"', ""));
    formData.append("file", data.file);

    return this.api.post<IIdResponse>("/document/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async createAddress(data: ICreateAddressRequest) {
    return this.api.post<IIdResponse>("/address/create", {
      ...data,
      person: data.person.replaceAll('"', ""),
    } as ICreateAddressRequest);
  }

  async getUserById(id: string) {
    return this.api.get<IGetUserByIdResponse>(`/person/${id}`);
  }

  getImageUrl(image: string) {
    return `${process.env.REACT_APP_API_URL}/file/${image}`;
  }
}
