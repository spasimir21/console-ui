import { EffectCallback, EffectNode, EffectOptions } from '../nodes/EffectNode';

const effect = (effectCallback: EffectCallback, options?: EffectOptions) => new EffectNode(effectCallback, options);

export { effect };
