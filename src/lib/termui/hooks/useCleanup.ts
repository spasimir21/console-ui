import { getCurrentComponentContext } from '../component/ComponentContext';

const useCleanup = (cleanup: () => void, context = getCurrentComponentContext()) => context.cleanups.push(cleanup);

export { useCleanup };
