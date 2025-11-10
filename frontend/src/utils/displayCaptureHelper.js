// Utility to request display capture (screen sharing) while notifying the
// app via custom events so the screenshot-prevention hook can react.

export async function startDisplayCapture(constraints = { video: true }) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
    throw new Error('Display capture is not supported in this browser.');
  }

  const stream = await navigator.mediaDevices.getDisplayMedia(constraints);

  // Dispatch custom event so the app knows display-capture started
  try {
    window.dispatchEvent(new CustomEvent('display-capture-started', { detail: { stream } }));
  } catch (e) {
    // Older browsers might not support CustomEvent constructor
    const evt = document.createEvent('Event');
    evt.initEvent('display-capture-started', true, true);
    evt.detail = { stream };
    window.dispatchEvent(evt);
  }

  // Listen for tracks ending to notify when capture stops
  const onEnded = () => {
    try {
      window.dispatchEvent(new Event('display-capture-stopped'));
    } catch (e) {
      const evt = document.createEvent('Event');
      evt.initEvent('display-capture-stopped', true, true);
      window.dispatchEvent(evt);
    }
  };

  stream.getTracks().forEach((track) => track.addEventListener('ended', onEnded));

  return stream;
}

export function stopDisplayCapture(stream) {
  if (!stream) return;
  stream.getTracks().forEach((t) => t.stop());
  try {
    window.dispatchEvent(new Event('display-capture-stopped'));
  } catch (e) {
    const evt = document.createEvent('Event');
    evt.initEvent('display-capture-stopped', true, true);
    window.dispatchEvent(evt);
  }
}
