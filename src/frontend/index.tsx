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
  //const diagramURL = `https://www.mermaidchart.com/app/diagrams/${documentID}?ref=vscode`
  //router.open(diagramURL);
  const diagramURL = `https://www.mermaidchart.com/app/projects?ref=vscode`
  //router.open(diagramURL);
  //const diagramURL = `https://www.google.com`
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


  const pDiagramAction = invoke("getDiagramAction", {});
  pDiagramAction.then((result) => {
    setSelectDiagramAction(result as string);
  });
  console.log('In config, selectedDiagramAction', selectedDiagramAction);




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


    </>
  );
};

const App = () => {
  const [context, setContext] = useState(undefined);
  const [isToken, setToken] = useState(null);
  const [projects, setProjects] = useState<MCProject[]>([] as MCProject[]);
  const [options, setOptions] = useState([]);
  const [storedDiagramAction, setStoredDiagramAction] = useState(null);

  // Set the token and projects
  useEffect(() => {
    view.getContext().then(setContext);

    // Set the state of the stored diagram action
    // from storage
    const pDiagramAction = invoke("getDiagramAction", {});
    pDiagramAction.then((result) => {
      console.log('In App, read diagram action: ', result);
      setStoredDiagramAction(result as string);
    });

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


  // Set the state of the stored diagram action
  // from storage
  // const pDiagramAction = invoke("getDiagramAction", {});
  // pDiagramAction.then((result) => {
  //   console.log('In App, read diagram action: ', result);
  //   setStoredDiagramAction(result as string);
  // });


  console.log('In App, selectedDiagramAction', DiagramAction);
  console.log('In App, storedDiagramAction', storedDiagramAction);

  // Conditional routing based on new DiagramAction
  // and previous status
  if(DiagramAction == "Create" && storedDiagramAction == "None") {
    openDiagram('apa');

    // Update the stored diagram action (previous)
    invoke("storeDiagramAction", {diagramAction: "Create"}).then((result) => {
      console.log('result: ', result);
    });
  }

  // Shall be able to reset the stored diagram action to "None"
  if(DiagramAction == "None" ) {
    // Update the stored diagram action (previous)
    invoke("storeDiagramAction", {diagramAction: "None"}).then((result) => {
      console.log('result: ', result);
    });
  }


  // invoke("storeDiagramAction", {diagramAction: DiagramAction}).then((result) => {
  //   console.log('result: ', result);
  // });


  // Calling of createDiagram
  // const payload = { projectID: 'apa'}
  //  const docs =  invoke("getDocuments", {payload, test:'per'})

  return (
    <>
      <Text>Hello world(ui-kit-2)!</Text>

      <Text>Selected DiagramAction is {DiagramAction}</Text>


    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ForgeReconciler.addConfig(<Config />);
