import chalk from 'chalk';
import {
  Component,
  Text,
  defineComponentsExports,
  useExport,
  useInterval,
  useState
} from './lib/termui';

const Timer = Component(() => {
  const time = useState(0);

  useInterval(() => $time++, 1000);

  useExport('time', time);
}, defineComponentsExports<{ time: number }>());

const App = Component((): Component[] => {
  const timer = Timer();

  return [
    timer,
    Text(() => ({
      x: 1,
      y: 5,
      text: timer.time.toString(),
      style: chalk.red
    }))
  ];
});

export { App };
