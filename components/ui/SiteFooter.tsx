export default function SiteFooter() {
  return (
    <footer
      className="w-full"
      style={{
        borderTop: '1px solid oklch(0.27 0.015 55)',
        background: 'oklch(0.15 0.012 55)',
        padding: '14px 16px 18px',
      }}
    >
      {/* リンク行 */}
      <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 mb-3">
        {[
          { label: '運営会社', href: 'https://www.laiv.jp/' },
          { label: 'プライバシーポリシー', href: 'https://www.laiv.jp/privacy' },
          { label: '利用規約', href: 'https://www.laiv.jp/terms' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-geist-sans), Inter, system-ui',
              fontSize: 11,
              color: 'oklch(0.62 0.02 60)',
              textDecoration: 'none',
              letterSpacing: 0.3,
            }}
            className="hover:underline transition-opacity hover:opacity-80"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* コピーライト */}
      <p
        className="text-center"
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: 10,
          color: 'oklch(0.45 0.01 55)',
          letterSpacing: 0.5,
        }}
      >
        © 2026 LAIV LLC. All rights reserved.
      </p>
    </footer>
  )
}
