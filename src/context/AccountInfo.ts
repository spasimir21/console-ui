import { createContextValue } from '../lib/termui';

interface AccountInfo {
  method: string;
  username: string;
  email: string;
  password: string;
}

const [useProvideAccountInfo, useAccountInfo] = createContextValue<AccountInfo>();

export { useProvideAccountInfo, useAccountInfo, AccountInfo };
