export default function EditorialFooter() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="px-5 md:px-8 py-5 flex items-center justify-between"
      style={{
        borderTop: '1px solid rgba(250,250,248,0.08)',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 10,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'rgba(250,250,248,0.45)',
      }}
    >
      <span>Evan Chang · evanchang818@gmail.com</span>
      <span className="hidden md:inline">Taipei · {year}</span>
    </footer>
  );
}
