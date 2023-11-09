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

export const TOKEN_KEY = 'token'

type StateType = {
  token: string;
}

const App = () => {
  const [{  token }, setSettings] = useState<StateType>(async () => {
    const token = await storage.getSecret(TOKEN_KEY);
    return { token }
  });
  const [tokenError, setTokenError] = useState('');
  const [saved, setSaved] = useState(false);

  const onSubmit = async ({ token }: StateType) => {
    setSettings({token});
    setTokenError('');
    setSaved(false);
    try {
      await fetchCurrentUser(token);
    } catch (e) {
      setTokenError('invalid token')
      return;
    }

    await storage.setSecret(TOKEN_KEY, token)
    setSaved(true);
  }

  return (
    <Fragment>
      <Form onSubmit={onSubmit}>
        <TextField name="token" label="Secret token"
                   defaultValue={token || ''}/>
        {tokenError && <Text>{tokenError}</Text>}
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
