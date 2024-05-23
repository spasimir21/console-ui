import {
  Alignment,
  Component,
  Justify,
  VerticalLayout,
  defineComponentExports,
  useExport,
  useScreen,
  Text
} from '../lib/termui';
import { useAccountInfo } from '../context/AccountInfo';

const AccountPage = Component((): Component => {
  const accountInfo = useAccountInfo();
  const screen = useScreen();

  useExport('data', accountInfo);

  return VerticalLayout(
    () => ({
      width: $screen?.width,
      height: $screen?.height,
      itemsAlign: Alignment.Center,
      justify: Justify.Center,
      gap: 1
    }),
    [
      Text(() => `Method: ${$accountInfo.method}`, {
        xAlign: Alignment.Center
      }),
      Text(() => `Username: ${$accountInfo.username}`, { xAlign: Alignment.Center }),
      Text(() => `Email: ${$accountInfo.email}`, { xAlign: Alignment.Center }),
      Text(() => `Password: ${$accountInfo.password}`, { xAlign: Alignment.Center })
    ]
  );
}, defineComponentExports<{ data: any }>());

export { AccountPage };
