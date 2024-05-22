import { TrackStack } from './TrackStack';

function createReactiveCallback<TArgs extends [...any[]], T>(
  trackable: (...args: TArgs) => any,
  callback: (...args: TArgs) => T
) {
  return (...args: TArgs) => {
    trackable(...args);

    TrackStack.pushTrackPause();
    const result = callback(...args);
    TrackStack.pop();

    return result;
  };
}

export { createReactiveCallback };
