import { fetch, storage } from '@forge/api'
import { BASE_URL_KEY, TOKEN_KEY } from './settings'

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

const request = async (path: string, newToken?: string) => {
  const [token, baseUrl] = await Promise.all<string>([
    storage.getSecret(TOKEN_KEY),
    storage.get(BASE_URL_KEY)
  ]);
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${newToken || token}`
    }
  });
  if (response.status >= 500) {
    throw new Error('Internal error');
  }
  if (response.status > 400) {
    throw new Error("Authentication error, please check access token in settings");
  }
  return await response.json();
}

export const fetchProjects = async (): Promise<MCProject[]> => {
  return request('rest-api/projects');
}

export const fetchDocuments = async (projectId: string): Promise<MCDocument[]> => {
  return request(`rest-api/projects/${projectId}/documents`);
}

export const fetchDocument = async (documentID: string): Promise<MCDocument> => {
  return request(`/rest-api/documents/${documentID}`);
}

export const fetchCurrentUser = async (token: string): Promise<MCUser> => {
  return request('/rest-api/users/me', token);
}

export const buildDiagramUrl = async (document: MCDocument) => {
  const baseUrl = await storage.get(BASE_URL_KEY);
  const base = `${baseUrl}raw/${document.documentID}?version=v${document.major}.${document.minor}&theme=light&format=`;
  return {
    html: base + "html",
    svg: base + "svg",
    png: base + "png",
  };
}