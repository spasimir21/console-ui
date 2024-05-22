import { DecorationType } from './decorationType';
import { StringKeyof } from '../utils/utilTypes';
import { addDependency } from '../dependencies';
import { BaseDecoration } from './decorations';

interface DependencyDecoration extends BaseDecoration {
  type: DecorationType.Dependency;
}

const createDependencyDecoration = (property: string): DependencyDecoration => ({
  type: DecorationType.Dependency,
  property
});

interface DependencyDecorationOptions {}

const createDependencyDecorationForObject = <TObject>(
  object: TObject,
  property: StringKeyof<TObject>,
  options?: DependencyDecorationOptions
) => createDependencyDecoration(property);

function applyDependencyDecoration(target: any, decoration: DependencyDecoration) {
  addDependency(target, target[decoration.property]);
}

export {
  createDependencyDecoration,
  createDependencyDecorationForObject,
  applyDependencyDecoration,
  DependencyDecoration,
  DependencyDecorationOptions
};
