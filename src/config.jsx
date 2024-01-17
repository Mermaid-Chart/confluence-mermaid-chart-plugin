import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";
import { TextField } from "@forge/react";
// import {
//   fetchDiagramSVG,
//   fetchDocument,
//   fetchDocuments,
//   fetchProjects,
//   isTokenExists,
//   MCDocument,
// } from "./api";
// type ConfigType = {
//   documentID?: string;
//   caption?: string;
//   imageSize?: ImageProps["size"];
// };

const defaultConfig = {
  name: "Unnamed Pet",
  age: "0",
};

export const Config = () => {
  const [data, setData] = useState(null);
  // const [productContext, setProductContext] = useState({});
  // const config = productContext?.extension?.config || ({} as ConfigType);

  useEffect(() => {
    invoke("getProjects", {}).then(setData);
    // invoke("getText", { example: "my-invoke-variable" }).then(setData);
  }, []);
  return (
    <>
      <TextField
        name="name"
        label="Pet name"
        defaultValue={defaultConfig.name}
      />
      <TextField
        name="age"
        label="Pet age"
        defaultValue={data ? data.length : -1}
      />
    </>
  );
};
