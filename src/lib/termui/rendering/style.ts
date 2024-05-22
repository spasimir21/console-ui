import { createIndexedSet } from '../utils/IndexedSet';
import chalk, { Chalk } from 'chalk';

interface Style {
  open: string;
  close: string;
}

const createStyle = (chalkStyle: Chalk): Style => ({
  // @ts-ignore
  open: chalkStyle._styler.openAll,
  // @ts-ignore
  close: chalkStyle._styler.closeAll
});

const RESET_STYLE = createStyle(chalk.reset);

function createStyleSet() {
  const styles = createIndexedSet<Style, string>(style => style.open);
  styles.add(RESET_STYLE);
  return styles;
}

export { createStyleSet, createStyle, RESET_STYLE, Style };
