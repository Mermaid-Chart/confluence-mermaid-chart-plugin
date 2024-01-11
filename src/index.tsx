import ForgeUI, {
  Macro,
  render,
  Text,
  Fragment,
  Image,
  useState,
  Select,
  Option,
  MacroConfig,
  useConfig,
  SectionMessage,
  TextField,
  Link,
  useAction,
  Button,
  Heading,
  ModalDialog,
  Form,
} from '@forge/ui'
import {
  fetchDiagramSVG,
  fetchDocument,
  fetchDocuments,
  fetchProjects,
  isTokenExists,
  MCDocument,
} from './api'
import base64 from 'base-64'
import { ImageProps } from '@forge/ui/out/types/components'

type ConfigType = {
  documentID?: string
  caption?: string
  imageSize?: ImageProps['size']
}

type OptionType = {
  id: string;
  title: string;
}

const App = () => {
  const config = (useConfig() || {}) as ConfigType

  const [isToken] = useState(async () => {
    return await isTokenExists();
  });



  const getImageBody = async () => {
    console.log('getImageBody called:', document);
    if (!document) return
    return await fetchDiagramSVG(document);
  }

  const getDocument = async () => {
    console.log('getDocument called:', diagramDocumentID);
    console.log('getDocument called:', isToken);
    if (!diagramDocumentID || !isToken) return
    return await fetchDocument(diagramDocumentID)
  }

  // Holding digram data. To be removed later on
  const [diagramDocumentID, setDiagramDocumentID] = useState('');
  const [diagramCaption, setDiagramCaption] = useState('');
  const [diagramImageSize, setDiagramImageSize] = useState('medium');
  const [document, setDocument] = useAction(getDocument, getDocument);
  const [imgBody, setImageBody] = useAction(getImageBody, getImageBody)

  // Diagram selection dialog state
  const [isOpen, setOpen] = useState(false);
  const [isNewDiagramOpen, setNewDiagOpen] = useState(false);
  const imageSizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'];

  if (!isToken) {
    return (
      <SectionMessage title="Security token is required"
                      appearance="warning">
      <Text>To access Mermaid Chart, you need to setup security token in the settings</Text>
      </SectionMessage>
    )
  }

  // TODO: Remove to separate file in StorageUtils later on
  const storeDiagram = (documentID: string, caption: string, imageSize: ImageProps['size'])  => {
    console.log('storeDiagram called');
    setDiagramDocumentID(documentID);
    setDiagramCaption(caption);
    setDiagramImageSize(imageSize);
  }

  // TODO: Remove to separate file in StorageUtils later on
  const createNewDiagram = () => {
    console.log('createNewDiagram called');
    return (
      <ModalDialog header="Select Project and Name of new diagram" onClose={() => setOpen(false)}>
      <Form
        onSubmit={data => {
          console.log('Data set from dialog:', data);
          setNewDiagOpen(false);
          config.documentID = data.documentID;
          config.imageSize = data.imageSize;
          storeDiagram(data.documentID, data.caption, data.imageSize);
          setDocument();
          setImageBody();


        }}
      >
      <Select label="Project" name="documentID">
        {projects.map((p) => (
        <Option label={p} value={p}/>
        ))}

      </Select>



      </Form>
    </ModalDialog>
    );

  }

  // TODO: Move to separate file later on
  const selectProjectAndName = () => {
    console.log('selectProjectAndName called');
    return (
      <ModalDialog header="Select Mermaid Chart Diagram" onClose={() => setOpen(false)}>
      <Form
        onSubmit={data => {
          console.log('Data set from dialog:', data);
          setOpen(false);

          config.documentID = data.documentID;
          config.imageSize = data.imageSize;
          storeDiagram(data.documentID, data.caption, data.imageSize);
          setDocument();
          setImageBody();
        }}
      >
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

      </Form>
    </ModalDialog>
    );
  }

  const dummyFunc = () => {
    return (
      <Text>dummy</Text>
    );
  }

  const [options] = useState<OptionType[]>(async () => {
    const isToken = await isTokenExists();
    if (!isToken) return [];
    const projects = await fetchProjects()
    const dp = []
    projects.map((p) => dp.push(fetchDocuments(p.id)))
    const docResult: MCDocument[][] = await Promise.all(dp)
    const result: OptionType[] = []
    projects.map((p, idx) => {
      (docResult[idx] || []).map((doc) => {
        result.push({
          id: doc.documentID,
          title: `${p.title}/${doc.title}`,
        })
      })
    })

    return result
  });

  const [projects] = useState<string[]>(async () => {
    const isToken = await isTokenExists();
    if (!isToken) return [];
    const availableProjects = await fetchProjects();
    console.log('availableProjects:', availableProjects);
    return availableProjects.map((p) => p.title);
  });

  if (!imgBody) {
    return (
      <Fragment>
        <Text>Select an existing diagram or create a new</Text>
        {/* <Text><Link appearance="button" openNewTab href={`https://www.mermaidchart.com/app/diagrams/${config.documentID}?ref=vscode`}>Select diagram</Link></Text> */}
        <Button text="Select diagram" onClick={() => setOpen(true)} />
        <Button text="Create new diagram" onClick={() => setNewDiagOpen(true)} />

        {/* The user selects a diagram from the list of diagrams in the project. */}
        { isOpen && selectProjectAndName()}
        { isNewDiagramOpen && createNewDiagram()}
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Text><Link openNewTab href={`https://www.mermaidchart.com/app/diagrams/${diagramDocumentID}?ref=vscode`}>Edit diagram</Link></Text>
      <Image size={config.imageSize} src={`data:image/svg+xml;base64,${base64.encode(imgBody)}`} alt={document.title}/>
      <Text>{config.caption || ''}</Text>
      <Button text="Update" onClick={() => setImageBody()} />
    </Fragment>
  )
}

export const run = render(
  <Macro
    app={<App/>}
  />,
)


