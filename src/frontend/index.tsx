import React, { useEffect, useState } from "react";
import ForgeReconciler, { Text, Option,
  Select, RadioGroup, Radio, Image  } from "@forge/react";
import { invoke, view } from "@forge/bridge";
import { MCDocument, MCProject } from '../api';
import { router } from "@forge/bridge";
import base64 from 'base-64'
//const BASE_URL = "https://test.mermaidchart.com/";
const BASE_URL = "https://test.mermaidchart.com/";

type ProjectsOptionType = {
  id: string;
  title: string;
}

type ProjAndDocOptionType = {
  id: string;
  title: string;
}

const Config = () => {
  const [isToken, setToken] = useState(null);
  const [projects, setProjects] = useState<MCProject[]>([] as MCProject[]);
  const [options, setOptions] = useState([]);
  const [documents, setDocuments] = useState<MCDocument[]>([] as MCDocument[]);
  const [projAndDocOptions, setProjAndDocOptions] = useState([]);

  const imageSizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'];

  // Set the options
  useEffect(() => {
    //console.log('useEffect options called');
    const projectOptions: ProjectsOptionType[] = [];

    projects.forEach((project) => {
      projectOptions.push({ id: project.id, title: project.title });
    });

    // console.log('projectOptions: ', projectOptions);
    setOptions(projectOptions);
  }, [projects]);

  // Get projects
  useEffect(() => {
    // if(!isToken)  return [];
    console.log('useEffect, get projects');
    const pProjects = invoke("getProjects", {});
    pProjects.then((proj) => {
      console.log('projects: ', proj)
      setProjects(proj as MCProject[]);
    });

  }, [isToken]);

  // Get the documents
  useEffect(() => {
    // if(!isToken)  return [];
    console.log('useEffect, get documents');
    const dp = [];
    const projAndDocOptions: ProjAndDocOptionType[] = [];
    projects.forEach((project) => {
      const pDocuments = invoke("getDocuments", {projectID: project.id});
      pDocuments.then((docs) => {
        dp.push(docs);
        console.log('dp: ', dp);
        console.log('project.id ', project.id);

        (docs as MCDocument[]).forEach((doc) => {
          projAndDocOptions.push({ id: doc.documentID, title: `${project.title}/${doc.title}`});
        });
        console.log('projAndDocOptions: ', projAndDocOptions);
        setProjAndDocOptions(projAndDocOptions);
      });
    });
  }, [projects]);

  return (
    <>


      <Select label="Document for Edit/Refresh" name="documentID">
        {projAndDocOptions.map((p) => (
            <Option label={p.title} value={p.id}/>
          ))}
      </Select>

      <Select label="Image Size" name="imageSize">
        {imageSizes.map((s) => (
            <Option label={s} value={s}/>
          ))}
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
  const [imgBody, setImageBody] = useState(null);

  const config = context?.extension.config;
  const DiagramAction = config?.diagramAction;
  const projectID = config?.projectID;
  const documentID = config?.documentID;
  const imageSize = config?.imageSize;

  // Set the context
  useEffect(() => {
    view.getContext().then(setContext);
  }, []);

  // Get the diagram SVG
  useEffect(() => {

    if(!documentID) return;

    const pDocument = invoke("getDocument", {documentID: documentID});
    pDocument.then((doc) => {
      console.log('document: ', doc);
      const pDocumentSVG = invoke("getDiagramSVG", {document: doc});
      pDocumentSVG.then((result) => {
        console.log('Use effect, getdiagram SVG:', result);
        setImageBody(result);
      });
    });


  }, [documentID]);

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
      newDiagram = result as MCDocument;
      openDiagram(newDiagram.documentID);
      return result;
    });
  }

  const gotoCreateDiagram = () => {
    console.log('In gotoCreateDiagram');
    const diagramURL = `${BASE_URL}app/create-diagram?ref=vscode`
    router.open(diagramURL);
  }



  // Read the stored, last selected diagram action
  // and take action depending on the new selected diagram action
  // from config-panel.
  // Note: This is a workaround
  const pDiagramAction = invoke("getDiagramAction", {});
  pDiagramAction.then((result) => {

    // A new diagram shall be created
    // and route the user to editor of the new diagram
    if(DiagramAction == "Create" && result == "None") {
      // Update the stored diagram action
      invoke("storeDiagramAction", {diagramAction: "Create"}).then((result) => {
        console.log('result: ', result);

        // Create a new diagram
        gotoCreateDiagram();
      });
    }

    // An existing diagram shall be edited.
    // Route the user to editor of the new diagram
    if(DiagramAction == "Edit" && result == "None") {
      // Update the stored diagram action
      invoke("storeDiagramAction", {diagramAction: "Edit"}).then((result) => {
        console.log('result: ', result);

        // Open the diagram
        openDiagram(config.documentID);
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
      <Text>Selected DiagramID is {documentID}</Text>
      <Image size={imageSize} src={`data:image/svg+xml;base64,${base64.encode(imgBody)}`} alt={document.title}/>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ForgeReconciler.addConfig(<Config />);
