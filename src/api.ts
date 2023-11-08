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

  return response;
}
const requestJSON = async (path: string, newToken?: string) => {
  const response = await request(path, newToken);

  return await response.json();
}

export const fetchProjects = async (): Promise<MCProject[]> => {
  return requestJSON('rest-api/projects');
}

export const fetchDocuments = async (projectId: string): Promise<MCDocument[]> => {
  return requestJSON(`rest-api/projects/${projectId}/documents`);
}

export const fetchDocument = async (documentID: string): Promise<MCDocument> => {
  return requestJSON(`/rest-api/documents/${documentID}`);
}

export const fetchCurrentUser = async (token: string): Promise<MCUser> => {
  return requestJSON('/rest-api/users/me', token);
}

export const fetchDiagramSVG = async (document: MCDocument) => {
  const response = await request(`raw/${document.documentID}?version=v${document.major}.${document.minor}&theme=light&format=svg`);

  return await response.text();
}
