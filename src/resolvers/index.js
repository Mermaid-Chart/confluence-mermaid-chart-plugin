import Resolver from "@forge/resolver";
import {
  fetchDiagramSVG,
  fetchDocument,
  fetchDocuments,
  fetchProjects,
  isTokenExists,
  MCDocument,
} from "../api";
const resolver = new Resolver();

resolver.define("getText", async (req) => {
  console.log(req);
  const projects = await fetchProjects();
  // console.log("Projects: ", projects);
  return "Hello, world!!" + projects.length;
});

resolver.define("getDiagramSVG", async (req) => {
  console.log(req);
  const document = req.payload.document;
  const diagramSVG = await fetchDiagramSVG(document);
  //console.log("diagramSVG: ", diagramSVG);
  return diagramSVG;
});

resolver.define("getDocument", async (req) => {
  console.log(req);
  const documentID = req.payload.documentID;
  const document = await fetchDocument(documentID);
  //console.log("document: ", document);
  return document;
});

resolver.define("getDocuments", async (req) => {
  console.log("getDocuments called");
  const projectID = req.payload.projectID;
  const documents = await fetchDocuments(projectID);
  return documents;
});

resolver.define("getProjects", async (req) => {
  console.log("getProjects called");
  const projects = await fetchProjects();
  //console.log("Projects: ", projects);
  return projects;
});

resolver.define("getTokenExist", async (req) => {
  console.log("getTokenExist called");
  const tokenExist = await isTokenExists();
  console.log("tokenExist: ", tokenExist);
  return tokenExist;
});

export const handler = resolver.getDefinitions();
