'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    links.classList.toggle('is-open', !open);
  });

  const form = document.querySelector('#filters');
  const grid = document.querySelector('#anime-results');
  if (form && grid) {
    const search = document.querySelector('#anime-search');
    const genre = document.querySelector('#genre-filter');
    const year = document.querySelector('#year-filter');
    const status = document.querySelector('#status-filter');
    const sort = document.querySelector('#sort-select');
    const count = document.querySelector('#result-count');
    const empty = document.querySelector('#empty-state');
    const cards = Array.from(grid.querySelectorAll('.anime-card'));
    const apply = () => {
      const q = search.value.trim().toLocaleLowerCase('uk');
      let visible = cards.filter(card =>
        card.dataset.title.toLocaleLowerCase('uk').includes(q) &&
        (!genre.value || card.dataset.genre.split(' ').includes(genre.value)) &&
        (!year.value || card.dataset.year === year.value) &&
        (!status.value || card.dataset.status === status.value));
      visible.sort((a,b) => sort.value === 'rating' ? Number(b.dataset.rating)-Number(a.dataset.rating)
        : sort.value === 'newest' ? Number(b.dataset.year)-Number(a.dataset.year)
        : sort.value === 'title' ? a.dataset.title.localeCompare(b.dataset.title,'uk')
        : cards.indexOf(a)-cards.indexOf(b));
      cards.forEach(card => card.hidden = !visible.includes(card));
      visible.forEach(card => grid.insertBefore(card, empty));
      count.textContent = String(visible.length);
      empty.hidden = visible.length !== 0;
    };
    form.addEventListener('submit', e => { e.preventDefault(); apply(); });
    form.addEventListener('reset', () => setTimeout(apply, 0));
    [search,genre,year,status].forEach(el => el.addEventListener('input', apply));
    sort.addEventListener('change', apply);
    const query = new URLSearchParams(location.search).get('q');
    if (query) { search.value = query; apply(); }
  }

  const save = document.querySelector('#save-anime');
  const saveMessage = document.querySelector('#save-message');
  if (save && saveMessage) save.addEventListener('click', () => {
    const saved = save.dataset.saved === 'true';
    save.dataset.saved = String(!saved);
    save.textContent = saved ? '＋ До списку' : '✓ У списку';
    saveMessage.textContent = saved ? 'Аніме прибрано зі списку (демо).' : 'Аніме додано до списку (демо).';
  });

  const commentForm = document.querySelector('#comment-form');
  if (commentForm) commentForm.addEventListener('submit', e => {
    e.preventDefault();
    const input = document.querySelector('#comment-text');
    const list = document.querySelector('#comment-list');
    const message = document.querySelector('#comment-message');
    const value = input.value.trim();
    if (!value) { message.textContent = 'Введи текст коментаря.'; return; }
    const article = document.createElement('article');
    article.className = 'comment';
    const avatar = document.createElement('span');
    avatar.className = 'avatar';
    avatar.textContent = 'Г';
    const body = document.createElement('div');
    const author = document.createElement('b');
    author.textContent = 'Гість';
    const paragraph = document.createElement('p');
    paragraph.textContent = value;
    body.append(author, paragraph);
    article.append(avatar, body);
    list.prepend(article);
    input.value = '';
    message.textContent = 'Коментар додано локально (демо-режим).';
  });
});
