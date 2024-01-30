import React, { useEffect, useState } from "react";
import ForgeReconciler, { Text, TextField, Option,
  Select, Link, RadioGroup, Radio, Button,
TextArea  } from "@forge/react";
import { invoke, view } from "@forge/bridge";
import { MCDocument, MCProject, fetchProjects } from '../api';
import { router } from "@forge/bridge";

const BASE_URL = "https://test.mermaidchart.com/";

type ProjectsOptionType = {
  id: string;
  title: string;
}

const defaultConfig = {
  name: 'Unnamed Pet',
  age: '0'
};

const defaultProjectConfig =
{
  name: 'Personal Project',
  id: '0'
};

const projectOptionExternal: ProjectsOptionType[] = [];


const Config = () => {
  const [isToken, setToken] = useState(null);
  const [projects, setProjects] = useState<MCProject[]>([] as MCProject[]);
  const [options, setOptions] = useState([]);
  const [documents, setDocuments] = useState<MCDocument[]>([] as MCDocument[]);



  // Set the options
  useEffect(() => {
    //console.log('useEffect options called');
    const projectOptions: ProjectsOptionType[] = [];

    projects.forEach((project) => {
      projectOptions.push({ id: project.id, title: project.title });
    });

    // console.log('projectOptions: ', projectOptions);
    // console.log('projectOptionExternal: ', projectOptionExternal);
    setOptions(projectOptions);
  }, [projects]);

  // Get projects
  useEffect(() => {
    // if(!isToken)  return [];
    const pProjects = invoke("getProjects", {});
    pProjects.then((proj) => {
      console.log('projects: ', proj)
      setProjects(proj as MCProject[]);
    });

  }, [isToken]);

  // Get the documents
  useEffect(() => {
    // if(!isToken)  return [];
    console.log('useEffect, get projects: ', projects);
    const dp = [];
    projects.forEach((project) => {
      const pDocuments = invoke("getDocuments", {projectID: project.id});
      pDocuments.then((docs) => {
        dp.push(docs);
        console.log('dp: ', dp);
      });
    });
  }, [projects]);



  return (
    <>
      <Select label="Project for New Diagram" name="projectID">
        {options.map((p) => (
            <Option label={p.title} value={p.id}/>
          ))}
      </Select>

      <Select label="Document for Edit/Refresh" name="documentID">
        <Option label="Document 1" value="1"/>
        <Option label="Document 2" value="2"/>
        <Option label="Document 3" value="3"/>
      </Select>

      <RadioGroup label="Diagram Actions" name="diagramAction">
        <Radio label="None" value="None" defaultChecked/>
        <Radio label="Edit Diagram" value="Edit"/>
        <Radio label="Refresh Diagram" value="Refresh"/>
        <Radio label="Create new Diagram" value="Create"/>
      </RadioGroup>


    </>
  );
};

const App = () => {
  const [context, setContext] = useState(undefined);
  const [isToken, setToken] = useState(null);
  const [projects, setProjects] = useState<MCProject[]>([] as MCProject[]);
  const [options, setOptions] = useState([]);
  const [document, setDocument] = useState<MCDocument>(null);

  const config = context?.extension.config || defaultConfig;
  const DiagramAction = config?.diagramAction;
  const projectID = config?.projectID;


  // Set the token and projects
  useEffect(() => {
    view.getContext().then(setContext);

    // END useEffect
  }, []);

  // Set the options
  useEffect(() => {
    // console.log('useEffect options called');
    const projectOptions: ProjectsOptionType[] = [];

    projects.forEach((project) => {
      projectOptions.push({ id: project.id, title: project.title });
      projectOptionExternal.push({ id: project.id, title: project.title });
    });


    setOptions(projectOptions);
  }, [projects]);





  const openDiagram = (documentID:string) => {
    console.log('In openDiagram, documentID: ', documentID);
    const diagramURL = `${BASE_URL}app/diagrams/${documentID}?ref=vscode`
    router.open(diagramURL);
  }

  const createNewDiagram = async (projectID:string) => {
    console.log('In createNewDiagram, projectID: ', projectID);
    let newDiagram: MCDocument = null;
    const result =  invoke("makeDocument", {projectID: projectID});

    result.then((result) => {
      console.log('In createNewDiagram, result: ', result);
      setDocument(result as MCDocument);
      newDiagram = result as MCDocument;
      openDiagram(newDiagram.documentID);
      return result;
    });
  }



  // If DiagramAction is "Create" and previous status is "None"
  // 1. Wait for the stored diagram action to be fetched
  // 2. Check the DiagramAction from the config
  // 3. If DiagramAction is "Create" and previous status is "None"
  //   then create a new diagram
  // 4. Wait until the the stored diagram action is updated
  const pDiagramAction = invoke("getDiagramAction", {});
  pDiagramAction.then((result) => {

    console.log('In App, read diagram action: ', result);

    if(DiagramAction == "Create" && result == "None") {
      // Update the stored diagram action
      invoke("storeDiagramAction", {diagramAction: "Create"}).then((result) => {
        console.log('result: ', result);

        // Create a new diagram
        const newDiagram = createNewDiagram(projectID).then((result) => {
          console.log('In App, newDiagram: ', result);
        });
      });
    }

  });

  // Shall be able to reset the stored diagram action to "None"
  if(DiagramAction == "None" ) {
    // Update the stored diagram action (previous)
    invoke("storeDiagramAction", {diagramAction: "None"}).then((result) => {
      console.log('result: ', result);
    });
  }




  return (
    <>
      <Text>Hello world(ui-kit-2)!</Text>
      <Text>Selected DiagramAction is {DiagramAction}</Text>
      <Text>Selected ProjectID is {projectID}</Text>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ForgeReconciler.addConfig(<Config />);
