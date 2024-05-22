import { getCurrentComponentContext } from '../component/ComponentContext';
import { LayerRenderer } from '../rendering/LayerRenderer';
import { useCallback } from './useCallback';
import { useCleanup } from './useCleanup';
import { useOnMount } from './useOnMount';

function useLayer(callback: (layer: LayerRenderer) => void, context = getCurrentComponentContext()) {
  callback = useCallback(callback, context);

  useOnMount(screen => {
    const layer = screen.createLayer();
    useCleanup(() => layer.remove(), context);

    callback(layer);
  }, context);
}

export { useLayer };
