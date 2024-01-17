import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";
import { TextField, Select, Option } from "@forge/react";
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
  const [isToken, setToken] = useState(false);
  const [projects, setProjects] = useState<MCProject[]>([]);
  const [documents, setDocuments] = useState<MCDocument[]>([]);


const [options] = useState<OptionType[]>( () => {
  //const isToken = await isTokenExists();
  useEffect(() => {
    invoke("isTokenExist", {}).then(setToken);
  }, []);


  // if (!isToken) return [];
  // //const projects = await fetchProjects()
  // useEffect(() => {
  //   invoke("getProjects", {}).then(setProjects);
  // }, []);
  // const dp = []

  //projects.map((p) => dp.push(fetchDocuments(p.id)))

  // projects.map((p) => {
  //   useEffect(() => {
  //     invoke("getDocuments", {payload: p.id}).then(setDocuments);
  //   }, []);
  //   dp.push(documents);
  // })

  //const docResult: MCDocument[][] = await Promise.all(dp)


  const result: OptionType[] = [];
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
