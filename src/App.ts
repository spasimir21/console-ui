import { Component, Div, Text, useClickHandler, useKeypressHandler, useState } from './lib/termui';
import chalk from 'chalk';

const App = Component((): Component => {
  const text = useState('');

  useKeypressHandler(keypress => {
    if (keypress.name === 'backspace') {
      $text = $text.slice(0, -1);
      return;
    }

    $text += keypress.sequence;
  });

  useClickHandler(info => {
    $text += JSON.stringify(info);
  });

  return Div(
    Text(() => ({
      x: 5,
      y: $text.length,
      text: 'Lorem Ipsum '.repeat(16),
      style: $text.length % 2 == 0 ? chalk.bgBlue.red : chalk.bgGreen.blue
    })),
    Text(() => ({
      x: 5 + $text.length,
      y: $text.length,
      text: $text,
      style: $text.length % 2 == 0 ? chalk.green : chalk.yellow
    }))
  );
});

export { App };
