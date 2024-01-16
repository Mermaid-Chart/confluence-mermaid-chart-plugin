import React, { useEffect, useState } from "react";
import ForgeReconciler, { Text } from "@forge/react";
import { invoke } from "@forge/bridge";
import { Config } from "../config";
// import {
//   fetchDiagramSVG,
//   fetchDocument,
//   fetchDocuments,
//   fetchProjects,
//   isTokenExists,
//   MCDocument,
// } from "../api";

const App = () => {
  // const config = (useConfig() || {}) as ConfigType;
  const [data, setData] = useState(null);
  const [productContext, setProductContext] = useState({});
  // const config = productContext?.extension?.config || ({} as ConfigType);

  useEffect(() => {
    invoke("getText", { example: "my-invoke-variable" }).then(setData);
  }, []);

  return (
    <>
      <Text>Hello world(ui-kit-2)!</Text>
      <Text>{data ? data : "Loading..."}</Text>
      <Text>Config: {productContext?.extension?.config?.age}</Text>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
ForgeReconciler.addConfig(<Config />);
