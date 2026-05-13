import React, { useState, useEffect } from 'react'

// ─── COLLEGE IMAGE ────────────────────────────────────────────
const CollegeImage = ({ name }) => {
  const [imgUrl, setImgUrl] = useState(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(name)}&prop=pageimages&format=json&pithumbsize=400&origin=*`)
        const data = await res.json()
        const page = Object.values(data.query.pages)[0]
        if (page.thumbnail) setImgUrl(page.thumbnail.source)
        else setFailed(true)
      } catch { setFailed(true) }
    }
    fetchImage()
  }, [name])
  const googleUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(name + ' campus')}`
  if (imgUrl) return (
    <a href={googleUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%' }}>
      <img src={imgUrl} alt={name} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} onError={() => { setImgUrl(null); setFailed(true) }} />
    </a>
  )
  return (
    <a href={googleUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '120px', textDecoration: 'none', gap: '6px', background: '#EDF1FA' }}>
      <span style={{ fontSize: '28px' }}>🎓</span>
      <span style={{ color: '#E8650A', fontWeight: 'bold', fontSize: '12px', textAlign: 'center', padding: '0 10px' }}>{failed ? 'View Campus Photos' : 'Loading...'}</span>
      {failed && <span style={{ color: '#5C7A9F', fontSize: '10px' }}>Opens Google Images</span>}
    </a>
  )
}

// ─── PILL MULTI-SELECT (mobile-friendly toggle buttons) ───────
const PillSelect = ({ label, valueKey, options, values, onChange }) => {
  const selected = values[valueKey] || []
  const toggle = (opt) => {
    if (opt === 'Any') { onChange(valueKey, []); return }
    const next = selected.includes(opt) ? selected.filter(o => o !== opt) : [...selected, opt]
    onChange(valueKey, next)
  }
  const isActive = (opt) => opt === 'Any' ? selected.length === 0 : selected.includes(opt)
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ fontWeight: 'bold', color: '#1E3A5F', fontSize: '13px', display: 'block', marginBottom: '10px' }}>{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {['Any', ...options].map(opt => (
          <button key={opt} onClick={() => toggle(opt)} style={{
            padding: '8px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: isActive(opt) ? 'bold' : 'normal',
            background: isActive(opt) ? '#1E3A5F' : 'white',
            color: isActive(opt) ? 'white' : '#1E3A5F',
            border: `2px solid ${isActive(opt) ? '#1E3A5F' : '#C8D6EC'}`,
            cursor: 'pointer', transition: 'all 0.15s'
          }}>{opt}</button>
        ))}
      </div>
    </div>
  )
}

// ─── TOGGLE CHIP (for boolean params like beach access) ───────
const ToggleChip = ({ label, emoji, valueKey, values, onChange }) => {
  const active = values[valueKey]
  return (
    <button onClick={() => onChange(valueKey, !active)} style={{
      padding: '10px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: active ? 'bold' : 'normal',
      background: active ? '#E8650A' : 'white', color: active ? 'white' : '#1E3A5F',
      border: `2px solid ${active ? '#E8650A' : '#C8D6EC'}`, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s'
    }}><span>{emoji}</span>{label}</button>
  )
}

// ─── MIN/MAX INPUT ────────────────────────────────────────────
const MinMaxInput = ({ label, minKey, maxKey, prefix = '', suffix = '', placeholder_min, placeholder_max, values, onChange }) => {
  const handleChange = (key, raw) => {
    const stripped = raw.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '')
    onChange(key, stripped === '' ? 0 : parseInt(stripped))
  }
  const display = (v) => (v === 0 || v === '') ? '' : String(v)
  return (
  <div style={{ marginBottom: '24px' }}>
    <label style={{ fontWeight: 'bold', color: '#1E3A5F', fontSize: '13px', display: 'block', marginBottom: '10px' }}>{label}</label>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '8px' }}>
      <div style={{ background: 'white', border: '2px solid #C8D6EC', borderRadius: '8px', padding: '10px 12px' }}>
        <p style={{ fontSize: '10px', color: '#5C7A9F', margin: '0 0 4px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Min</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {prefix && <span style={{ color: '#5C7A9F', fontSize: '14px' }}>{prefix}</span>}
          <input type="text" inputMode="numeric" pattern="[0-9]*"
            value={display(values[minKey])} onChange={e => handleChange(minKey, e.target.value)}
            placeholder={placeholder_min || 'Any'}
            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '15px', fontWeight: 'bold', color: '#1E3A5F', background: 'transparent', fontFamily: 'inherit' }} />
          {suffix && <span style={{ color: '#5C7A9F', fontSize: '13px', whiteSpace: 'nowrap' }}>{suffix}</span>}
        </div>
      </div>
      <span style={{ color: '#9BB0C8', fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>—</span>
      <div style={{ background: 'white', border: '2px solid #C8D6EC', borderRadius: '8px', padding: '10px 12px' }}>
        <p style={{ fontSize: '10px', color: '#5C7A9F', margin: '0 0 4px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Max</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {prefix && <span style={{ color: '#5C7A9F', fontSize: '14px' }}>{prefix}</span>}
          <input type="text" inputMode="numeric" pattern="[0-9]*"
            value={display(values[maxKey])} onChange={e => handleChange(maxKey, e.target.value)}
            placeholder={placeholder_max || 'Any'}
            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '15px', fontWeight: 'bold', color: '#1E3A5F', background: 'transparent', fontFamily: 'inherit' }} />
          {suffix && <span style={{ color: '#5C7A9F', fontSize: '13px', whiteSpace: 'nowrap' }}>{suffix}</span>}
        </div>
      </div>
    </div>
  </div>
  )
}

// ─── TEXT INPUT ───────────────────────────────────────────────
const TextInput = ({ label, valueKey, placeholder, values, onChange }) => (
  <div style={{ marginBottom: '20px' }}>
    <label style={{ fontWeight: 'bold', color: '#1E3A5F', fontSize: '13px', display: 'block', marginBottom: '8px' }}>{label}</label>
    <input type="text" value={values[valueKey]} onChange={e => onChange(valueKey, e.target.value)}
      placeholder={placeholder}
      style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '2px solid #C8D6EC', boxSizing: 'border-box', color: '#1E3A5F', fontSize: '14px', outline: 'none' }} />
  </div>
)

// ─── IMPORTANCE SELECTOR ─────────────────────────────────────
const ImportanceSelector = ({ paramKey, importance, onChange }) => {
  const levels = [
    { value: 'Must Have', emoji: '🔴', color: '#C62828' },
    { value: 'Nice to Have', emoji: '🟡', color: '#F5A623' },
    { value: 'Not Important', emoji: '⚪', color: '#9BB0C8' },
  ]
  const current = importance[paramKey] || 'Nice to Have'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', marginBottom: '4px' }}>
      <span style={{ fontSize: '11px', color: '#5C7A9F', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>Importance:</span>
      <div style={{ display: 'flex', gap: '4px' }}>
        {levels.map(l => (
          <button key={l.value} onClick={() => onChange(paramKey, l.value)} style={{
            padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: current === l.value ? 'bold' : 'normal',
            background: current === l.value ? l.color : 'white',
            color: current === l.value ? 'white' : '#5C7A9F',
            border: `1.5px solid ${current === l.value ? l.color : '#C8D6EC'}`,
            cursor: 'pointer', whiteSpace: 'nowrap'
          }}>{l.emoji} {l.value}</button>
        ))}
      </div>
    </div>
  )
}

// ─── SECTION HEADER ───────────────────────────────────────────
const SectionHeader = ({ emoji, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '24px 0 16px', borderBottom: '2px solid #E8650A', paddingBottom: '8px' }}>
    <span style={{ fontSize: '18px' }}>{emoji}</span>
    <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E3A5F', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h3>
  </div>
)

// ─── MAIN APP ─────────────────────────────────────────────────
const CollegeDecisionApp = () => {
  const [view, setView] = useState('search')
  const [savedColleges, setSavedColleges] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [homeLocation, setHomeLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [zipInput, setZipInput] = useState('')
  const [nameSearch, setNameSearch] = useState('')

  const [p, setP] = useState({
    // costs
    netAnnualCostMin: 0, netAnnualCostMax: 80000,
    totalCostMin: 0, totalCostMax: 300000,
    // location
    distanceMin: 0, distanceMax: 3000,
    settingTypes: [],
    weatherTypes: [],
    beachAccess: false, mountainAccess: false, lakeAccess: false,
    // campus life
    campusSizeMin: 0, campusSizeMax: 50000,
    avgClassSizeMin: 5, avgClassSizeMax: 500,
    carOnCampus: [],
    recreationCenter: false,
    sportsLevels: [], spiritLevels: [], greekLifeLevels: [],
    // student body
    lgbtqInclusive: [],
    // academics
    majorNeeded: '', minorNeeded: '',
    businessProgram: false, artsProgram: false,
    internshipAccess: false, careerOutcomes: false,
    // selectivity
    acceptanceRateMin: 0, acceptanceRateMax: 100,
  })

  const handleP = (key, value) => setP(prev => ({ ...prev, [key]: value }))

  const [importance, setImportance] = useState({})
  const handleImportance = (key, level) => setImportance(prev => ({ ...prev, [key]: level }))

  const handleZipCodeSubmit = (zip) => {
    if (zip.trim()) setHomeLocation({ zip: zip.trim() })
  }

  const buildSearchCriteriaSummary = () => {
    const tags = []
    const badge = (key) => {
      const v = importance[key] || 'Nice to Have'
      if (v === 'Must Have') return ' 🔴'
      if (v === 'Not Important') return ' ⚪'
      return ' 🟡'
    }
    if (p.netAnnualCostMax < 80000) tags.push(`💰 Cost $${p.netAnnualCostMin.toLocaleString()}–$${p.netAnnualCostMax.toLocaleString()}/yr${badge('cost')}`)
    if (p.totalCostMax < 300000) tags.push(`💰 4-yr $${p.totalCostMin.toLocaleString()}–$${p.totalCostMax.toLocaleString()}${badge('totalCost')}`)
    if (homeLocation) tags.push(`📍 ${p.distanceMin}–${p.distanceMax} mi of ${homeLocation.zip}${badge('distance')}`)
    if (p.settingTypes.length) tags.push(`🏙️ ${p.settingTypes.join(', ')}${badge('setting')}`)
    if (p.weatherTypes.length) tags.push(`🌤️ ${p.weatherTypes.join(', ')}${badge('weather')}`)
    if (p.beachAccess) tags.push(`🏖️ Beach access${badge('outdoorAccess')}`)
    if (p.mountainAccess) tags.push(`⛷️ Mountains${badge('outdoorAccess')}`)
    if (p.lakeAccess) tags.push(`🏞️ Lake/water${badge('outdoorAccess')}`)
    if (p.campusSizeMax < 50000) tags.push(`🏫 ${p.campusSizeMin.toLocaleString()}–${p.campusSizeMax.toLocaleString()} students${badge('campusSize')}`)
    if (p.avgClassSizeMax < 500) tags.push(`📖 Class size ${p.avgClassSizeMin}–${p.avgClassSizeMax}${badge('classSize')}`)
    if (p.recreationCenter) tags.push(`🏊 Rec center${badge('recreationCenter')}`)
    if (p.sportsLevels.length) tags.push(`🏈 Sports: ${p.sportsLevels.join('/')}${badge('sports')}`)
    if (p.greekLifeLevels.length) tags.push(`🏛️ Greek: ${p.greekLifeLevels.join('/')}${badge('greek')}`)
    if (p.lgbtqInclusive.length) tags.push(`🏳️‍🌈 LGBTQ+${badge('lgbtq')}`)
    if (p.majorNeeded) tags.push(`📚 Major: ${p.majorNeeded}${badge('major')}`)
    if (p.minorNeeded) tags.push(`📝 Minor: ${p.minorNeeded}${badge('minor')}`)
    if (p.businessProgram) tags.push(`💼 Business${badge('programPriorities')}`)
    if (p.artsProgram) tags.push(`🎨 Arts${badge('programPriorities')}`)
    if (p.internshipAccess) tags.push(`🤝 Internships${badge('programPriorities')}`)
    if (p.careerOutcomes) tags.push(`🚀 Careers${badge('programPriorities')}`)
    if (p.acceptanceRateMax < 100) tags.push(`🎯 ${p.acceptanceRateMin}–${p.acceptanceRateMax}% acceptance${badge('selectivity')}`)
    return tags
  }

  const buildSearchPrompt = (count = 15, excludeNames = []) => {
    const criteria = []
    const w = (key) => {
      const v = importance[key] || 'Nice to Have'
      if (v === 'Must Have') return ' — THIS IS A MUST HAVE, do not include colleges that don\'t meet this'
      if (v === 'Not Important') return ' — low priority, nice if available'
      return ' — preferred'
    }
    if (p.netAnnualCostMax < 80000) criteria.push(`Annual net cost between $${p.netAnnualCostMin.toLocaleString()} and $${p.netAnnualCostMax.toLocaleString()}${w('cost')}`)
    if (p.totalCostMax < 300000) criteria.push(`Total 4-year cost between $${p.totalCostMin.toLocaleString()} and $${p.totalCostMax.toLocaleString()}${w('totalCost')}`)
    if (homeLocation) criteria.push(`Between ${p.distanceMin} and ${p.distanceMax} miles from zip code ${homeLocation.zip}${w('distance')}`)
    if (p.settingTypes.length) criteria.push(`Setting preference: ${p.settingTypes.join(' or ')}${w('setting')}`)
    if (p.weatherTypes.length) criteria.push(`Climate preference: ${p.weatherTypes.join(' or ')}${w('weather')}`)
    if (p.beachAccess) criteria.push(`Beach or coastal access within 30-45 minutes${w('beachAccess')}`)
    if (p.mountainAccess) criteria.push(`Mountain or skiing access nearby${w('mountainAccess')}`)
    if (p.lakeAccess) criteria.push(`Lake or water access nearby${w('lakeAccess')}`)
    if (p.campusSizeMax < 50000) criteria.push(`Undergraduate enrollment between ${p.campusSizeMin.toLocaleString()} and ${p.campusSizeMax.toLocaleString()}${w('campusSize')}`)
    if (p.avgClassSizeMax < 500) criteria.push(`Average class size between ${p.avgClassSizeMin} and ${p.avgClassSizeMax} students${w('classSize')}`)
    if (p.carOnCampus.length) criteria.push(`Freshman car policy: ${p.carOnCampus.join(' or ')}${w('carOnCampus')}`)
    if (p.recreationCenter) criteria.push(`Pool/recreation center on campus${w('recreationCenter')}`)
    if (p.sportsLevels.length) criteria.push(`Sports culture level: ${p.sportsLevels.join(' or ')}${w('sports')}`)
    if (p.spiritLevels.length) criteria.push(`School spirit level: ${p.spiritLevels.join(' or ')}${w('spirit')}`)
    if (p.greekLifeLevels.length) criteria.push(`Greek life presence: ${p.greekLifeLevels.join(' or ')}${w('greek')}`)
    if (p.lgbtqInclusive.length) criteria.push(`LGBTQ+ inclusive and welcoming campus${w('lgbtq')}`)
    if (p.majorNeeded) criteria.push(`Strong major programs in: ${p.majorNeeded}${w('major')}`)
    if (p.minorNeeded) criteria.push(`Minor in: ${p.minorNeeded}${w('minor')}`)
    if (p.businessProgram) criteria.push(`Strong business/entrepreneurship programs${w('business')}`)
    if (p.artsProgram) criteria.push(`Strong arts and design programs${w('arts')}`)
    if (p.internshipAccess) criteria.push(`Good internship access and opportunities${w('internships')}`)
    if (p.careerOutcomes) criteria.push(`Strong post-graduation career outcomes${w('careers')}`)
    if (p.acceptanceRateMax < 100) criteria.push(`Acceptance rate between ${p.acceptanceRateMin}% and ${p.acceptanceRateMax}%${w('selectivity')}`)

    const excludeClause = excludeNames.length > 0
      ? `\n\nDo NOT include any of these colleges already shown to the user:\n${excludeNames.map(n => `• ${n}`).join('\n')}\n`
      : ''

    const distanceClause = homeLocation
      ? `IMPORTANT: Only include colleges that are geographically within ${p.distanceMax} miles driving distance of zip code ${homeLocation.zip}. Do not include colleges outside this radius. Be strict about this — verify each college's distance before including it.`
      : ''

    return `You are a college counselor. Find exactly ${count} U.S. colleges matching these student preferences:
${criteria.length > 0 ? criteria.map(c => `• ${c}`).join('\n') : '• No specific criteria - recommend well-rounded colleges'}
${distanceClause}${excludeClause}
Respond ONLY with a valid JSON array. No markdown, no explanation, just the raw JSON array.
Each object must have exactly these fields:
{
  "name": "Full official college name",
  "city": "City",
  "state": "2-letter state code",
  "website": "https://official-website.edu",
  "enrollment": 12000,
  "acceptanceRate": 45,
  "annualCost": 28000,
  "setting": "Urban/Suburban/College Town/Rural",
  "weather": "Mild and sunny year-round",
  "greekLife": "Moderate Greek presence",
  "sportsCulture": "High - Division I athletics",
  "nearbyAttractions": "30 min to beach, hiking trails nearby",
  "topPrograms": "Business, Engineering, Communications",
  "fitSummary": "2-3 sentence explanation of why this college matches the student's specific criteria",
  "whyItFits": ["reason 1 tied to their criteria", "reason 2", "reason 3"]
}`
  }

  const searchCollegeByName = async (collegeName) => {
    setLoading(true); setError(''); setSearchResults([])
    try {
      const apiUrl = `https://api.data.gov/ed/collegescorecard/v1/schools.json?school.name=${encodeURIComponent(collegeName)}&_fields=id,school.name,school.city,school.state,school.url,latest.student.size,latest.cost.avg_net_price.public&_per_page=50`
      const response = await fetch(apiUrl, { headers: { 'Accept': 'application/json' } })
      if (response.ok) {
        const data = await response.json()
        if (data.results && data.results.length > 0) {
          const formatted = data.results.filter(c => c['school.name'] && c['school.url']).map((c, idx) => ({
            id: c.id || idx, name: c['school.name'], city: c['school.city'] || '', state: c['school.state'] || '',
            website: c['school.url'] || '', enrollment: c['latest.student.size'] || null,
            annualCost: c['latest.cost.avg_net_price.public'] || null,
            bio: `${c['school.name']} is located in ${c['school.city']}, ${c['school.state']}.`,
          })).slice(0, 50)
          setSearchResults(formatted); setLoading(false); return
        }
      }
    } catch {}
    try {
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(collegeName + ' university college')}&srwhat=text&srlimit=20&origin=*`
      const wikiResponse = await fetch(wikiUrl)
      if (wikiResponse.ok) {
        const wikiData = await wikiResponse.json()
        if (wikiData.query.search && wikiData.query.search.length > 0) {
          const results = wikiData.query.search.map((r, idx) => ({
            id: `web-${idx}`, name: r.title, city: '', state: '',
            website: `https://en.wikipedia.org/wiki/${encodeURIComponent(r.title)}`,
            bio: r.snippet.replace(/<[^>]*>/g, '').substring(0, 250) + '...',
          }))
          setSearchResults(results.slice(0, 20)); setLoading(false); return
        }
      }
    } catch {}
    setError(`No results found for "${collegeName}".`)
    setLoading(false)
  }

  const searchByPreferences = async (findMore = false) => {
    setLoading(true); setError('')
    if (!findMore) setSearchResults([])
    const excludeNames = findMore ? searchResults.map(c => c.name) : []
    const prompt = buildSearchPrompt(15, excludeNames)
    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-opus-4-5', max_tokens: 6000, messages: [{ role: 'user', content: prompt }] })
      })
      if (!response.ok) throw new Error('API error ' + response.status)
      const data = await response.json()
      const colleges = parseAIResponse(data.content[0].text)
      if (colleges.length === 0) { setError('Could not parse results. Please try again.'); setLoading(false); return }
      if (findMore) {
        setSearchResults(prev => {
          const existingNames = new Set(prev.map(c => c.name.toLowerCase()))
          const newOnes = colleges.filter(c => !existingNames.has(c.name.toLowerCase()))
            .map((c, i) => ({ ...c, id: `ai-more-${Date.now()}-${i}` }))
          return [...prev, ...newOnes]
        })
      } else {
        setSearchResults(colleges)
      }
    } catch {
      setError('AI search service unavailable. Make sure your API key is set (REACT_APP_ANTHROPIC_API_KEY) in Vercel Environment Variables.')
    }
    setLoading(false)
  }

  const parseAIResponse = (response) => {
    try {
      const cleaned = response.replace(/```json|```/g, '').trim()
      const jsonMatch = cleaned.match(/\[[\s\S]*\]/)
      if (!jsonMatch) return []
      return JSON.parse(jsonMatch[0]).map((c, idx) => ({
        id: `ai-${idx}`, name: c.name || 'Unknown', city: c.city || '', state: c.state || '',
        website: c.website || '#', enrollment: c.enrollment || null, acceptanceRate: c.acceptanceRate || null,
        annualCost: c.annualCost || null, setting: c.setting || '', weather: c.weather || '',
        greekLife: c.greekLife || '', sportsCulture: c.sportsCulture || '',
        nearbyAttractions: c.nearbyAttractions || '', topPrograms: c.topPrograms || '',
        bio: c.fitSummary || '', whyItFits: c.whyItFits || [],
      }))
    } catch { return [] }
  }

  const toggleSaveCollege = (college) => {
    setSavedColleges(prev => prev.find(c => c.id === college.id) ? prev.filter(c => c.id !== college.id) : [...prev, college])
  }
  const isSaved = (id) => !!savedColleges.find(c => c.id === id)

  const exportToCSV = (list) => {
    const headers = ['College Name', 'City', 'State', 'Website', 'Enrollment', 'Acceptance Rate', 'Est. Annual Cost', 'Setting', 'Top Programs', 'Fit Summary']
    const rows = list.map(c => [c.name, c.city, c.state, c.website, c.enrollment || '', c.acceptanceRate ? c.acceptanceRate + '%' : '', c.annualCost ? '$' + c.annualCost.toLocaleString() : '', c.setting, c.topPrograms, (c.bio || '').replace(/"/g, '""')])
    const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })))
    link.setAttribute('download', `colleges-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link); link.click(); document.body.removeChild(link)
  }

  // ─── COLLEGE CARD ───────────────────────────────────────────
  const CollegeCard = ({ college, rank }) => (
    <div style={{ background: 'white', borderRadius: '16px', border: '2px solid #C8D6EC', overflow: 'hidden', boxShadow: '0 2px 12px rgba(30,58,95,0.08)' }}>
      {/* Photo full width on mobile */}
      <div style={{ position: 'relative' }}>
        <CollegeImage name={college.name} />
        <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#1E3A5F', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>#{rank + 1}</div>
      </div>

      {/* Header */}
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #EDF1FA' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1E3A5F', margin: '0 0 4px', lineHeight: 1.3 }}>{college.name}</h4>
            <p style={{ color: '#5C7A9F', fontSize: '13px', margin: 0 }}>{college.city}{college.city && college.state ? ', ' : ''}{college.state}{college.setting ? ` · ${college.setting}` : ''}</p>
          </div>
          <button onClick={() => toggleSaveCollege(college)} style={{ background: isSaved(college.id) ? '#E8650A' : '#F0F4FF', color: isSaved(college.id) ? 'white' : '#1E3A5F', border: `2px solid ${isSaved(college.id) ? '#E8650A' : '#C8D6EC'}`, borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '18px', flexShrink: 0 }}>{isSaved(college.id) ? '★' : '☆'}</button>
        </div>
        {college.website && college.website !== '#' && (
          <a href={college.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '8px', color: '#E8650A', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', padding: '6px 14px', border: '1px solid #E8650A', borderRadius: '20px' }}>Visit Website →</a>
        )}
      </div>

      {/* Stats chips */}
      <div style={{ padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid #EDF1FA' }}>
        {college.enrollment && <span style={{ background: '#F0F4FF', color: '#1E3A5F', fontSize: '12px', padding: '5px 12px', borderRadius: '20px', border: '1px solid #C8D6EC' }}>👥 {college.enrollment.toLocaleString()} students</span>}
        {college.acceptanceRate && <span style={{ background: '#F0F4FF', color: '#1E3A5F', fontSize: '12px', padding: '5px 12px', borderRadius: '20px', border: '1px solid #C8D6EC' }}>🎯 {college.acceptanceRate}% acceptance</span>}
        {college.annualCost && <span style={{ background: '#F0F4FF', color: '#1E3A5F', fontSize: '12px', padding: '5px 12px', borderRadius: '20px', border: '1px solid #C8D6EC' }}>💰 ${college.annualCost.toLocaleString()}/yr est.</span>}
        {college.weather && <span style={{ background: '#F0F4FF', color: '#1E3A5F', fontSize: '12px', padding: '5px 12px', borderRadius: '20px', border: '1px solid #C8D6EC' }}>🌤️ {college.weather}</span>}
      </div>

      {/* Details */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #EDF1FA', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {college.topPrograms && <p style={{ fontSize: '13px', color: '#1E3A5F', margin: 0 }}><strong>📚 Programs:</strong> {college.topPrograms}</p>}
        {college.nearbyAttractions && <p style={{ fontSize: '13px', color: '#1E3A5F', margin: 0 }}><strong>🗺️ Nearby:</strong> {college.nearbyAttractions}</p>}
        {college.sportsCulture && <p style={{ fontSize: '13px', color: '#1E3A5F', margin: 0 }}><strong>🏈 Sports:</strong> {college.sportsCulture}</p>}
        {college.greekLife && <p style={{ fontSize: '13px', color: '#1E3A5F', margin: 0 }}><strong>🏛️ Greek Life:</strong> {college.greekLife}</p>}
      </div>

      {/* Fit summary */}
      {college.bio && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #EDF1FA', background: '#FFFBF5', borderLeft: '4px solid #E8650A' }}>
          <p style={{ fontSize: '13px', color: '#1E3A5F', lineHeight: '1.6', margin: 0 }}>{college.bio}</p>
        </div>
      )}

      {/* Why it fits */}
      {college.whyItFits && college.whyItFits.length > 0 && (
        <div style={{ padding: '12px 16px' }}>
          <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#5C7A9F', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Why it fits</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {college.whyItFits.map((r, i) => (
              <span key={i} style={{ background: '#E8F5E9', color: '#2E7D32', fontSize: '12px', padding: '5px 12px', borderRadius: '20px', border: '1px solid #A5D6A7' }}>✓ {r}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  // ─── RENDER ─────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F0F4FF 0%, #F7F9FF 50%, #EDF1FA 100%)', fontFamily: "'Georgia', serif", paddingBottom: '80px' }}>

      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: '#1E3A5F', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', margin: 0 }}>🎓 College Fit Finder</h1>
            <p style={{ fontSize: '11px', color: '#F5A623', margin: 0 }}>Find your perfect match</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['search', 'saved', 'resources'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '7px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                background: view === v ? '#E8650A' : 'rgba(255,255,255,0.15)',
                color: 'white', border: 'none', cursor: 'pointer'
              }}>
                {v === 'search' ? '🔍' : v === 'saved' ? `★ ${savedColleges.length}` : '📚'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '16px' }}>

        {/* ── SEARCH VIEW ── */}
        {view === 'search' && (
          <div>
            {/* ZIP CODE */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '16px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(30,58,95,0.08)', border: '1px solid #C8D6EC' }}>
              <label style={{ fontWeight: 'bold', color: '#1E3A5F', fontSize: '13px', display: 'block', marginBottom: '8px' }}>📍 Your zip code (for distance filtering)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="number" placeholder="e.g. 19380" maxLength="5" value={zipInput}
                  onChange={e => setZipInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleZipCodeSubmit(zipInput) }}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '2px solid #C8D6EC', fontSize: '16px', color: '#1E3A5F', outline: 'none' }} />
                <button onClick={() => handleZipCodeSubmit(zipInput)} style={{ padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', background: '#E8650A', color: 'white', border: 'none', cursor: 'pointer', fontSize: '14px' }}>Set</button>
              </div>
              {homeLocation && <p style={{ fontSize: '12px', color: '#2E7D32', marginTop: '8px', fontWeight: 'bold' }}>✓ Location set: {homeLocation.zip}</p>}
            </div>

            {/* NAME SEARCH */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '16px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(30,58,95,0.08)', border: '1px solid #C8D6EC' }}>
              <label style={{ fontWeight: 'bold', color: '#1E3A5F', fontSize: '13px', display: 'block', marginBottom: '8px' }}>🔍 Search by college name</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" placeholder="e.g. University of Miami" value={nameSearch}
                  onChange={e => setNameSearch(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && nameSearch.trim()) searchCollegeByName(nameSearch.trim()) }}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '2px solid #C8D6EC', fontSize: '16px', color: '#1E3A5F', outline: 'none' }} />
                <button onClick={() => { if (nameSearch.trim()) searchCollegeByName(nameSearch.trim()) }} disabled={loading}
                  style={{ padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', background: loading ? '#9BB0C8' : '#E8650A', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px' }}>
                  {loading ? '...' : 'Go'}
                </button>
              </div>
            </div>

            {/* PREFERENCE FILTERS */}
            <div style={{ background: 'white', borderRadius: '12px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(30,58,95,0.08)', border: '1px solid #C8D6EC', overflow: 'hidden' }}>
              <button onClick={() => setShowFilters(!showFilters)} style={{ width: '100%', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>
                <span style={{ fontWeight: 'bold', color: '#1E3A5F', fontSize: '14px' }}>⚙️ My Preferences</span>
                <span style={{ color: '#E8650A', fontSize: '20px', fontWeight: 'bold' }}>{showFilters ? '−' : '+'}</span>
              </button>

              {showFilters && (
                <div style={{ padding: '0 16px 16px' }}>

                  <SectionHeader emoji="💰" title="Costs" />
                  <MinMaxInput label="Annual Net Cost" minKey="netAnnualCostMin" maxKey="netAnnualCostMax" prefix="$" placeholder_min="0" placeholder_max="80000" values={p} onChange={handleP} />
                  <ImportanceSelector paramKey="cost" importance={importance} onChange={handleImportance} />
                  <MinMaxInput label="Total 4-Year Cost" minKey="totalCostMin" maxKey="totalCostMax" prefix="$" placeholder_min="0" placeholder_max="300000" values={p} onChange={handleP} />
                  <ImportanceSelector paramKey="totalCost" importance={importance} onChange={handleImportance} />

                  <SectionHeader emoji="📍" title="Location & Environment" />
                  <MinMaxInput label="Distance from Home" minKey="distanceMin" maxKey="distanceMax" suffix="miles" placeholder_min="0" placeholder_max="3000" values={p} onChange={handleP} />
                  <ImportanceSelector paramKey="distance" importance={importance} onChange={handleImportance} />
                  <PillSelect label="Campus Setting (select all that apply)" valueKey="settingTypes" options={['City', 'Suburban', 'College Town', 'Rural']} values={p} onChange={handleP} />
                  <ImportanceSelector paramKey="setting" importance={importance} onChange={handleImportance} />
                  <PillSelect label="Climate Preference (select all that apply)" valueKey="weatherTypes" options={['Cold/Snowy', 'Mild/Temperate', 'Warm/Hot']} values={p} onChange={handleP} />
                  <ImportanceSelector paramKey="weather" importance={importance} onChange={handleImportance} />
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ fontWeight: 'bold', color: '#1E3A5F', fontSize: '13px', display: 'block', marginBottom: '10px' }}>Outdoor Access (tap all that apply)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <ToggleChip label="Beach" emoji="🏖️" valueKey="beachAccess" values={p} onChange={handleP} />
                      <ToggleChip label="Mountains/Skiing" emoji="⛷️" valueKey="mountainAccess" values={p} onChange={handleP} />
                      <ToggleChip label="Lake/Water" emoji="🏞️" valueKey="lakeAccess" values={p} onChange={handleP} />
                    </div>
                    {(p.beachAccess || p.mountainAccess || p.lakeAccess) && <ImportanceSelector paramKey="outdoorAccess" importance={importance} onChange={handleImportance} />}
                  </div>

                  <SectionHeader emoji="🏫" title="Campus Life" />
                  <MinMaxInput label="Campus Size" minKey="campusSizeMin" maxKey="campusSizeMax" suffix="students" placeholder_min="0" placeholder_max="50000" values={p} onChange={handleP} />
                  <ImportanceSelector paramKey="campusSize" importance={importance} onChange={handleImportance} />
                  <MinMaxInput label="Average Class Size" minKey="avgClassSizeMin" maxKey="avgClassSizeMax" suffix="students" placeholder_min="5" placeholder_max="500" values={p} onChange={handleP} />
                  <ImportanceSelector paramKey="classSize" importance={importance} onChange={handleImportance} />
                  <PillSelect label="Sports Culture" valueKey="sportsLevels" options={['Low', 'Moderate', 'High']} values={p} onChange={handleP} />
                  {p.sportsLevels.length > 0 && <ImportanceSelector paramKey="sports" importance={importance} onChange={handleImportance} />}
                  <PillSelect label="School Spirit" valueKey="spiritLevels" options={['Low', 'Moderate', 'High']} values={p} onChange={handleP} />
                  {p.spiritLevels.length > 0 && <ImportanceSelector paramKey="spirit" importance={importance} onChange={handleImportance} />}
                  <PillSelect label="Greek Life" valueKey="greekLifeLevels" options={['Not Present', 'Small', 'Moderate', 'Large']} values={p} onChange={handleP} />
                  {p.greekLifeLevels.length > 0 && <ImportanceSelector paramKey="greek" importance={importance} onChange={handleImportance} />}
                  <PillSelect label="Freshman Cars on Campus" valueKey="carOnCampus" options={['Allowed', 'Not Allowed', "Don't Care"]} values={p} onChange={handleP} />
                  {p.carOnCampus.length > 0 && <ImportanceSelector paramKey="carOnCampus" importance={importance} onChange={handleImportance} />}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold', color: '#1E3A5F', fontSize: '13px', display: 'block', marginBottom: '10px' }}>Campus Amenities</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <ToggleChip label="Pool / Rec Center" emoji="🏊" valueKey="recreationCenter" values={p} onChange={handleP} />
                    </div>
                    {p.recreationCenter && <ImportanceSelector paramKey="recreationCenter" importance={importance} onChange={handleImportance} />}
                  </div>

                  <SectionHeader emoji="👥" title="Student Body" />
                  <PillSelect label="LGBTQ+ Inclusiveness" valueKey="lgbtqInclusive" options={['Important', 'Very Important']} values={p} onChange={handleP} />
                  {p.lgbtqInclusive.length > 0 && <ImportanceSelector paramKey="lgbtq" importance={importance} onChange={handleImportance} />}

                  <SectionHeader emoji="📚" title="Academic Programs" />
                  <TextInput label="Major I Need" valueKey="majorNeeded" placeholder="e.g. Business, Nursing, Film" values={p} onChange={handleP} />
                  {p.majorNeeded && <ImportanceSelector paramKey="major" importance={importance} onChange={handleImportance} />}
                  <TextInput label="Minor I'd Like" valueKey="minorNeeded" placeholder="Optional" values={p} onChange={handleP} />
                  {p.minorNeeded && <ImportanceSelector paramKey="minor" importance={importance} onChange={handleImportance} />}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold', color: '#1E3A5F', fontSize: '13px', display: 'block', marginBottom: '10px' }}>Program Priorities (tap all that apply)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <ToggleChip label="Strong Business" emoji="💼" valueKey="businessProgram" values={p} onChange={handleP} />
                      <ToggleChip label="Arts & Design" emoji="🎨" valueKey="artsProgram" values={p} onChange={handleP} />
                      <ToggleChip label="Internship Access" emoji="🤝" valueKey="internshipAccess" values={p} onChange={handleP} />
                      <ToggleChip label="Career Outcomes" emoji="🚀" valueKey="careerOutcomes" values={p} onChange={handleP} />
                    </div>
                    {(p.businessProgram || p.artsProgram || p.internshipAccess || p.careerOutcomes) && <ImportanceSelector paramKey="programPriorities" importance={importance} onChange={handleImportance} />}
                  </div>

                  <SectionHeader emoji="🎯" title="Selectivity" />
                  <MinMaxInput label="Acceptance Rate" minKey="acceptanceRateMin" maxKey="acceptanceRateMax" suffix="%" placeholder_min="0" placeholder_max="100" values={p} onChange={handleP} />
                  <ImportanceSelector paramKey="selectivity" importance={importance} onChange={handleImportance} />

                  {/* Find Colleges button inside panel */}
                  <button onClick={searchByPreferences} disabled={loading} style={{ width: '100%', padding: '16px', borderRadius: '10px', fontWeight: 'bold', background: loading ? '#9BB0C8' : '#E8650A', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px', marginTop: '8px' }}>
                    {loading ? '🔍 Finding colleges...' : '🎓 Find Colleges'}
                  </button>
                  <p style={{ fontSize: '11px', color: '#5C7A9F', textAlign: 'center', marginTop: '8px' }}>Results are AI-generated. Always verify with each college.</p>
                </div>
              )}
            </div>

            {/* Floating Find Colleges button when filters collapsed */}
            {!showFilters && (
              <button onClick={() => { setShowFilters(true); setTimeout(() => searchByPreferences(), 100) }}
                style={{ width: '100%', padding: '16px', borderRadius: '10px', fontWeight: 'bold', background: '#E8650A', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', marginBottom: '12px', boxShadow: '0 4px 12px rgba(232,101,10,0.3)' }}>
                🎓 Find Colleges with My Preferences
              </button>
            )}

            {error && <div style={{ background: '#fff3cd', padding: '14px 16px', borderRadius: '10px', border: '1px solid #ffc107', color: '#856404', marginBottom: '16px', fontSize: '13px' }}>⚠️ {error}</div>}

            {/* Criteria summary banner */}
            {searchResults.length > 0 && buildSearchCriteriaSummary().length > 0 && (
              <div style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2E5F8A 100%)', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px' }}>
                <p style={{ color: '#F5A623', fontSize: '11px', fontWeight: 'bold', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Search Criteria</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {buildSearchCriteriaSummary().map((tag, i) => (
                    <span key={i} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', padding: '4px 10px', borderRadius: '20px' }}>{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {searchResults.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1E3A5F', margin: 0 }}>🎓 {searchResults.length} Colleges Found</h3>
                  <button onClick={() => exportToCSV(searchResults)} style={{ padding: '8px 14px', borderRadius: '20px', fontWeight: 'bold', background: '#F5A623', color: 'white', border: 'none', cursor: 'pointer', fontSize: '12px' }}>📥 CSV</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {searchResults.map((college, rank) => <CollegeCard key={college.id} college={college} rank={rank} />)}
                </div>

                {/* Find More button */}
                <button
                  onClick={() => searchByPreferences(true)}
                  disabled={loading}
                  style={{ width: '100%', marginTop: '20px', padding: '16px', borderRadius: '10px', fontWeight: 'bold', background: loading ? '#9BB0C8' : 'white', color: loading ? 'white' : '#1E3A5F', border: '2px solid #1E3A5F', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px' }}
                >
                  {loading ? '🔍 Finding more...' : '➕ Find More Colleges'}
                </button>
                <p style={{ fontSize: '11px', color: '#5C7A9F', textAlign: 'center', marginTop: '6px' }}>Finds 15 additional colleges not already shown</p>
              </div>
            )}

            {searchResults.length === 0 && !error && (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: '12px', border: '1px solid #C8D6EC' }}>
                <p style={{ fontSize: '40px', marginBottom: '12px' }}>🎓</p>
                <p style={{ color: '#5C7A9F', fontSize: '14px' }}>Set your preferences above and tap Find Colleges</p>
              </div>
            )}
          </div>
        )}

        {/* ── SAVED VIEW ── */}
        {view === 'saved' && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E3A5F', marginBottom: '16px' }}>★ Saved Colleges</h2>
            {savedColleges.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', background: 'white', borderRadius: '12px', border: '1px solid #C8D6EC' }}>
                <p style={{ fontSize: '40px', marginBottom: '12px' }}>☆</p>
                <p style={{ color: '#5C7A9F', fontSize: '14px', marginBottom: '16px' }}>No saved colleges yet</p>
                <button onClick={() => setView('search')} style={{ background: '#E8650A', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Search Colleges</button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <p style={{ color: '#5C7A9F', fontSize: '13px', margin: 0 }}>{savedColleges.length} saved</p>
                  <button onClick={() => exportToCSV(savedColleges)} style={{ padding: '8px 14px', borderRadius: '20px', fontWeight: 'bold', background: '#F5A623', color: 'white', border: 'none', cursor: 'pointer', fontSize: '12px' }}>📥 Export CSV</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {savedColleges.map((college, rank) => <CollegeCard key={college.id} college={college} rank={rank} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── RESOURCES VIEW ── */}
        {view === 'resources' && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E3A5F', marginBottom: '16px' }}>📚 Resources</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { href: 'https://fafsa.ed.gov', emoji: '💵', title: 'FAFSA', desc: 'Free Application for Federal Student Aid' },
                { href: 'https://www.scholarships.com', emoji: '🎓', title: 'Scholarships.com', desc: 'Find scholarships and grants' },
                { href: 'https://www.fastweb.com', emoji: '🔍', title: 'FastWeb', desc: 'Scholarship matching service' },
                { href: 'https://www.collegeboard.org', emoji: '📖', title: 'College Board', desc: 'SAT, AP, and college search tools' },
                { href: 'https://www.commonapp.org', emoji: '📝', title: 'Common App', desc: 'Apply to 900+ colleges in one place' },
                { href: 'https://niche.com', emoji: '⭐', title: 'Niche', desc: 'College reviews and rankings from students' },
              ].map(r => (
                <a key={r.href} href={r.href} target="_blank" rel="noopener noreferrer" style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #C8D6EC', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 1px 4px rgba(30,58,95,0.06)' }}>
                  <span style={{ fontSize: '28px' }}>{r.emoji}</span>
                  <div>
                    <p style={{ fontWeight: 'bold', color: '#1E3A5F', margin: '0 0 2px', fontSize: '14px' }}>{r.title}</p>
                    <p style={{ color: '#5C7A9F', fontSize: '12px', margin: 0 }}>{r.desc}</p>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#E8650A', fontSize: '18px' }}>→</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollegeDecisionApp
