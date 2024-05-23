import { makeReactive, propertyRef } from './lib/reactivity';
import chalk from 'chalk';
import {
  Component,
  useScreen,
  Input,
  useState,
  SolidBoxDesign,
  SolidBoldBoxDesign,
  Alignment,
  VerticalLayout
} from './lib/termui';

const App = Component((): Component => {
  const screen = useScreen();

  const focused = useState('');

  const formData = makeReactive({
    email: '',
    password: ''
  });

  return VerticalLayout(
    () => ({
      x: 0,
      y: 0,
      width: $screen?.width ?? 0,
      height: $screen?.height ?? 0,
      padding: [0, 0],
      itemsAlign: Alignment.Center
    }),
    [
      Input('email', focused, propertyRef(formData, 'email'), () => ({
        horizontalAlign: Alignment.Center,
        x: 0,
        y: 0,
        width: 50,
        padding: [1, 0],
        placeholder: 'Email',
        boxDesign: SolidBoxDesign,
        focusedBoxDesign: SolidBoldBoxDesign,
        focusedBoxStyle: chalk.yellow,
        placeholderStyle: chalk.dim
      })),
      Input('password', focused, propertyRef(formData, 'password'), {
        x: 0,
        y: 0,
        width: 50,
        padding: [1, 0],
        placeholder: 'Password',
        boxDesign: SolidBoxDesign,
        focusedBoxDesign: SolidBoldBoxDesign,
        focusedBoxStyle: chalk.yellow,
        placeholderStyle: chalk.dim
      })
    ]
  );
});

export { App };
