export function playNotificationSound() {
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClass) return;

  const ctx = new AudioContextClass();
  const freq = 1200;
  const decay = 0.08;
  const gap = 0.15;
  const count = 3;

  for (let i = 0; i < count; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = freq;
    osc.type = "sine";

    const t = ctx.currentTime + i * gap;
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + decay);

    osc.start(t);
    osc.stop(t + decay + 0.01);
  }

  setTimeout(() => ctx.close(), (count * gap + decay + 0.1) * 1000);
}
