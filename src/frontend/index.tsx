import React, { useEffect, useState } from "react";
import ForgeReconciler, { Text, TextField, Option, Select, Link, Button } from "@forge/react";
import { invoke, view } from "@forge/bridge";
import { MCDocument, MCProject, fetchProjects } from '../api';
//import { Config } from "../config";

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
            console.log('projects: ', proj)
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
    console.log('useEffect options called');
    const projectOptions: ProjectsOptionType[] = [];

    projects.forEach((project) => {
      projectOptions.push({ id: project.id, title: project.title });
    });

    console.log('projectOptions: ', projectOptions);
    console.log('projectOptionExternal: ', projectOptionExternal);
    setOptions(projectOptions);
  }, [projects]);


  return (
    <>
      <TextField name="name" label="Pet name" defaultValue={defaultConfig.name} />
      <TextField name="age" label="Pet age" defaultValue={defaultConfig.age} />

      <Select  label="Project" name="projectID">
        {options.map((p) => (
            <Option label={p.title} value={p.id}/>
          ))}
      </Select>

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
            console.log('projects: ', proj)
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
    console.log('useEffect options called');
    const projectOptions: ProjectsOptionType[] = [];

    projects.forEach((project) => {
      projectOptions.push({ id: project.id, title: project.title });
      projectOptionExternal.push({ id: project.id, title: project.title });
    });

    console.log('projectOptions: ', projectOptions);
    console.log('projectOptionExternal: ', projectOptionExternal);
    setOptions(projectOptions);
  }, [projects]);


  const config = context?.extension.config || defaultConfig;
  const age = config?.age;

  // Calling of createDiagram
  // const payload = { projectID: 'apa'}
  //  const docs =  invoke("getDocuments", {payload, test:'per'})

  return (
    <>
      <Text>Hello world(ui-kit-2)!</Text>
      <Text>{config.name} is {config.age} years old.</Text>
      <Text>Selected projectID is {config.projectID} .</Text>
      <Text><Link openNewTab href={`https://www.mermaidchart.com/app/diagrams/${config.documentID}?ref=vscode`}>Edit diagram</Link></Text>
      <Button onClick={() => {
        const payload = { projectID: config.projectID}
        invoke("makeDocument", {payload}).then((result) => {
          console.log('result: ', result);
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
