import React from 'react'
import CollegeDecisionApp from './components/CollegeDecisionApp'

function App() {
  return (
    <>
      <CollegeDecisionApp />
      <footer style={{ marginTop: 48, padding: '24px 16px', borderTop: '1px solid #E3E0D8', textAlign: 'center', fontSize: 13, color: '#5C6B7A' }}>
        <a href="/blog/index.html" style={{ color: '#1E3A5F', margin: '0 10px' }}>Blog</a>
        <a href="/guides/index.html" style={{ color: '#1E3A5F', margin: '0 10px' }}>College Guides</a>
        <a href="/about.html" style={{ color: '#1E3A5F', margin: '0 10px' }}>About</a>
        <a href="/contact.html" style={{ color: '#1E3A5F', margin: '0 10px' }}>Contact</a>
        <a href="/privacy.html" style={{ color: '#1E3A5F', margin: '0 10px' }}>Privacy Policy</a>
        <div style={{ marginTop: 8 }}>© 2026 College Fit Finder · searchcolleges.ai</div>
      </footer>
    </>
  )
}

export default App