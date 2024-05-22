import { DependencyDecoration, applyDependencyDecoration } from './dependencyDecoration';
import { ComputedDecoration, applyComputedDecoration } from './computedDecoration';
import { EffectDecoration, applyEffectDecoration } from './effectDecoration';
import { StateDecoration, applyStateDecoration } from './stateDecoration';
import { createHiddenProperty } from '../utils/hiddenProperty';
import { DecorationType } from './decorationType';
import { Constructor } from '../utils/utilTypes';

const $APPLIED_DECORATIONS = Symbol('$APPLIED_DECORATIONS');
const $DECORATIONS = Symbol('$DECORATIONS');

const AppliedDecorations = createHiddenProperty<Set<string>, typeof $APPLIED_DECORATIONS>($APPLIED_DECORATIONS);
const Decorations = createHiddenProperty<Decoration[], typeof $DECORATIONS>($DECORATIONS);

interface BaseDecoration {
  type: DecorationType;
  property: string;
}

type Decoration = StateDecoration | ComputedDecoration<any> | EffectDecoration | DependencyDecoration;

const APPLY_DECORATION_FUNCTIONS = {
  [DecorationType.State]: applyStateDecoration,
  [DecorationType.Computed]: applyComputedDecoration,
  [DecorationType.Effect]: applyEffectDecoration,
  [DecorationType.Dependency]: applyDependencyDecoration
} as const;

function hasDecorationBeenApplied(object: any, decoration: Decoration) {
  const appliedDecorations = AppliedDecorations.getOwn(object);
  if (appliedDecorations == null) return false;
  return appliedDecorations.has(decoration.property);
}

function applyDecoration(target: any, decoration: Decoration, descriptor?: PropertyDescriptor) {
  if (hasDecorationBeenApplied(target, decoration)) return;

  if (AppliedDecorations.hasOwn(target)) AppliedDecorations.get(target)!.add(decoration.property);
  else AppliedDecorations.set(target, new Set([decoration.property]));

  APPLY_DECORATION_FUNCTIONS[decoration.type](target, decoration as any, descriptor);
}

function applyDecorations(target: any, ...decorations: Decoration[]) {
  for (const decoration of decorations) applyDecoration(target, decoration);
}

function addDecoration(_class: Constructor, decoration: Decoration) {
  const prototype = _class.prototype;
  if (Decorations.hasOwn(prototype)) Decorations.get(prototype)!.push(decoration);
  else Decorations.set(prototype, [decoration]);
}

function addDecorations(_class: Constructor, ...decorations: Decoration[]) {
  for (const decoration of decorations) addDecoration(_class, decoration);
}

const getDecorationsFromClass = (_class: Constructor) =>
  Decorations.hasOwn(_class.prototype) ? Decorations.get(_class.prototype)! : [];

const applyDecorationsFromClass = <TObject extends TParent, TParent>(
  object: TObject,
  _class: new (...args: any[]) => TParent
) => applyDecorations(object, ...getDecorationsFromClass(_class));

export {
  applyDecoration,
  applyDecorations,
  addDecoration,
  addDecorations,
  getDecorationsFromClass,
  hasDecorationBeenApplied,
  applyDecorationsFromClass,
  BaseDecoration,
  Decoration
};
