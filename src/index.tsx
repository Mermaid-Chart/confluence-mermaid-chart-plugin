import ForgeUI, {
  Macro,
  render,
  Text,
  Fragment,
  Image,
  useState, Select, Option, MacroConfig, useConfig, SectionMessage,
} from '@forge/ui'
import {
  buildDiagramUrl,
  fetchDocument,
  fetchDocuments,
  fetchProjects,
  MCDocument,
} from './api'

type ConfigType = {
  documentID?: string
}

const App = () => {
  const config = (useConfig() || {}) as ConfigType;
  const [document] = useState(async () => {
    if (!config.documentID) return;
    return await fetchDocument(config.documentID);
  })
  const [diagramUrls] = useState(async () => {
    return document && await buildDiagramUrl(document);
  })

  if (!diagramUrls) {
    return (
      <SectionMessage title="You need to configure this macro" appearance="warning">
        <Text>
          While editing the page, select the macro, and click on the pencil icon
          to display configuration options.
        </Text>
      </SectionMessage>
    )
  }

  return (
    <Fragment>
      <Text>{document.title}</Text>
      <Image src={diagramUrls.png} alt={document.title} />
    </Fragment>
  );
};

export const run = render(
  <Macro
    app={<App />}
  />
);

type OptionType = {
  id: string;
  title: string;
}
const Config = () => {
  const [options] = useState<OptionType[]>(async () => {
    const projects = await fetchProjects();
    const dp = [];
    projects.map((p) => dp.push(fetchDocuments(p.id)));
    const docResult: MCDocument[][] = await Promise.all(dp);
    const result: OptionType[] = [];
    projects.map((p, idx) => {
      (docResult[idx] || []).map((doc) => {
        result.push({
          id: doc.documentID,
          title: `${p.title}/${doc.title}`
        })
      });
    })

    return result;
  });

  return (
    <MacroConfig>
      <Select label="Diagram" name="documentID">
        {options.map((p) => (
          <Option label={p.title} value={p.id} />
        ))}
      </Select>
    </MacroConfig>
  );
};

export const config = render(<Config />);
