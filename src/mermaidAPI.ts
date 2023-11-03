import { fetch } from '@forge/api'
import { RequestInit } from 'node-fetch'

const defaultBaseURL = "https://www.mermaidchart.com";

export interface InitParams {
  token: string;
  baseURL?: string;
}

export interface MCUser {
  fullName: string;
  emailAddress: string;
}

export interface MCProject {
  id: string;
  title: string;
}

export interface MCDocument {
  documentID: string;
  projectID: string;
  major: string;
  minor: string;
  title: string;
}

export class MermaidChartAPI {
  private baseURL!: string;
  private accessToken?: string;

  constructor({ token, baseURL }: InitParams) {
    this.setAccessToken(token);
    this.baseURL = baseURL || defaultBaseURL;
  }

  /**
   * @param accessToken access token to use for requests
   */
  public async setAccessToken(accessToken: string): Promise<void> {
    await this.getUser();
    this.accessToken = accessToken;
  }

  public async resetAccessToken(): Promise<void> {
    this.accessToken = undefined;
  }

  /**
   * @returns the access token to use for requests
   */
  public async getAccessToken(): Promise<string> {
    if (!this.accessToken) {
      throw new Error("No access token set. Please authenticate first.");
    }
    return this.accessToken;
  }

  public async getUser(): Promise<MCUser> {
    return this.request<MCUser>(this.URLS.rest.users.self);
  }

  public async getProjects(): Promise<MCProject[]> {
    return await this.request<MCProject[]>(this.URLS.rest.projects.list, {method: 'get'});
  }

  // public async getDocuments(projectID: string): Promise<MCDocument[]> {
  //   const projects = await this.axios.get<MCDocument[]>(
  //     this.URLS.rest.projects.get(projectID).documents
  //   );
  //   return projects.data;
  // }

  public async getEditURL(document: Pick<MCDocument, "documentID">) {
    const url = `${this.baseURL}${this.URLS.diagram(document).edit}`;
    return url;
  }

  // public async getRawDocument(
  //   document: Pick<MCDocument, "documentID" | "major" | "minor">,
  //   theme: "light" | "dark"
  // ) {
  //   const raw = await this.axios.get<string>(
  //     this.URLS.raw(document, theme).svg
  //   );
  //   return raw.data;
  // }

  private async request<T = any>(path: string, data: RequestInit = {}): Promise<T> {
    if (!data.headers) {
      data.headers = {};
    }
    data.headers['Authorization'] = this.getAccessToken();

    const response = await fetch(path, data);
    if (!response.ok) {

    }

    return response.json();
  }

  private URLS = {
    rest: {
      users: {
        self: `/rest-api/users/me`,
      },
      documents: {
        get: (documentID: string) => {
          return `/rest-api/documents/${documentID}`;
        },
      },
      projects: {
        list: `/rest-api/projects`,
        get: (projectID: string) => {
          return {
            documents: `/rest-api/projects/${projectID}/documents`,
          };
        },
      },
    },
    raw: (
      document: Pick<MCDocument, "documentID" | "major" | "minor">,
      theme: "light" | "dark"
    ) => {
      const base = `/raw/${document.documentID}?version=v${document.major}.${document.minor}&theme=${theme}&format=`;
      return {
        html: base + "html",
        svg: base + "svg",
        png: base + "png",
      };
    },
    diagram: (d: Pick<MCDocument, "documentID">) => {
      // const base = `/app/projects/${d.projectID}/diagrams/${d.documentID}/version/v${d.major}.${d.minor}`;
      return {
        // self: base,
        edit: `/app/diagrams/${d.documentID}?ref=vscode`,
        // view: base + "/view",
      } as const;
    },
  } as const;
}
