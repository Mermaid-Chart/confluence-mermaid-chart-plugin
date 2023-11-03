// Import required components from the UI kit
import ForgeUI, {
  GlobalSettings,
  render,
  Form,
  Fragment,
  TextField,
  useState,
} from '@forge/ui'
import { storage } from '@forge/api'

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
  })

  return (
    <Fragment>
      <Form onSubmit={async ({baseUrl, token}) => {
        await Promise.all([
          storage.set(BASE_URL_KEY, baseUrl),
          storage.setSecret(TOKEN_KEY, token)])
        setSettings({baseUrl, token})
      }}>
        <TextField name="token" label="Secret token"
                   defaultValue={token || ''}/>
        <TextField name="baseUrl" label="Base URL"
                   defaultValue={baseUrl || 'https://www.mermaidchart.com/'}/>
      </Form>
    </Fragment>
  )
}
export const run = render(
  <GlobalSettings>
    <App/>
  </GlobalSettings>,
)
