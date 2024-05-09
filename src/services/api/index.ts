import axios, { AxiosInstance } from "axios";
import Cache from "../cache";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      Cache.remove("assignature");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

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
  email: string;
  civil_state: string;
  father_name: string;
  mother_name: string;
  profession: string;
  is_client: boolean;
  natural_city: string;
  natural_country: string;
  natural_state: string;
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
    type: string;
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

interface ILoginRequest {
  email: string;
  password: string;
}

interface ICreateFile {
  type: string;
  usersid: string[];
}

export interface IDocumentTypes {
  id: string;
  name: string;
}
export default class API {
  api: AxiosInstance;

  constructor() {
    this.api = api;
  }

  private async getCredentials(): Promise<ILoginRequest | null> {
    const data = JSON.parse((await Cache.get("assignature")) || "{}");

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  }

  async createFile(data: ICreateFile) {
    return this.api.post("/file/create", data, {
      auth: {
        password: (await this.getCredentials())?.password as string,
        username: (await this.getCredentials())?.email as string,
      },
    });
  }

  async getDocumentTypes() {
    return this.api.get<{ data: IDocumentTypes[] }>("/document/type", {
      auth: {
        password: (await this.getCredentials())?.password as string,
        username: (await this.getCredentials())?.email as string,
      },
    });
  }

  async getUsers() {
    return this.api.get<IGetUserResponse[]>("/person", {
      auth: {
        password: (await this.getCredentials())?.password as string,
        username: (await this.getCredentials())?.email as string,
      },
    });
  }

  async login(data: ILoginRequest) {
    return this.api.post<IIdResponse>("/login", data);
  }
  async createUser(data: ICreateUserRequest) {
    return this.api.post<IIdResponse>("/person/create", data, {
      auth: {
        password: (await this.getCredentials())?.password as string,
        username: (await this.getCredentials())?.email as string,
      },
    });
  }

  async updateUser(id: string, data: ICreateUserRequest) {
    return this.api.put<IIdResponse>(`/person/${id}`, data, {
      auth: {
        password: (await this.getCredentials())?.password as string,
        username: (await this.getCredentials())?.email as string,
      },
    });
  }

  async createDocument(data: ICreateDocumentRequest) {
    const formData = new FormData();
    console.log({ data });
    formData.append("type", data.type.toUpperCase());
    formData.append("value", data.value);
    formData.append("person", data.person.replaceAll('"', ""));
    formData.append("file", data.file);

    return this.api.post<IIdResponse>("/document/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },

      auth: {
        password: (await this.getCredentials())?.password as string,
        username: (await this.getCredentials())?.email as string,
      },
    });
  }

  async createAddress(data: ICreateAddressRequest) {
    return this.api.post<IIdResponse>(
      "/address/create",
      {
        ...data,
        person: data.person.replaceAll('"', ""),
      } as ICreateAddressRequest,
      {
        auth: {
          password: (await this.getCredentials())?.password as string,
          username: (await this.getCredentials())?.email as string,
        },
      }
    );
  }

  async getUserById(id: string) {
    return this.api.get<IGetUserByIdResponse>(`/person/${id}`, {
      auth: {
        password: (await this.getCredentials())?.password as string,
        username: (await this.getCredentials())?.email as string,
      },
    });
  }

  async deleteAddress(id: string) {
    return this.api.delete(`/address/${id}`, {
      auth: {
        password: (await this.getCredentials())?.password as string,
        username: (await this.getCredentials())?.email as string,
      },
    });
  }

  async deleteDocument(id: string) {
    return this.api.delete(`/document/${id}`, {
      auth: {
        password: (await this.getCredentials())?.password as string,
        username: (await this.getCredentials())?.email as string,
      },
    });
  }

  async deleteUser(id: string) {
    return this.api.delete(`/person/${id}`, {
      auth: {
        password: (await this.getCredentials())?.password as string,
        username: (await this.getCredentials())?.email as string,
      },
    });
  }

  getImageUrl(image: string) {
    return `${process.env.REACT_APP_API_URL}/file/${image}`;
  }
}
