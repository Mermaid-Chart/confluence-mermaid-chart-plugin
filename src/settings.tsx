import ForgeUI, {
  GlobalSettings,
  render,
  Form,
  Fragment,
  TextField,
  useState, Text,
} from '@forge/ui'
import { storage } from '@forge/api'
import { fetchCurrentUser } from './api'

export const BASE_URL_KEY = 'base_url'
export const TOKEN_KEY = 'token'

type StateType = {
  baseUrl: string;
  token: string;
}

const App = () => {
  const [{ baseUrl, token }, setSettings] = useState<StateType>(async () => {
    const [baseUrl, token] = await Promise.all<string>([
      storage.get(BASE_URL_KEY),
      storage.getSecret(TOKEN_KEY),
    ])
    return { baseUrl, token }
  });
  const [tokenError, setTokenError] = useState('');
  const [saved, setSaved] = useState(false);

  const onSubmit = async ({ token, baseUrl }: StateType) => {
    setSettings({baseUrl, token});
    setTokenError('');
    setSaved(false);
    try {
      await fetchCurrentUser(token);
    } catch (e) {
      setTokenError('invalid token')
      return;
    }

    await Promise.all([
      storage.set(BASE_URL_KEY, baseUrl),
      storage.setSecret(TOKEN_KEY, token),
    ])
    setSaved(true);
  }

  return (
    <Fragment>
      <Form onSubmit={onSubmit}>
        <TextField name="token" label="Secret token"
                   defaultValue={token || ''}/>
        {tokenError && <Text>{tokenError}</Text>}
        <TextField name="baseUrl" label="Base URL"
                   defaultValue={baseUrl || 'https://www.mermaidchart.com/'}/>
        {saved && <Text>Saved</Text>}
      </Form>
    </Fragment>
  )
}
export const run = render(
  <GlobalSettings>
    <App/>
  </GlobalSettings>,
)
