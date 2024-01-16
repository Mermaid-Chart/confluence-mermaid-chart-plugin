import React from "react";
import { TextField } from "@forge/react";

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
  return (
    <>
      <TextField
        name="name"
        label="Pet name"
        defaultValue={defaultConfig.name}
      />
      <TextField name="age" label="Pet age" defaultValue={defaultConfig.age} />
    </>
  );
};
