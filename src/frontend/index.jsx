import React, { useEffect, useState } from "react";
import ForgeReconciler, { Text } from "@forge/react";
import { invoke, view } from "@forge/bridge";
import { Config } from "../config";

const App = () => {
  // const config = (useConfig() || {}) as ConfigType;
  const [data, setData] = useState(null);
  const [productContext, setProductContext] = useState({});
  //const config = productContext?.extension?.config || ({} as ConfigType);
  const [context, setContext] = useState({});


  useEffect(() => {
    invoke("getText", { example: "my-invoke-variable" }).then(setData);
    view.getContext().then(setContext);
  }, []);

  const config = context?.extension?.config;
  const selectedProject = config?.projectTitle;
  return (
    <>
      <Text>Hello world(ui-kit-2)!</Text>
      <Text>Selected Project: {selectedProject}</Text>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ForgeReconciler.addConfig(<Config />);
