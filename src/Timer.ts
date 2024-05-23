import { Component, defineComponentExports, useExport, useInterval, useState } from './lib/termui';

const Timer = Component(() => {
  const time = useState(0);

  useInterval(() => $time++, 1000);

  useExport('time', time);
}, defineComponentExports<{ time: number }>());

export { Timer };
