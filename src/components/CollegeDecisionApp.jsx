import React, { useState } from 'react'

const CollegeDecisionApp = () => {
  const [view, setView] = useState('search')
  const [savedColleges, setSavedColleges] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [homeLocation, setHomeLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [parameterValues, setParameterValues] = useState({
    netAnnualCostMin: 0,
    netAnnualCostMax: 80000,
    totalCostMin: 0,
    totalCostMax: 300000,
    distanceMin: 0,
    distanceMax: 3000,
    campusSizeMin: 0,
    campusSizeMax: 50000,
    totalUndergraduateMin: 0,
    totalUndergraduateMax: 50000,
    avgClassSizeMin: 0,
    avgClassSizeMax: 500,
    weatherPreference: 'any',
    beachAccessImportant: false,
    mountainAccessImportant: false,
    lakeAccessImportant: false,
    settingPreference: 'any',
    carOnCampus: 'any',
    recreationCenter: false,
    sportsCultureLevel: 'any',
    schoolSpiritLevel: 'any',
    greekLifePresence: 'any',
    maleFemalRatioMin: 0,
    maleFemalRatioMax: 100,
    lgbtqInclusive: 'any',
    majorNeeded: '',
    minorNeeded: '',
    businessProgramImportant: false,
    artsProgramImportant: false,
    internshipAccessImportant: false,
    careerOutcomesImportant: false,
    selectivityMin: 0,
    selectivityMax: 100,
  })

  const handleValueChange = (key, value) => {
    setParameterValues(prev => ({ ...prev, [key]: value }))
  }

  const handleZipCodeSubmit = (zip) => {
    if (zip.trim()) {
      setHomeLocation({ zip: zip.trim() })
    }
  }

  const buildSearchCriteriaSummary = () => {
    const criteria = []
    if (parameterValues.netAnnualCostMax < 80000) criteria.push(`💰 Net cost under $${parameterValues.netAnnualCostMax.toLocaleString()}/yr`)
    if (parameterValues.totalCostMax < 300000) criteria.push(`💰 4-yr cost under $${parameterValues.totalCostMax.toLocaleString()}`)
    if (homeLocation) criteria.push(`📍 Within ${parameterValues.distanceMax} miles of ${homeLocation.zip}`)
    if (parameterValues.settingPreference !== 'any') criteria.push(`🏙️ ${parameterValues.settingPreference} setting`)
    if (parameterValues.weatherPreference !== 'any') criteria.push(`🌤️ ${parameterValues.weatherPreference} climate`)
    if (parameterValues.beachAccessImportant) criteria.push(`🏖️ Beach access`)
    if (parameterValues.mountainAccessImportant) criteria.push(`⛷️ Mountains/skiing`)
    if (parameterValues.lakeAccessImportant) criteria.push(`🏞️ Lake/water access`)
    if (parameterValues.campusSizeMax < 50000) criteria.push(`🏫 Under ${parameterValues.campusSizeMax.toLocaleString()} students`)
    if (parameterValues.avgClassSizeMax < 500) criteria.push(`📖 Class size under ${parameterValues.avgClassSizeMax}`)
    if (parameterValues.recreationCenter) criteria.push(`🏊 Rec center/pool`)
    if (parameterValues.sportsCultureLevel !== 'any') criteria.push(`🏈 ${parameterValues.sportsCultureLevel} sports culture`)
    if (parameterValues.greekLifePresence !== 'any') criteria.push(`🏛️ ${parameterValues.greekLifePresence} Greek life`)
    if (parameterValues.lgbtqInclusive !== 'any') criteria.push(`🏳️‍🌈 LGBTQ+ inclusive`)
    if (parameterValues.majorNeeded) criteria.push(`📚 Major: ${parameterValues.majorNeeded}`)
    if (parameterValues.minorNeeded) criteria.push(`📝 Minor: ${parameterValues.minorNeeded}`)
    if (parameterValues.businessProgramImportant) criteria.push(`💼 Strong business program`)
    if (parameterValues.artsProgramImportant) criteria.push(`🎨 Strong arts program`)
    if (parameterValues.internshipAccessImportant) criteria.push(`🤝 Internship access`)
    if (parameterValues.careerOutcomesImportant) criteria.push(`🚀 Strong career outcomes`)
    if (parameterValues.selectivityMax < 100) criteria.push(`🎯 Acceptance rate ~${parameterValues.selectivityMax}%+`)
    return criteria
  }

  const buildSearchPrompt = () => {
    const criteria = []
    if (parameterValues.netAnnualCostMax < 80000) criteria.push(`Annual net cost under $${parameterValues.netAnnualCostMax.toLocaleString()}`)
    if (parameterValues.totalCostMax < 300000) criteria.push(`Total 4-year cost under $${parameterValues.totalCostMax.toLocaleString()}`)
    if (homeLocation) criteria.push(`Within approximately ${parameterValues.distanceMax} miles of zip code ${homeLocation.zip}`)
    if (parameterValues.settingPreference !== 'any') criteria.push(`${parameterValues.settingPreference} setting preference`)
    if (parameterValues.weatherPreference !== 'any') criteria.push(`${parameterValues.weatherPreference} weather/climate`)
    if (parameterValues.beachAccessImportant) criteria.push(`Beach or coastal access within 30-45 minutes`)
    if (parameterValues.mountainAccessImportant) criteria.push(`Mountain or skiing access nearby`)
    if (parameterValues.lakeAccessImportant) criteria.push(`Lake or water access nearby`)
    if (parameterValues.campusSizeMax < 50000) criteria.push(`Undergraduate enrollment under ${parameterValues.campusSizeMax.toLocaleString()} students`)
    if (parameterValues.avgClassSizeMax < 500) criteria.push(`Average class size under ${parameterValues.avgClassSizeMax} students`)
    if (parameterValues.carOnCampus !== 'any') criteria.push(`Freshman car policy: ${parameterValues.carOnCampus}`)
    if (parameterValues.recreationCenter) criteria.push(`Pool/recreation center on campus`)
    if (parameterValues.sportsCultureLevel !== 'any') criteria.push(`${parameterValues.sportsCultureLevel} sports culture`)
    if (parameterValues.schoolSpiritLevel !== 'any') criteria.push(`${parameterValues.schoolSpiritLevel} school spirit`)
    if (parameterValues.greekLifePresence !== 'any') criteria.push(`${parameterValues.greekLifePresence} Greek life`)
    if (parameterValues.lgbtqInclusive !== 'any') criteria.push(`LGBTQ+ inclusive campus`)
    if (parameterValues.majorNeeded) criteria.push(`Strong major: ${parameterValues.majorNeeded}`)
    if (parameterValues.minorNeeded) criteria.push(`Minor in: ${parameterValues.minorNeeded}`)
    if (parameterValues.businessProgramImportant) criteria.push(`Strong business/entrepreneurship programs`)
    if (parameterValues.artsProgramImportant) criteria.push(`Strong arts and design programs`)
    if (parameterValues.internshipAccessImportant) criteria.push(`Good internship access`)
    if (parameterValues.careerOutcomesImportant) criteria.push(`Strong post-graduation career outcomes`)
    if (parameterValues.selectivityMax < 100) criteria.push(`Acceptance rate around ${parameterValues.selectivityMax}% or higher`)

    return `You are a college counselor. Find 8-10 U.S. colleges matching these student preferences:
${criteria.length > 0 ? criteria.map(c => `• ${c}`).join('\n') : '• No specific criteria - recommend well-rounded colleges'}

Respond ONLY with a valid JSON array. No markdown, no explanation, just the JSON array.
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
    setLoading(true)
    setError('')
    setSearchResults([])

    try {
      const apiUrl = `https://api.data.gov/ed/collegescorecard/v1/schools.json?school.name=${encodeURIComponent(collegeName)}&_fields=id,school.name,school.city,school.state,school.url,latest.student.size,latest.cost.avg_net_price.public&_per_page=50`
      
      const response = await fetch(apiUrl, { 
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      })

      if (response.ok) {
        const data = await response.json()

        if (data.results && data.results.length > 0) {
          const formatted = data.results
            .filter(c => c['school.name'] && c['school.url'])
            .map((c, idx) => ({
              id: c.id || idx,
              name: c['school.name'],
              city: c['school.city'] || 'Unknown',
              state: c['school.state'] || 'Unknown',
              website: c['school.url'] || '',
              netCost: c['latest.cost.avg_net_price.public'] || null,
              campusSize: c['latest.student.size'] || null,
              bio: `${c['school.name']} is located in ${c['school.city']}, ${c['school.state']}.`,
              image: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(c['school.name'] + ' campus')}`
            }))
            .slice(0, 50)

          setSearchResults(formatted)
          setLoading(false)
          return
        }
      }
    } catch (err) {
      console.log('API failed')
    }

    try {
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(collegeName + ' university college')}&srwhat=text&srlimit=20&origin=*`
      
      const wikiResponse = await fetch(wikiUrl)

      if (wikiResponse.ok) {
        const wikiData = await wikiResponse.json()

        if (wikiData.query.search && wikiData.query.search.length > 0) {
          const results = wikiData.query.search.map((result, idx) => ({
            id: `web-${idx}`,
            name: result.title,
            city: '',
            state: '',
            website: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`,
            netCost: null,
            campusSize: null,
            bio: result.snippet.replace(/<[^>]*>/g, '').substring(0, 250) + '...',
            image: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(result.title + ' campus')}`
          }))

          setSearchResults(results.slice(0, 20))
          setLoading(false)
          return
        }
      }
    } catch (err) {
      console.log('Web search failed')
    }

    setError(`No results found for "${collegeName}".`)
    setLoading(false)
  }

  const searchByPreferences = async () => {
    setLoading(true)
    setError('')
    setSearchResults([])

    const prompt = buildSearchPrompt()

    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-opus-4-1',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error('AI search failed: ' + response.status)
      }

      const data = await response.json()
      const responseText = data.content[0].text

      const colleges = parseAIResponse(responseText)
      
      if (colleges.length === 0) {
        setError('Could not parse results. Please try refining your preferences.')
        setLoading(false)
        return
      }

      setSearchResults(colleges)
      setLoading(false)
    } catch (err) {
      console.error('Search error:', err)
      setError('AI search service unavailable. Make sure your API key is set (REACT_APP_ANTHROPIC_API_KEY) in Vercel Environment Variables.')
      setLoading(false)
    }
  }

  const parseAIResponse = (response) => {
    try {
      const cleaned = response.replace(/```json|```/g, '').trim()
      const jsonMatch = cleaned.match(/\[[\s\S]*\]/)
      if (!jsonMatch) return []
      const parsed = JSON.parse(jsonMatch[0])
      return parsed.map((c, idx) => ({
        id: `ai-${idx}`,
        name: c.name || 'Unknown',
        city: c.city || '',
        state: c.state || '',
        website: c.website || '#',
        enrollment: c.enrollment || null,
        acceptanceRate: c.acceptanceRate || null,
        annualCost: c.annualCost || null,
        setting: c.setting || '',
        weather: c.weather || '',
        greekLife: c.greekLife || '',
        sportsCulture: c.sportsCulture || '',
        nearbyAttractions: c.nearbyAttractions || '',
        topPrograms: c.topPrograms || '',
        bio: c.fitSummary || '',
        whyItFits: c.whyItFits || [],
        image: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent((c.name || '') + ' campus')}`
      }))
    } catch (e) {
      console.error('JSON parse failed:', e)
      return []
    }
  }

  const toggleSaveCollege = (college) => {
    if (savedColleges.find(c => c.id === college.id)) {
      setSavedColleges(savedColleges.filter(c => c.id !== college.id))
    } else {
      setSavedColleges([...savedColleges, college])
    }
  }

  const isSaved = (collegeId) => savedColleges.some(c => c.id === collegeId)

  const exportToCSV = (colleges) => {
    const headers = ['College Name', 'City', 'State', 'Website', 'Annual Cost', 'Campus Size', 'Description']
    const rows = colleges.map(c => [
      c.name,
      c.city || 'N/A',
      c.state || 'N/A',
      c.website || 'N/A',
      c.netCost ? `$${c.netCost.toLocaleString()}` : 'N/A',
      c.campusSize ? `${c.campusSize.toLocaleString()}` : 'N/A',
      c.bio.replace(/"/g, '""')
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `colleges-${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const ParameterSlider = ({ label, minKey, maxKey, minVal, maxVal, unit = '' }) => {
    return (
      <div style={{ marginBottom: '16px', padding: '12px', background: '#faf8f3', borderRadius: '6px', border: '1px solid #e8dcc8' }}>
        <label style={{ fontWeight: 'bold', color: '#6b4423', fontSize: '12px', display: 'block', marginBottom: '8px' }}>{label}</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#9b8b7d', marginBottom: '4px' }}>Min: {parameterValues[minKey]}{unit}</label>
            <input type="range" min={minVal} max={maxVal} value={parameterValues[minKey]} onChange={(e) => handleValueChange(minKey, parseInt(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#9b8b7d', marginBottom: '4px' }}>Max: {parameterValues[maxKey]}{unit}</label>
            <input type="range" min={minVal} max={maxVal} value={parameterValues[maxKey]} onChange={(e) => handleValueChange(maxKey, parseInt(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
          </div>
        </div>
      </div>
    )
  }

  const ParameterSelect = ({ label, valueKey, options }) => {
    return (
      <div style={{ marginBottom: '16px', padding: '12px', background: '#faf8f3', borderRadius: '6px', border: '1px solid #e8dcc8' }}>
        <label style={{ fontWeight: 'bold', color: '#6b4423', fontSize: '12px', display: 'block', marginBottom: '8px' }}>{label}</label>
        <select value={parameterValues[valueKey]} onChange={(e) => handleValueChange(valueKey, e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #d4a574', background: 'white', color: '#6b4423', fontSize: '12px' }}>
          {options.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
        </select>
      </div>
    )
  }

  const ParameterCheckbox = ({ label, valueKey }) => {
    return (
      <div style={{ marginBottom: '16px', padding: '12px', background: '#faf8f3', borderRadius: '6px', border: '1px solid #e8dcc8' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold', color: '#6b4423', fontSize: '12px' }}>
          <input type="checkbox" checked={parameterValues[valueKey]} onChange={(e) => handleValueChange(valueKey, e.target.checked)} style={{ marginRight: '6px', cursor: 'pointer' }} />
          {label}
        </label>
      </div>
    )
  }

  const ParameterText = ({ label, valueKey, placeholder }) => {
    return (
      <div style={{ marginBottom: '16px', padding: '12px', background: '#faf8f3', borderRadius: '6px', border: '1px solid #e8dcc8' }}>
        <label style={{ fontWeight: 'bold', color: '#6b4423', fontSize: '12px', display: 'block', marginBottom: '8px' }}>{label}</label>
        <input type="text" value={parameterValues[valueKey]} onChange={(e) => handleValueChange(valueKey, e.target.value)} placeholder={placeholder} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #d4a574', boxSizing: 'border-box', color: '#6b4423', fontSize: '12px' }} />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fef5e7 0%, #faf8f3 50%, #f5f1e8 100%)', padding: '24px 12px', fontFamily: "'Georgia', serif" }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#6b4423', marginBottom: '6px' }}>🎓 College Fit Finder</h1>
          <p style={{ fontSize: '14px', color: '#9b8b7d' }}>AI-powered personalized college recommendations</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setView('search')} style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', background: view === 'search' ? '#c9765a' : '#d4a574', color: 'white', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Search</button>
          <button onClick={() => setView('saved')} style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', background: view === 'saved' ? '#c9765a' : '#d4a574', color: 'white', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Saved ({savedColleges.length})</button>
          <button onClick={() => setView('resources')} style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', background: view === 'resources' ? '#c9765a' : '#d4a574', color: 'white', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Resources</button>
        </div>

        {view === 'search' && (
          <div>
            <div style={{ background: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(107, 68, 35, 0.1)', border: '2px solid #e8dcc8' }}>
              <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: '#6b4423', marginBottom: '10px' }}>📍 Where do you live?</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Zip code" id="zipInput" maxLength="5" style={{ flex: 1, padding: '10px 12px', borderRadius: '6px', border: '2px solid #d4a574', fontSize: '13px', color: '#6b4423' }} />
                <button onClick={() => { const zip = document.getElementById('zipInput').value; handleZipCodeSubmit(zip) }} style={{ padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', background: '#c9765a', color: 'white', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Set</button>
              </div>
              {homeLocation && <p style={{ fontSize: '12px', color: '#6b4423', marginTop: '8px' }}>✓ {homeLocation.zip}</p>}
            </div>

            <div style={{ background: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(107, 68, 35, 0.1)', border: '2px solid #e8dcc8' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#6b4423', marginBottom: '12px' }}>🔍 Search by College Name</h2>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input type="text" placeholder="Harvard, Tampa, Boston..." id="nameSearch" style={{ flex: 1, minWidth: '180px', padding: '10px 12px', borderRadius: '6px', border: '2px solid #d4a574', fontSize: '13px', color: '#6b4423' }} />
                <button onClick={() => { const q = document.getElementById('nameSearch').value.trim(); if (q) searchCollegeByName(q) }} disabled={loading} style={{ padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', background: loading ? '#9b8b7d' : '#c9765a', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '13px' }}>{loading ? 'Searching...' : 'Search'}</button>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(107, 68, 35, 0.1)', border: '2px solid #e8dcc8' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#6b4423', marginBottom: '12px' }}>🤖 AI-Powered Preference Search</h2>
              <p style={{ fontSize: '12px', color: '#9b8b7d', marginBottom: '12px' }}>Set your preferences below and let Claude's AI find colleges that match your criteria.</p>

              <button onClick={() => setShowFilters(!showFilters)} style={{ width: '100%', textAlign: 'left', padding: '12px', background: '#faf8f3', border: '1px solid #d4a574', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#6b4423', fontSize: '13px', marginBottom: '12px' }}>{showFilters ? '▼' : '►'} {showFilters ? 'Hide' : 'Show'} All 27 Preferences</button>

              {showFilters && (
                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#8b6f47', marginTop: '12px', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid #e8dcc8' }}>💰 Costs</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                    <ParameterSlider label="Net Annual Cost" minKey="netAnnualCostMin" maxKey="netAnnualCostMax" minVal={0} maxVal={80000} unit="$" />
                    <ParameterSlider label="Total 4-Year Cost" minKey="totalCostMin" maxKey="totalCostMax" minVal={0} maxVal={300000} unit="$" />
                  </div>

                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#8b6f47', marginTop: '12px', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid #e8dcc8' }}>📍 Location & Environment</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                    <ParameterSlider label="Distance from Home" minKey="distanceMin" maxKey="distanceMax" minVal={0} maxVal={3000} unit=" miles" />
                    <ParameterSelect label="Setting Type" valueKey="settingPreference" options={['Any', 'City', 'Suburban', 'College Town', 'Rural']} />
                    <ParameterSelect label="Weather Preference" valueKey="weatherPreference" options={['Any', 'Cold/Snowy', 'Mild/Temperate', 'Warm/Hot']} />
                    <ParameterCheckbox label="Beach Access" valueKey="beachAccessImportant" />
                    <ParameterCheckbox label="Mountains/Skiing" valueKey="mountainAccessImportant" />
                    <ParameterCheckbox label="Lake/Water Access" valueKey="lakeAccessImportant" />
                  </div>

                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#8b6f47', marginTop: '12px', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid #e8dcc8' }}>🏫 Campus Life</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                    <ParameterSlider label="Campus Size" minKey="campusSizeMin" maxKey="campusSizeMax" minVal={0} maxVal={50000} unit=" students" />
                    <ParameterSlider label="Undergraduate Enrollment" minKey="totalUndergraduateMin" maxKey="totalUndergraduateMax" minVal={0} maxVal={50000} unit=" students" />
                    <ParameterSlider label="Average Class Size" minKey="avgClassSizeMin" maxKey="avgClassSizeMax" minVal={0} maxVal={500} unit=" students" />
                    <ParameterSelect label="Freshman Car Policy" valueKey="carOnCampus" options={['Any', 'Yes', 'No', 'Preferred']} />
                    <ParameterCheckbox label="Pool/Recreation Center" valueKey="recreationCenter" />
                    <ParameterSelect label="Sports Culture" valueKey="sportsCultureLevel" options={['Any', 'Low', 'Moderate', 'High']} />
                    <ParameterSelect label="School Spirit" valueKey="schoolSpiritLevel" options={['Any', 'Low', 'Moderate', 'High']} />
                    <ParameterSelect label="Greek Life" valueKey="greekLifePresence" options={['Any', 'Not Present', 'Small', 'Moderate', 'Large']} />
                  </div>

                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#8b6f47', marginTop: '12px', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid #e8dcc8' }}>👥 Student Body</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                    <ParameterSlider label="Male/Female Ratio" minKey="maleFemalRatioMin" maxKey="maleFemalRatioMax" minVal={0} maxVal={100} unit="% Female" />
                    <ParameterSelect label="LGBTQ+ Inclusiveness" valueKey="lgbtqInclusive" options={['Any', 'Important', 'Very Important']} />
                  </div>

                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#8b6f47', marginTop: '12px', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid #e8dcc8' }}>📚 Academic Programs</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                    <ParameterText label="Major I Need" valueKey="majorNeeded" placeholder="e.g., Business, Interior Design" />
                    <ParameterText label="Minor I'd Like" valueKey="minorNeeded" placeholder="Optional" />
                    <ParameterCheckbox label="Strong Business Program" valueKey="businessProgramImportant" />
                    <ParameterCheckbox label="Strong Arts/Design Program" valueKey="artsProgramImportant" />
                    <ParameterCheckbox label="Internship Access" valueKey="internshipAccessImportant" />
                    <ParameterCheckbox label="Good Career Outcomes" valueKey="careerOutcomesImportant" />
                  </div>

                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#8b6f47', marginTop: '12px', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid #e8dcc8' }}>🎯 Selectivity</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                    <ParameterSlider label="Acceptance Difficulty" minKey="selectivityMin" maxKey="selectivityMax" minVal={0} maxVal={100} unit="%" />
                  </div>

                  <button 
                    onClick={searchByPreferences}
                    disabled={loading}
                    style={{ width: '100%', padding: '14px', borderRadius: '6px', fontWeight: 'bold', background: loading ? '#9b8b7d' : '#c9765a', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px' }}
                  >
                    {loading ? '🔍 Finding colleges...' : '🤖 Find Colleges Using AI'}
                  </button>
                </div>
              )}
            </div>

            {error && <div style={{ background: '#fff3cd', padding: '12px', borderRadius: '6px', border: '1px solid #ffc107', color: '#856404', marginBottom: '20px' }}>⚠️ {error}</div>}

            {searchResults.length > 0 && (
              <div>
                {/* Preference Summary Banner */}
                {buildSearchCriteriaSummary().length > 0 && (
                  <div style={{ background: 'linear-gradient(135deg, #6b4423 0%, #8b6f47 100%)', borderRadius: '10px', padding: '16px 20px', marginBottom: '20px' }}>
                    <p style={{ color: '#d4a574', fontSize: '11px', fontWeight: 'bold', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Search Criteria</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {buildSearchCriteriaSummary().map((tag, i) => (
                        <span key={i} style={{ background: 'rgba(212,165,116,0.25)', color: '#fef5e7', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(212,165,116,0.4)' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#6b4423', margin: 0 }}>🎓 {searchResults.length} College{searchResults.length !== 1 ? 's' : ''} Found</h3>
                  <button onClick={() => exportToCSV(searchResults)} style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', background: '#d4a574', color: 'white', border: 'none', cursor: 'pointer', fontSize: '12px' }}>📥 Export to CSV</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {searchResults.map((college, rank) => (
                    <div key={college.id} style={{ background: 'white', borderRadius: '12px', border: '2px solid #e8dcc8', overflow: 'hidden', boxShadow: '0 2px 8px rgba(107,68,35,0.08)' }}>
                      {/* Card Header */}
                      <div style={{ background: 'linear-gradient(135deg, #fef5e7 0%, #f5f1e8 100%)', padding: '16px 20px', borderBottom: '1px solid #e8dcc8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ background: '#c9765a', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', flexShrink: 0 }}>#{rank + 1}</span>
                          <div>
                            <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#6b4423', margin: 0 }}>{college.name}</h4>
                            <p style={{ color: '#9b8b7d', fontSize: '13px', margin: '2px 0 0 0' }}>{college.city}{college.city && college.state ? ', ' : ''}{college.state}{college.setting ? ` · ${college.setting}` : ''}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {college.website && college.website !== '#' && (
                            <a href={college.website} target="_blank" rel="noopener noreferrer" style={{ color: '#c9765a', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', padding: '6px 12px', border: '1px solid #c9765a', borderRadius: '6px' }}>Visit Site →</a>
                          )}
                          <button onClick={() => toggleSaveCollege(college)} style={{ background: isSaved(college.id) ? '#c9765a' : '#e8dcc8', color: isSaved(college.id) ? 'white' : '#6b4423', border: 'none', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>{isSaved(college.id) ? '★' : '☆'}</button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 0 }}>
                        {/* Photo Column */}
                        <div style={{ borderRight: '1px solid #e8dcc8' }}>
                          <a href={college.image} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '160px', background: 'linear-gradient(135deg, #faf8f3 0%, #f0ebe0 100%)', textDecoration: 'none', padding: '20px', boxSizing: 'border-box', gap: '8px' }}>
                            <span style={{ fontSize: '32px' }}>🖼️</span>
                            <span style={{ color: '#c9765a', fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}>View Campus Photos</span>
                            <span style={{ color: '#9b8b7d', fontSize: '10px', textAlign: 'center' }}>Opens Google Images</span>
                          </a>
                        </div>

                        {/* Info Column */}
                        <div style={{ padding: '16px 20px' }}>
                          {/* Stats Row */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                            {college.enrollment && <span style={{ background: '#fef5e7', color: '#6b4423', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', border: '1px solid #e8dcc8' }}>👥 {college.enrollment.toLocaleString()} students</span>}
                            {college.acceptanceRate && <span style={{ background: '#fef5e7', color: '#6b4423', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', border: '1px solid #e8dcc8' }}>🎯 {college.acceptanceRate}% acceptance</span>}
                            {college.annualCost && <span style={{ background: '#fef5e7', color: '#6b4423', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', border: '1px solid #e8dcc8' }}>💰 ${college.annualCost.toLocaleString()}/yr est.</span>}
                            {college.weather && <span style={{ background: '#fef5e7', color: '#6b4423', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', border: '1px solid #e8dcc8' }}>🌤️ {college.weather}</span>}
                          </div>

                          {/* Details Grid */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginBottom: '14px' }}>
                            {college.topPrograms && <div style={{ fontSize: '12px', color: '#6b4423' }}><span style={{ fontWeight: 'bold' }}>📚 Programs:</span> {college.topPrograms}</div>}
                            {college.nearbyAttractions && <div style={{ fontSize: '12px', color: '#6b4423' }}><span style={{ fontWeight: 'bold' }}>🗺️ Nearby:</span> {college.nearbyAttractions}</div>}
                            {college.sportsCulture && <div style={{ fontSize: '12px', color: '#6b4423' }}><span style={{ fontWeight: 'bold' }}>🏈 Sports:</span> {college.sportsCulture}</div>}
                            {college.greekLife && <div style={{ fontSize: '12px', color: '#6b4423' }}><span style={{ fontWeight: 'bold' }}>🏛️ Greek Life:</span> {college.greekLife}</div>}
                          </div>

                          {/* Fit Summary */}
                          {college.bio && (
                            <div style={{ background: '#faf8f3', borderRadius: '8px', padding: '12px', marginBottom: '12px', borderLeft: '3px solid #c9765a' }}>
                              <p style={{ fontSize: '13px', color: '#6b4423', lineHeight: '1.6', margin: 0 }}>{college.bio}</p>
                            </div>
                          )}

                          {/* Why It Fits Tags */}
                          {college.whyItFits && college.whyItFits.length > 0 && (
                            <div>
                              <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#9b8b7d', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Why it fits your criteria</p>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {college.whyItFits.map((reason, i) => (
                                  <span key={i} style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', border: '1px solid #c8e6c9' }}>✓ {reason}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.length === 0 && !error && (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: '8px', border: '2px solid #e8dcc8' }}>
                <p style={{ color: '#9b8b7d', fontSize: '14px' }}>Search above to get started</p>
              </div>
            )}
          </div>
        )}

        {view === 'saved' && (
          <div>
            {savedColleges.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', background: 'white', borderRadius: '8px', border: '2px solid #e8dcc8' }}>
                <p style={{ color: '#9b8b7d', fontSize: '14px', marginBottom: '16px' }}>No saved colleges</p>
                <button onClick={() => setView('search')} style={{ background: '#c9765a', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Search</button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#6b4423', margin: 0 }}>Saved Colleges ({savedColleges.length})</h3>
                  <button 
                    onClick={() => exportToCSV(savedColleges)}
                    style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', background: '#d4a574', color: 'white', border: 'none', cursor: 'pointer', fontSize: '12px' }}
                  >
                    📥 Export to CSV
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {savedColleges.map(college => (
                    <div key={college.id} style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '2px solid #e8dcc8' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#6b4423', margin: '0 0 4px 0' }}>{college.name}</h4>
                          {(college.city || college.state) && <p style={{ color: '#9b8b7d', fontSize: '12px', margin: '0 0 8px 0' }}>{college.city}{college.city && college.state ? ', ' : ''}{college.state}</p>}
                          {college.website && college.website !== '#' && <a href={college.website} target="_blank" rel="noopener noreferrer" style={{ color: '#c9765a', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>Learn More →</a>}
                        </div>
                        <button onClick={() => toggleSaveCollege(college)} style={{ background: '#c9765a', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'resources' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            <a href="https://fafsa.ed.gov" target="_blank" rel="noopener noreferrer" style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '2px solid #e8dcc8', textDecoration: 'none', color: 'inherit' }}>
              <h3 style={{ fontWeight: 'bold', color: '#6b4423', marginBottom: '6px', fontSize: '13px' }}>💵 FAFSA</h3>
              <p style={{ color: '#9b8b7d', fontSize: '12px', margin: 0 }}>Free Application for Federal Student Aid</p>
            </a>
            <a href="https://www.scholarships.com" target="_blank" rel="noopener noreferrer" style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '2px solid #e8dcc8', textDecoration: 'none', color: 'inherit' }}>
              <h3 style={{ fontWeight: 'bold', color: '#6b4423', marginBottom: '6px', fontSize: '13px' }}>🎓 Scholarships</h3>
              <p style={{ color: '#9b8b7d', fontSize: '12px', margin: 0 }}>Find scholarships and grants</p>
            </a>
            <a href="https://www.fastweb.com" target="_blank" rel="noopener noreferrer" style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '2px solid #e8dcc8', textDecoration: 'none', color: 'inherit' }}>
              <h3 style={{ fontWeight: 'bold', color: '#6b4423', marginBottom: '6px', fontSize: '13px' }}>🔍 FastWeb</h3>
              <p style={{ color: '#9b8b7d', fontSize: '12px', margin: 0 }}>Scholarship matching</p>
            </a>
            <a href="https://www.collegeboard.org" target="_blank" rel="noopener noreferrer" style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '2px solid #e8dcc8', textDecoration: 'none', color: 'inherit' }}>
              <h3 style={{ fontWeight: 'bold', color: '#6b4423', marginBottom: '6px', fontSize: '13px' }}>📖 College Board</h3>
              <p style={{ color: '#9b8b7d', fontSize: '12px', margin: 0 }}>SAT, AP, and college search</p>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollegeDecisionApp
