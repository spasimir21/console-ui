import { applyDecorationsToObject, createReactiveCallback } from '../reactivity';
import { getCurrentComponentContext } from './component/ComponentContext';
import { DynamicComponent } from './component/DynamicComponent';
import { createContextValue } from './hooks/useContextValue';
import { ShellComponent } from './component/ShellComponent';
import { Component } from './component/Component';
import { useEffect } from './hooks/useEffect';
import { useScreen } from './hooks/useScreen';
import { useState } from './hooks/useState';
import { Stack } from './utils/Stack';

interface Route<TConfig extends { [route: string]: () => Component }> {
  name: keyof TConfig;
}

interface Router<TConfig extends { [route: string]: () => Component }> {
  config: TConfig;
  route: Route<TConfig>;
  history: Stack<Route<TConfig>>;
  view: ReturnType<TConfig[keyof TConfig]>;
  goto(name: keyof TConfig): void;
  goBack(): void;
}

const RouterView = ShellComponent(
  <TConfig extends { [route: string]: () => Component }>(
    router: Router<TConfig>
  ): ReturnType<TConfig[keyof TConfig]> => {
    const screen = useScreen();

    const page = useState<Component>({} as any);

    useEffect(
      createReactiveCallback(
        () => [$screen, router.route],
        () => {
          if ($screen == null) return;

          const newPage = (router.config[router.route.name] as any)() as Component;
          $page = newPage;

          newPage.mount($screen!);

          return () => newPage.cleanup();
        }
      )
    );

    return DynamicComponent(page) as any;
  }
);

function createRouterHooks<TConfig extends { [route: string]: () => Component }>(config: TConfig) {
  const [useProvideRouter, useRouter] = createContextValue<Router<TConfig>>();

  return [
    (initialRouteName: keyof TConfig, context = getCurrentComponentContext()) => {
      const router: Router<TConfig> = {
        config,
        route: { name: initialRouteName },
        history: new Stack(),
        view: null as any,
        goto(name) {
          this.history.push(this.route);
          this.route = { name };
        },
        goBack() {
          const prevRoute = this.history.pop();
          if (prevRoute == null) return;
          this.route = prevRoute;
        }
      };

      applyDecorationsToObject(router, {
        state: ['route']
      });

      const routerNode = useProvideRouter(router, context);

      router.view = RouterView(router) as any;

      return routerNode;
    },
    useRouter
  ] as const;
}

export { Router, createRouterHooks };
