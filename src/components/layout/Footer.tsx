import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(90deg, #000 0%, #006600 50%, #FF0000 100%)',
        color: '#fff',
        borderTop: '4px solid #fff',
        padding: '24px 0 12px 0',
        marginTop: 32,
        textAlign: 'center',
        fontSize: 16,
        letterSpacing: 1,
      }}
      aria-label="Site Footer"
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8 }}>
          KaziConnect
        </div>
        <div style={{ marginBottom: 8 }}>
          Empowering Kenya's workforce &mdash; Inspired by the Kenyan spirit
        </div>
        <div style={{ opacity: 0.8, fontSize: 14 }}>
          &copy; {new Date().getFullYear()} KaziConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
