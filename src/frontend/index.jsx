import React, { useEffect, useState } from "react";
import ForgeReconciler, { Text } from "@forge/react";
import { invoke } from "@forge/bridge";
import { ImageProps } from "@forge/ui/out/types/components";

// type ConfigType = {
//   documentID?: string;
//   caption?: string;
//   imageSize?: ImageProps["size"];
// };

const App = () => {
  // const config = (useConfig() || {}) as ConfigType;
  // const [data, setData] = useState(null);
  const [productContext, setProductContext] = useState({});
  // const config = productContext?.extension?.config || ({} as ConfigType);

  useEffect(() => {
    invoke("getText", { example: "my-invoke-variable" }).then(setData);
  }, []);

  return (
    <>
      <Text>Hello world!</Text>
      {/* <Text>{data ? data : "Loading..."}</Text> */}
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
