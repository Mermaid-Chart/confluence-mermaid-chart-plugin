import Resolver from "@forge/resolver";
import {
  fetchDiagramSVG,
  fetchDocument,
  createDocument,
  fetchDocuments,
  fetchProjects,
  isTokenExists,
  MCDocument,
} from "../api";
import { storage } from "@forge/api";

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

resolver.define("makeDocument", async (req) => {
  console.log("makeDocument, req:", req);
  const projectID = req.payload.projectID;
  console.log("projectID: ", projectID);
  const document = await createDocument(projectID);
  console.log("document: ", document);
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
  return projects;
});

resolver.define("getTokenExist", async (req) => {
  console.log("getTokenExist called");
  const tokenExist = await isTokenExists();
  console.log("tokenExist: ", tokenExist);
  return tokenExist;
});

resolver.define("storeDiagramAction", async (req) => {
  console.log("storeData called");
  console.log(
    "In storeDiagramAction, Diagram action:",
    req.payload.diagramAction
  );

  //const diagramAction = req.payload.diagramAction;
  // const value = req.payload.diagramAction.toString();
  // console.log("value: ", value);

  if (req.payload.diagramAction === undefined) {
    const result = storage.set("diagram-action", "None");
    return result;
  }

  if (req.payload.diagramAction === "None") {
    const result = storage.set("diagram-action", "None");
    return result;
  }

  if (req.payload.diagramAction === "Edit") {
    const result = storage.set("diagram-action", "Edit");
    return result;
  }

  if (req.payload.diagramAction === "Refresh") {
    const result = storage.set("diagram-action", "Refresh");
    return result;
  }

  if (req.payload.diagramAction === "Create") {
    const result = storage.set("diagram-action", "Create");
    return result;
  }
});

resolver.define("getDiagramAction", async (req) => {
  console.log("getDiagramAction");

  const result = await storage.get("diagram-action");

  return result;
});

export const handler = resolver.getDefinitions();
