import { makeReactive, propertyRef } from '../lib/reactivity';
import chalk from 'chalk';
import {
  Component,
  useScreen,
  Input,
  SolidBoxDesign,
  SolidBoldBoxDesign,
  Alignment,
  VerticalLayout,
  Text,
  Justify,
  Button,
  BlockBoxDesign,
  FocusManager,
  CursorManager,
  InvisibleBoxDesign,
  defineComponentExports,
  useExport
} from '../lib/termui';
import { useRouter } from '../router';
import { useAccountInfo } from '../context/AccountInfo';

const RegisterPage = Component((): Component[] => {
  const accountInfo = useAccountInfo();
  const router = useRouter();

  const screen = useScreen();

  const formData = makeReactive({
    username: '',
    email: '',
    password: ''
  });

  useExport('data', formData);

  const focusManager = FocusManager(['username', 'email', 'password', 'login', 'register'], 'down', 'up');
  const cursorManager = CursorManager();

  const formLayout = VerticalLayout(
    {
      xAlign: Alignment.Center,
      gap: 1
    },
    [
      Input('username', focusManager.focused, cursorManager, propertyRef(formData, 'username'), {
        width: 50,
        padX: 1,
        placeholder: 'Username',
        boxDesign: SolidBoxDesign,
        focusedBoxDesign: SolidBoldBoxDesign,
        focusedBoxStyle: chalk.yellow,
        placeholderStyle: chalk.dim
      }),
      Input('email', focusManager.focused, cursorManager, propertyRef(formData, 'email'), {
        width: 50,
        padX: 1,
        placeholder: 'Email',
        boxDesign: SolidBoxDesign,
        focusedBoxDesign: SolidBoldBoxDesign,
        focusedBoxStyle: chalk.yellow,
        placeholderStyle: chalk.dim
      }),
      Input('password', focusManager.focused, cursorManager, propertyRef(formData, 'password'), {
        width: 50,
        charMask: '*',
        padX: 1,
        placeholder: 'Password',
        boxDesign: SolidBoxDesign,
        focusedBoxDesign: SolidBoldBoxDesign,
        focusedBoxStyle: chalk.yellow,
        placeholderStyle: chalk.dim
      })
    ]
  );

  return [
    focusManager,
    cursorManager,
    VerticalLayout(
      () => ({
        width: $screen?.width,
        height: $screen?.height,
        itemsAlign: Alignment.Center,
        justify: Justify.SpaceBetween,
        padY: 1
      }),
      [
        Text('TermUI Register', {
          xAlign: Alignment.Center
        }),
        formLayout,
        Button('login', focusManager.focused, 'Already have an account?', () => $router.goto('login'), {
          xAlign: Alignment.Center,
          boxDesign: InvisibleBoxDesign,
          textStyle: chalk.underline,
          focusedTextStyle: chalk.italic.underline.yellow
        }),
        Button(
          'register',
          focusManager.focused,
          'Register',
          () => {
            $accountInfo.method = 'Register';
            $accountInfo.username = formData.username;
            $accountInfo.email = formData.email;
            $accountInfo.password = formData.password;

            $router.goto('account');
          },
          {
            boxDesign: BlockBoxDesign,
            xAlign: Alignment.Center,
            padY: 1,
            padX: 5,
            focusedBoxStyle: chalk.yellow,
            textStyle: chalk.inverse,
            focusedTextStyle: chalk.yellow.inverse
          }
        )
      ]
    )
  ];
}, defineComponentExports<{ data: any }>());

export { RegisterPage };
