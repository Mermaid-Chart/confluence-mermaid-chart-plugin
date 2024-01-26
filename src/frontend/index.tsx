import React, { useEffect, useState } from "react";
import ForgeReconciler, { Text, TextField, Option,
  Select, Link, RadioGroup, Radio, Button,
TextArea  } from "@forge/react";
import { invoke, view } from "@forge/bridge";
import { MCDocument, MCProject, fetchProjects } from '../api';
import { router } from "@forge/bridge";

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

const openDiagram = (documentID:string) => {
  const diagramURL = `https://www.mermaidchart.com/app/diagrams/${documentID}?ref=vscode`
  router.open(diagramURL);
}




const Config = () => {
  const [isToken, setToken] = useState(null);
  const [projects, setProjects] = useState<MCProject[]>([] as MCProject[]);
  const [options, setOptions] = useState([]);
  const [selectedDiagramAction, setSelectDiagramAction] = useState("None");
  useEffect(() => {

    const promises = [];

    if(projects.length === 0) {
    // If token empty, then get token
      if(isToken === null) {
        const pToken = invoke("getTokenExist", {});
        pToken.then(setToken)

        .then(() => {
          const pProjects = invoke("getProjects", {});
          pProjects.then(setProjects);
          pProjects.then((proj) => {
            //console.log('projects: ', proj)
            setProjects(proj as MCProject[]);
          });
          promises.push(pProjects);
        })
      } else {
        const pProjects = invoke("getProjects", {});
        pProjects.then(setProjects)
        promises.push(pProjects);
      }
    }

    // Wait for all promises to complete
    Promise.all(promises).then(() => {
      console.log('isToken: ', isToken);
      console.log('projects: ', projects);
    });

    if (isToken === 'false') {
      setProjects([]);
    }


    // END useEffect
  }, []);

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


  console.log('Prior call to getDiagramAction');
  const pDiagramAction = invoke("getDiagramAction", {});
  console.log('pDiagramAction: ', pDiagramAction);
  pDiagramAction.then((result) => {
    console.log('result: ', result);
    setSelectDiagramAction(result as string);
  });
  console.log('selectedDiagramAction', selectedDiagramAction);



  return (
    <>
      <TextField name="name" label="Pet name" defaultValue={defaultConfig.name} />
      <TextField name="age" label="Pet age" defaultValue={defaultConfig.age} />

      <Select  label="Project" name="projectID">
        {options.map((p) => (
            <Option label={p.title} value={p.id}/>
          ))}
      </Select>


      <RadioGroup label="Diagram Actions" name="diagramAction">
        <Radio label="None" value="None" defaultChecked/>
        <Radio label="Edit Diagram" value="Edit"/>
        <Radio label="Refresh Diagram" value="Refresh"/>
        <Radio label="Create new Diagram" value="Create"/>
      </RadioGroup>


      {selectedDiagramAction === "None" &&
        (<TextField name="None" label="None" />)
      }

      {selectedDiagramAction === "Edit" &&
        (<TextField name="Edit" label="Edit" />)
      }

      {selectedDiagramAction === "Create" &&
        (<TextField name="Create" label="Create" />)
      }

      {selectedDiagramAction === "Refresh" &&
        (<TextField name="Refresh" label="Refresh" />)
      }

    </>
  );
};

const App = () => {
  const [context, setContext] = useState(undefined);
  const [isToken, setToken] = useState(null);
  const [projects, setProjects] = useState<MCProject[]>([] as MCProject[]);
  const [options, setOptions] = useState([]);

  // Set the token and projects
  useEffect(() => {
    view.getContext().then(setContext);

    const promises = [];

    if(projects.length === 0) {
    // If token empty, then get token
      if(isToken === null) {
        const pToken = invoke("getTokenExist", {});
        pToken.then(setToken)

        .then(() => {
          const pProjects = invoke("getProjects", {});
          pProjects.then(setProjects);
          pProjects.then((proj) => {
            //console.log('projects: ', proj)
            setProjects(proj as MCProject[]);
          });
          promises.push(pProjects);
        })
      } else {
        const pProjects = invoke("getProjects", {});
        pProjects.then(setProjects)
        promises.push(pProjects);
      }
    }

    // Wait for all promises to complete
    Promise.all(promises).then(() => {
      console.log('isToken: ', isToken);
      console.log('projects: ', projects);
    });

    if (isToken === 'false') {
      setProjects([]);
    }


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

    // console.log('projectOptions: ', projectOptions);
    // console.log('projectOptionExternal: ', projectOptionExternal);
    setOptions(projectOptions);
  }, [projects]);


  const config = context?.extension.config || defaultConfig;
  const age = config?.age;
  const DiagramAction = config?.diagramAction;

  invoke("storeDiagramAction", {diagramAction: DiagramAction}).then((result) => {
    console.log('result: ', result);
  });


  // Calling of createDiagram
  // const payload = { projectID: 'apa'}
  //  const docs =  invoke("getDocuments", {payload, test:'per'})

  return (
    <>
      <Text>Hello world(ui-kit-2)!</Text>
      <Text>Selected projectID is {config.projectID} .</Text>
      <Text>Selected DiagramAction is {DiagramAction}</Text>
      <Text><Link openNewTab href={`https://www.mermaidchart.com/app/diagrams/${config.documentID}?ref=vscode`}>Edit diagram</Link></Text>
      <Button onClick={() => {
        const payload = { projectID: config.projectID}
        invoke("makeDocument", {payload}).then((result) => {
          console.log('result: ', result);
          const mcDocument = result as MCDocument;
          openDiagram(mcDocument.documentID);
        });
      }}> Create Diagram</Button>

    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ForgeReconciler.addConfig(<Config />);
