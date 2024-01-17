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

resolver.define("getProjects", async (req) => {
  console.log(req);
  const projects = await fetchProjects();
  console.log("Projects: ", projects);
  return projects;
});

export const handler = resolver.getDefinitions();
