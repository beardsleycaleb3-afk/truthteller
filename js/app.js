// app.js — top of the module chain. Builds the shell and wires events.

import { el, qs, clear } from './element.js';
import { parse, toJSON } from './parser.js';
import { renderStream, renderSummary, renderCombined, toggleResults, setOverlay } from './display.js';
import { createEngine } from './engine.js';

function buildShell() {
  return el('div', { class: 'shell' }, [
    el('div', { class: 'titlebar' }, [
      el('span', { class: 'logo' }, 'truthteller'),
      el('span', { class: 'ver' }, 'v018810')
    ]),
    el('div', { class: 'monitor' }, [
      el('div', { class: 'bezel' }, [
        el('canvas', { id: 'screen' }),
        el('div', { class: 'overlay-text', id: 'overlayText' }, 'AWAITING INPUT_'),
        el('div', { class: 'scanglass' })
      ]),
      el('div', { class: 'stand' })
    ]),
    el('div', { class: 'controls' }, [
      el('input', {
        id: 'tokenInput',
        type: 'text',
        placeholder: 'SUSPECT, MOON, JESUS...',
        inputmode: 'text',
        autocomplete: 'off'
      }),
      el('button', { id: 'parseBtn', class: 'btn primary' }, 'PARSE')
    ]),
    el('div', { class: 'controls' }, [
      el('button', { id: 'copyBtn', class: 'btn sec' }, 'COPY'),
      el('button', { id: 'saveBtn', class: 'btn sec' }, 'SAVE')
    ]),
    el('div', { class: 'results', id: 'results' }, [
      el('div', { class: 'section-title' }, 'TOKENS'),
      el('div', { class: 'stream', id: 'stream' }),
      el('div', { class: 'section-title' }, 'SUMMARY'),
      el('div', { class: 'summary', id: 'summary' }),
      el('div', { class: 'section-title' }, 'COMBINED'),
      el('div', { class: 'combined', id: 'combined' })
    ])
  ]);
}

function main() {
  const app = qs('#app');
  clear(app);
  app.appendChild(buildShell());

  const canvas = qs('#screen');
  const engine = createEngine(canvas);
  engine.start();

  const input = qs('#tokenInput');
  const overlayText = qs('#overlayText');
  const results = qs('#results');
  const stream = qs('#stream');
  const summary = qs('#summary');
  const combined = qs('#combined');

  toggleResults(results, false);

  let current = null;

  function doParse() {
    current = parse(input.value);
    if (!current) {
      toggleResults(results, false);
      setOverlay(overlayText, 'AWAITING INPUT_', true);
      return;
    }
    setOverlay(overlayText, '', false);
    toggleResults(results, true);
    renderStream(stream, current.tokens);
    renderSummary(summary, current.summary);
    renderCombined(combined, current.combined);
  }

  qs('#parseBtn').addEventListener('click', doParse);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') doParse();
  });

  qs('#copyBtn').addEventListener('click', () => {
    if (!current) return;
    navigator.clipboard.writeText(toJSON(current)).catch(() => {});
  });

  qs('#saveBtn').addEventListener('click', () => {
    if (!current) return;
    const blob = new Blob([toJSON(current)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = el('a', { href: url, download: 'truthteller-matrix.json' });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) engine.stop();
    else engine.start();
  });
}

main();
