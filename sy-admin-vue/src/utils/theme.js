export function applyTheme(theme) {
  const root = document.documentElement;
  const isDark = theme === 'dark';

  root.classList.toggle('dark', isDark);
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = isDark ? 'dark' : 'light';
}
