/**
 * Animate UI's animated controls (Tabs, ToggleGroup…) copy the computed background of the
 * active item onto a surface, and only read it again when an attribute of the group changes.
 * Switching the theme only changes the class of <html>, so the surface kept the old color.
 *
 * Whenever the theme class changes, touch the class of every animated group: Animate UI's own
 * MutationObserver then reads the colors again, before the theme transition snapshot is taken.
 */
export default defineNuxtPlugin(() => {
  const root = document.documentElement;
  let dark = root.classList.contains('dark');

  new MutationObserver(() => {
    const now = root.classList.contains('dark');

    if (now === dark) {
      return;
    }
    dark = now;

    for (const group of document.querySelectorAll<HTMLElement>('[data-animate-ui-surfaces]')) {
      group.classList.toggle('theme-refresh');
    }
  }).observe(root, { attributes: true, attributeFilter: ['class'] });
});
