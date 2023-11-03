// Import required components from the UI kit
import ForgeUI, {
  Macro,
  render,
  Text,
  Fragment,
  Image,
  MacroConfig,
  TextField,
  useConfig,
  useState, useEffect,
} from '@forge/ui'
import {MermaidChartAPI} from './mermaidAPI';
import { storage } from '@forge/api'
import { TOKEN_KEY } from './settings'

// ImageCardProps interface which will be used by ImageCard component
interface ImageCardProps {
  title: string;
  src: string;
}

// ImageCard component containing text and image
const ImageCard = ({title, src}: ImageCardProps) => (
  <Fragment>
    <Text>{title}</Text>
    <Image src={src} alt={title}/>
  </Fragment>
);

// App function will return the final output
const App = () => {
  const config = useConfig();

  return (
    <Fragment>
      <Text>Random GIF!</Text>
    </Fragment>
  );
};

export const run = render(
  <Macro
    app={<App />}
  />
);

const Config = () => {
  const [token] = useState(async () => {
    return await storage.getSecret(TOKEN_KEY)
  });
  const [client, setClient] = useState<MermaidChartAPI | undefined>(undefined);

  useEffect(() => {
    if (!token) return;
    setClient(new MermaidChartAPI({
      token,
      // @TODO add baseURL
    }))
  }, [token])

  useEffect(() => {
    if (!client) return;
    client.getProjects();
  }, [client])

  return (
    <MacroConfig>
      {/* Form components */}
      <TextField name="age" label="Pet age" />
    </MacroConfig>
  );
};

export const config = render(<Config />);
