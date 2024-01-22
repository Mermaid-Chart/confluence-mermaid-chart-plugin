import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";
import { TextField, Select, Option, Text } from "@forge/react";
import { ImageProps } from '@forge/ui/out/types/components'
import { MCDocument, MCProject } from './api';

type ConfigType = {
  documentID?: string
  caption?: string
  imageSize?: ImageProps['size']
}

type OptionType = {
  id: string;
  title: string;
}

type DocumentOptionType = {
  id: string;
  title: string;
}

export const Config = () => {
  const [isToken, setToken] = useState(null);
  const [projects, setProjects] = useState<MCProject[]>([] as MCProject[]);


  // const [isTokenAsync, setTokenAsync] = useState(  () => {
  //   console.log('useState for Async called');

  //   const p1 = invoke("getTokenExist", {});
  //   p1.then(()=> {setTokenAsync(true); console.log('setTokenAsync called');})
  //   return isTokenAsync;
  // });



  const [options, setOptions] = useState([]);
  // Set the token and projects
  useEffect(() => {
    console.log('useEffect called');
    // const p1 = invoke("getTokenExist", {});
    // p1.then(setToken)

    // console.log('getProjects called');
    // invoke("getProjects", {}).then(setProjects);

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
              console.log('Perra.. projects: ', proj)
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
        setOptions([]);
        setProjects([]);
      }

      const result: OptionType[] = [];

    // END useEffect

  }, []);



  // const [options] = useState<OptionType[]>( () => {
  //   console.log('useState Option called');
  //   const promises = [];

  //   if(projects.length === 0) {
  //   // If token empty, then get token
  //     if(isToken === null) {
  //       const pToken = invoke("getTokenExist", {});
  //       pToken.then(setToken)

  //       .then(() => {
  //         const pProjects = invoke("getProjects", {});
  //         pProjects.then(setProjects);
  //         pProjects.then(() => console.log('Perra.. projects: ', projects));
  //         promises.push(pProjects);
  //       })
  //     } else {
  //       const pProjects = invoke("getProjects", {});
  //       pProjects.then(setProjects)
  //       promises.push(pProjects);
  //     }
  // }

  //   // Wait for all promises to complete
  //     Promise.all(promises).then(() => {
  //       console.log('isToken: ', isToken);
  //       console.log('projects: ', projects);
  //     });

  //   // invoke("getTokenExist", {}).then((arg) => {
  //   //   // console.log('arg ', arg);
  //   //   // setToken(arg);
  //   //   console.log('isToken: ', isToken);
  //   //   // Now we have the token, get the projects
  //   //   console.log('getProjects called');
  //   //   invoke("getProjects", {}).then(setProjects);
  //   // });


  //   console.log('options called');
  //  ;
  //   if (isToken === 'false') {
  //     return [];
  //   }
  //   const result: OptionType[] = [];


  //   // Fetch all projects
  //   invoke("getProjects", {}).then(tempProjects => {
  //     const dp = [];

  //     (tempProjects as MCProject[]).map((p) => {
  //       invoke("getDocuments", {projectID: p.id}).then(tempDocuments => {
  //         dp.push(tempDocuments);
  //       })
  //     })

  //     const docResult: MCDocument[][] = dp;


  //     (tempProjects as MCProject[]).forEach((p, idx) => {
  //       result.push({
  //         id: p.id,
  //         title: p.title,
  //       })
  //     })
  //   })
  //   return result;
  // });

  const [optionsDocument] = useState<DocumentOptionType[]>( () => {

    if (isToken === 'false') {
      return [];
    }
    const result: DocumentOptionType[] = [];

    // Fetch all documents for the selected project
    // invoke("getDocuments", {}).then(tempProjects => {



    //   (tempProjects as MCProject[]).forEach((p, idx) => {
    //     result.push({
    //       id: p.id,
    //       title: p.title,
    //     })
    //   })
    // })
    return result;
  });

  const imageSizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'];



  const [selectedValue, setSelectedValue] = useState('one');
  return (
    <>

      <Select  label="Project" name="projectTitle" onChange={() => console.log('Change!!')}>
        {options.map((p) => (
          <Option label={p.title} value={p.title}/>
        ))}
      </Select>
      <Select label="Document" name="documentTitle">
        {optionsDocument.map((p) => (
          <Option label={p.title} value={p.title}/>
        ))}
      </Select>
      <TextField name="caption" label="Caption" />
      <Select label="Image size" name="imageSize">
        {imageSizes.map((s) => (
          <Option label={s} value={s}/>
        ))}
      </Select>


      <Select
      label={'Num proj' + projects.length.toString()}
      name="milestone"
      onChange={e => console.log('Change!!')}
    >
        <Option defaultSelected label="Milestone 1" value="one" />
        <Option label={isToken} value="two" />
        <Option label={projects.length.toString()} value="three" />
    </Select>

    </>
  );
}