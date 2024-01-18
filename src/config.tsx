import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";
import { TextField, Select, Option, Text } from "@forge/react";
import { ImageProps } from '@forge/ui/out/types/components'
import { MCDocument, MCProject } from './api';
const defaultConfig = {
  name: "Unnamed Pet",
  age: "0",
};

type ConfigType = {
  documentID?: string
  caption?: string
  imageSize?: ImageProps['size']
}
type OptionType = {
  id: string;
  title: string;
}


export const Config = () => {
  const [isToken, setToken] = useState(null);
  //const [projects, setProjects] = useState<MCProject[]>([]);
  //const [documents, setDocuments] = useState<MCDocument[]>([]);
  const [projects, setProjects] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    invoke("getTokenExist", {}).then(setToken);
    invoke("getProjects", {}).then(setProjects);

    //const payload = { projectID: 'apa'}
    //const docs =  invoke("getDocuments",  { projectID: 'apa'})
  }, []);



const [options] = useState<OptionType[]>( () => {

  if (isToken === 'false') {
    return [];
  }

  const localProjects = new Array<MCProject>();
  const dp = [];
  const result: OptionType[] = [];
  const docResult: MCDocument[][] = [];
  // Fetch all projects
  invoke("getProjects", {}).then(tempProjects => {
    console.log('Projects:', tempProjects);

    (tempProjects as MCProject[]).map((p) => {
      //localProjects.push(p);
      invoke("getDocuments", {projectID: p.id}).then(tempDocuments => {
        console.log('Documents:', tempDocuments);
        dp.push(tempDocuments);
      })
    })

    const docResult: MCDocument[][] = dp;
    console.log('docResult', docResult);
    console.log('tempProjects', tempProjects);
    (tempProjects as MCProject[]).map((p, idx) => {
      (docResult[idx] || []).map((doc) => {
        result.push({
          id: doc.documentID,
          title: `${p.title}/${doc.title}`,
        })
      })
    })
    console.log('result', result);
    return result;
  })

  console.log('docResult.length', docResult.length);
  console.log('docResult', docResult);
  console.log('localProjects', localProjects);




  //const result: OptionType[] = [];


  // localProjects.map((p, idx) => {
  //   (docResult[idx] || []).map((doc) => {
  //     console.log('pushing to result', doc);
  //     result.push({
  //       id: doc.documentID,
  //       title: `${p.title}/${doc.title}`,
  //     })
  //   })
  // })

  console.log('result', result);

  return result
});
  const imageSizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'];

  return (
    <>
      <Select label="Diagram" name="documentID">
        {options.map((p) => (
          <Option label={p.title} value={p.id}/>
        ))}
      </Select>
      <TextField name="caption" label="Caption" />
      <Select label="Image size" name="imageSize">
        {imageSizes.map((s) => (
          <Option label={s} value={s}/>
        ))}
      </Select>

      <TextField
        name="Token"
        label="Token"
        defaultValue={isToken}
      />

      <TextField
        name="Projects"
        label="Projects"
        defaultValue={projects ? projects.length : -1}
      />

      <TextField
        name="Documents"
        label="Documents"
        defaultValue={documents ? documents.length : -1}
      />

    </>
  );
}
// export const Config = () => {
//   const [data, setData] = useState(null);
//   // const [productContext, setProductContext] = useState({});
//   // const config = productContext?.extension?.config || ({} as ConfigType);

//   useEffect(() => {
//     invoke("getProjects", {}).then(setData);
//     // invoke("getText", { example: "my-invoke-variable" }).then(setData);
//   }, []);
//   return (
//     <>
//       <TextField
//         name="name"
//         label="Pet name"
//         defaultValue={defaultConfig.name}
//       />
//       <TextField
//         name="age"
//         label="Pet age"
//         defaultValue={data ? data.length : -1}
//       />
//     </>
//   );
// };
