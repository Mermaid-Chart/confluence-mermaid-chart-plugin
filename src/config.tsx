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
  const [projects, setProjects] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    invoke("getTokenExist", {}).then(setToken);
    invoke("getProjects", {}).then(setProjects);
  }, []);

const [options] = useState<OptionType[]>( () => {

  if (isToken === 'false') {
    return [];
  }
  const result: OptionType[] = [];

  // Fetch all projects
  invoke("getProjects", {}).then(tempProjects => {
    const dp = [];


    (tempProjects as MCProject[]).map((p) => {

      invoke("getDocuments", {projectID: p.id}).then(tempDocuments => {
        dp.push(tempDocuments);
      })
    })

    const docResult: MCDocument[][] = dp;

    console.log('docResult', docResult);
    console.log('tempProjects', tempProjects);

    (tempProjects as MCProject[]).forEach((p, idx) => {
      console.log('pushing', p);
      result.push({
        id: p.id,
        title: p.title,
      })
    })
    console.log('result', result);
    return result;
  })
  return result;

});
  const imageSizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'];
  console.log('options', options);
  return (
    <>
      <Select label="Project" name="projectTitle">
        {options.map((p) => (
          <Option label={p.title} value={p.title}/>
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
