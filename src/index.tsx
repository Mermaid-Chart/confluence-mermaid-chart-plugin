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

const App = () => {
  const config = (useConfig() || {}) as ConfigType
  const [isToken] = useState(async () => {
    return await isTokenExists();
  });
  const [document] = useState(async () => {
    if (!config.documentID || !isToken) return
    return await fetchDocument(config.documentID)
  });
  const getImageBody = async () => {
    if (!document) return
    return await fetchDiagramSVG(document);
  }
  const [imgBody, setImageBody] = useAction(getImageBody, getImageBody)

  if (!isToken) {
    return (
      <SectionMessage title="Security token is required"
                      appearance="warning">
      <Text>To access Mermaid Chart, you need to setup security token in the settings</Text>
      </SectionMessage>
    )
  }

  if (!imgBody) {
    return (
      // <SectionMessage title="You need to select a diagram"
      //                 appearance="warning">
      //   <Text>
      //     Click on pencil icon to select diagram
      //   </Text>
      // </SectionMessage>
      <Fragment>
        <Text>Select an existing diagram or create a new</Text>
        <Text><Link appearance="button" openNewTab href={`https://www.mermaidchart.com/app/diagrams/${config.documentID}?ref=vscode`}>Select diagram</Link></Text>
        <Button text="Create new diagram" onClick={() => setImageBody()} />
    </Fragment>
    )
  }

  return (
    <Fragment>
      <Text><Link openNewTab href={`https://www.mermaidchart.com/app/diagrams/${config.documentID}?ref=vscode`}>Edit diagram</Link></Text>
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

type OptionType = {
  id: string;
  title: string;
}
const Config = () => {
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

  const imageSizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'];

  return (
    <MacroConfig>
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
    </MacroConfig>
  )
}

export const config = render(<Config/>)
