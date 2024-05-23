import { getCurrentComponentContext } from './component/ComponentContext';
import { DynamicComponent } from './component/DynamicComponent';
import { createContextValue } from './hooks/useContextValue';
import { ShellComponent } from './component/ShellComponent';
import { Component } from './component/Component';
import { useEffect } from './hooks/useEffect';
import { useScreen } from './hooks/useScreen';
import { makeReactive } from '../reactivity';
import { useState } from './hooks/useState';

interface Router<TConfig extends { [route: string]: () => Component }> {
  config: TConfig;
  route: keyof TConfig;
  view: ReturnType<TConfig[keyof TConfig]>;
}

const RouterView = ShellComponent(
  <TConfig extends { [route: string]: () => Component }>(
    router: Router<TConfig>
  ): ReturnType<TConfig[keyof TConfig]> => {
    const screen = useScreen();

    const page = useState<Component>({} as any);

    useEffect(() => {
      if ($screen == null) return;

      const newPage = (router.config[router.route] as any)() as Component;
      $page = newPage;

      newPage.mount($screen!);

      return () => newPage.cleanup();
    });

    return DynamicComponent(page) as any;
  }
);

function createRouterHooks<TConfig extends { [route: string]: () => Component }>(config: TConfig) {
  const [useProvideRouter, useRouter] = createContextValue<Router<TConfig>>();

  return [
    (initialRoute: keyof TConfig, context = getCurrentComponentContext()) => {
      const router: Router<TConfig> = makeReactive(
        {
          config,
          route: initialRoute,
          view: null as any
        },
        1
      );

      const routerNode = useProvideRouter(router, context);

      router.view = RouterView(router) as any;

      return routerNode;
    },
    useRouter
  ] as const;
}

export { Router, createRouterHooks };
