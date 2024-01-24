import ForgeUI, {
  render,
  Fragment,
  Form,
  TextField,
  Select,
  Option,
  useConfig,
  useState,
  Button,
  ModalDialog,
  MacroConfig,
} from "@forge/ui";

const Macro = () => {
  const [isOpen, setOpen] = useState(false);
  // const context = useProductContext();
  console.log("Macro is called");
  return (
    <Fragment>
      <TextField name="textField" label="Text Field" defaultValue="larsa" />
    </Fragment>
    // <Fragment>
    //   <Button text="Configure" onClick={() => setOpen(true)} />
    //   {isOpen && (
    //     <ModalDialog header="Configuration" onClose={() => setOpen(false)}>
    //       <ConfigForm />
    //     </ModalDialog>
    //   )}
    // </Fragment>
  );
};

export const config = render(<Macro />);

const ConfigForm = () => {
  const [config, setConfig] = useConfig() || {};

  const onSubmit = async (formData) => {
    setConfig(formData);
    // Additional logic if needed
  };

  console.log("ConfigForm is called");

  return (
    <Form onSubmit={onSubmit}>
      <TextField name="textField" label="Text Field" defaultValue="larsa" />
      {/* <TextField
        name="textField"
        label="Text Field"
        defaultValue={config.textField}
      />
      <Select
        name="selectField"
        label="Select Field"
        defaultValue={config.selectField}
      >
        <Option label="Option 1" value="option1" />
        <Option label="Option 2" value="option2" />
      </Select> */}
    </Form>
  );
};

export const configForm = render(<ConfigForm />);
