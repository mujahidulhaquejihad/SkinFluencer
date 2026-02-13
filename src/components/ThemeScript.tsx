export function ThemeScript() {
  const script = `
    (function() {
      try {
        var stored = localStorage.getItem('skinfluencer-theme');
        if (stored === 'dark' || stored === 'light') {
          document.documentElement.classList.toggle('dark', stored === 'dark');
          return;
        }
        var prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefers);
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
