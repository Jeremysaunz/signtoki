document.querySelector('#guideLanguage').addEventListener('change', event => {
  const destination = event.target.value;
  try { localStorage.setItem('signtoki-lang', new URL(destination, location.href).pathname.split('/')[2]); } catch {}
  location.assign(destination);
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
