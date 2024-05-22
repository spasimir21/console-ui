import { DependencyDecorationOptions, createDependencyDecorationForObject } from './dependencyDecoration';
import { ComputedDecorationOptions, createComputedDecorationForObject } from './computedDecoration';
import { EffectDecorationOptions, createEffectDecorationForObject } from './effectDecoration';
import { StateDecorationOptions, createStateDecorationForObject } from './stateDecoration';
import { Constructor, PropertiesOfType, StringKeyof, ValuesOf } from '../utils/utilTypes';
import { Decoration, addDecorations, applyDecorations } from './decorations';
import { EffectCallback } from '../nodes/EffectNode';
import { keysOf } from '../utils/keysOf';

type DecorationsForObjectOptions<T> = {
  dependency?:
    | StringKeyof<T>[]
    | {
        [TKey in StringKeyof<T>]?: DependencyDecorationOptions;
      };
  state?:
    | StringKeyof<T>[]
    | {
        [TKey in StringKeyof<T>]?: StateDecorationOptions;
      };
  computed?:
    | StringKeyof<T>[]
    | {
        [TKey in StringKeyof<T>]?: ComputedDecorationOptions<T>;
      };
  effect?:
    | PropertiesOfType<T, EffectCallback>[]
    | {
        [TKey in PropertiesOfType<T, EffectCallback>]?: EffectDecorationOptions<T>;
      };
};

function createDecorationsOfTypeFromObject<T>(
  object: T,
  decorationFactory: (object: T, prop: StringKeyof<T>, options?: any) => Decoration,
  decorationOptions: ValuesOf<DecorationsForObjectOptions<T>>
) {
  if (decorationOptions == null) return [];

  if (Array.isArray(decorationOptions)) return decorationOptions.map(property => decorationFactory(object, property));

  return keysOf(decorationOptions).map(property => decorationFactory(object, property, decorationOptions[property]));
}

function createDecorationsForObject<T>(object: T, decorationOptions: DecorationsForObjectOptions<T>): Decoration[] {
  return [
    ...createDecorationsOfTypeFromObject(object, createDependencyDecorationForObject, decorationOptions.dependency),
    ...createDecorationsOfTypeFromObject(object, createStateDecorationForObject, decorationOptions.state),
    ...createDecorationsOfTypeFromObject(object, createComputedDecorationForObject, decorationOptions.computed),
    ...createDecorationsOfTypeFromObject(object, createEffectDecorationForObject as any, decorationOptions.effect)
  ];
}

function createDecorationsForClass<TClass extends Constructor>(
  _class: TClass,
  decorationOptions: DecorationsForObjectOptions<InstanceType<TClass>>
) {
  return createDecorationsForObject(_class.prototype, decorationOptions);
}

function applyDecorationsToObject<T>(object: T, decorationOptions: DecorationsForObjectOptions<T>) {
  applyDecorations(object, ...createDecorationsForObject(object, decorationOptions));
}

function addDecorationsToClass<TClass extends Constructor>(
  _class: TClass,
  decorationOptions: DecorationsForObjectOptions<InstanceType<TClass>>
) {
  addDecorations(_class, ...createDecorationsForClass(_class, decorationOptions));
}

export { createDecorationsForObject, applyDecorationsToObject, addDecorationsToClass };
