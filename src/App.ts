import { useProvideAccountInfo } from './context/AccountInfo';
import { Component, useScreen, Text } from './lib/termui';
import { useProvideRouter } from './router';
import chalk from 'chalk';

const App = Component((): Component[] => {
  const screen = useScreen();

  useProvideAccountInfo({
    method: '<Missing>',
    username: '<Missing>',
    email: '<Missing>',
    password: '<Missing>'
  });

  const router = useProvideRouter('register');

  return [
    $router.view,
    Text(
      () => JSON.stringify($router.view.data ?? null),
      () => ({
        y: ($screen?.height ?? 1) - 1,
        style: chalk.dim
      })
    )
  ];
});

export { App };
