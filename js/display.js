// display.js — turns parsed results into DOM. Depends on element.js.

import { el, clear } from './element.js';

export function renderTokenCard(token, index) {
  return el('div', { class: 'card' + (token.isFinalForm ? ' sof' : '') }, [
    el('div', { class: 'glyph' }, token.letter),
    el('div', { class: 'det' }, [
      el('div', {}, [el('strong', {}, `${index + 1}. `), token.title]),
      el('div', { class: 'desc' }, token.detail),
      el('div', { class: 'sub' }, token.raw)
    ])
  ]);
}

export function renderStream(container, tokens) {
  clear(container);
  tokens.forEach((t, i) => container.appendChild(renderTokenCard(t, i)));
}

export function renderSummary(container, summary) {
  clear(container);
  if (!summary) {
    container.appendChild(el('span', { class: 'muted' }, 'NO DATA_'));
    return;
  }
  container.appendChild(el('div', {}, `TOKENS ${summary.total}  VOWEL ${summary.vowels}  CONS ${summary.consonants}  FINAL ${summary.finals}`));
  container.appendChild(el('div', { class: 'seq' }, summary.sequence || '\u2014'));
}

export function renderCombined(container, combined) {
  clear(container);
  container.appendChild(el('span', {}, combined || ''));
}

export function toggleResults(box, show) {
  box.style.display = show ? 'flex' : 'none';
}

export function setOverlay(node, text, show) {
  node.textContent = text;
  node.style.display = show ? 'flex' : 'none';
}
