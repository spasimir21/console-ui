interface Scheduler<T> {
  schedule: (callback: () => void) => T;
  cancel: (id: T) => void;
}

const instantTimeoutScheduler: Scheduler<number> = {
  schedule: callback => setTimeout(callback, 0) as any,
  cancel: id => clearTimeout(id)
};

export { instantTimeoutScheduler, Scheduler };
