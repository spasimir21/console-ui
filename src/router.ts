import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';
import { createRouterHooks } from './lib/termui';
import { LoginPage } from './pages/LoginPage';

const [useProvideRouter, useRouter] = createRouterHooks({
  login: LoginPage,
  register: RegisterPage,
  account: AccountPage
});

export { useProvideRouter, useRouter };
