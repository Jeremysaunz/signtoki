document.querySelector('#guideLanguage')?.addEventListener('change', event => {
  const destination = event.target.value;
  try { localStorage.setItem('signtoki-lang', new URL(destination, location.href).pathname.split('/')[2]); } catch {}
  location.assign(destination);
});
document.querySelectorAll('.guide-check').forEach(check => {
  const button = check.querySelector('[data-check]');
  button.hidden = false;
  button.disabled = true;
  check.querySelectorAll('input').forEach(input => input.addEventListener('change', () => {
    button.disabled = false;
    check.querySelector('.check-feedback').textContent = '';
    check.removeAttribute('data-result');
  }));
  button.addEventListener('click', () => {
    const selected = check.querySelector('input:checked');
    if (!selected) return;
    const correct = selected.value === check.dataset.correct;
    check.dataset.result = correct ? 'correct' : 'retry';
    check.querySelector('.check-feedback').textContent = correct ? check.dataset.success : check.dataset.retry;
    check.querySelector('details').open = true;
  });
});
document.querySelectorAll('[data-speak]').forEach(button => {
  button.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) {
      button.disabled = true;
      return;
    }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(button.dataset.speak);
    utterance.lang = 'ko-KR'; utterance.rate = .8;
    const voice = speechSynthesis.getVoices().find(v => v.lang.startsWith('ko'));
    if (voice) utterance.voice = voice;
    speechSynthesis.speak(utterance);
  });
});
