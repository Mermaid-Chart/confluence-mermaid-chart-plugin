import "../buffer-poly";
import React, { useEffect, useState } from "react";
import ForgeReconciler, { Text } from "@forge/react";
import { invoke } from "@forge/bridge";
import ForgeUI, { render, MacroConfig, TextField } from "@forge/ui";


// type ConfigType = {
//   documentID?: string;
//   caption?: string;
//   imageSize?: ImageProps["size"];
// };

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
      <Text>
        Config: {productContext?.extension?.config?.age}
      </Text>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ForgeReconciler.addConfig(<Config />);

const defaultConfig = {
  name: "Unnamed Pet",
  age: "0"
};

const Config = () => {
  return (
    <MacroConfig>
      <TextField name="name" label="Pet name" defaultValue={defaultConfig.name} />
      <TextField name="age" label="Pet age" defaultValue={defaultConfig.age} />
    </MacroConfig>
  );
};

export const config = render(<Config />);