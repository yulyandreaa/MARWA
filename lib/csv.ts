const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

/** Excel en español abre mejor el punto y coma; el BOM conserva las tildes. */
export function downloadCsv(name: string, head: string[], rows: (string | number)[][]) {
  const text = [head, ...rows].map(r => r.map(cell).join(';')).join('\r\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob(['﻿', text], {type: 'text/csv;charset=utf-8'}));
  link.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
