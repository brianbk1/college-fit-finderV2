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

  const buildSearchPrompt = () => {
    const criteria = []
    
    if (parameterValues.netAnnualCostMax < 80000) criteria.push(`Annual net cost under $${parameterValues.netAnnualCostMax.toLocaleString()}`)
    if (parameterValues.totalCostMax < 300000) criteria.push(`Total 4-year cost under $${parameterValues.totalCostMax.toLocaleString()}`)
    
    if (homeLocation) criteria.push(`Within approximately ${parameterValues.distanceMax} miles of zip code ${homeLocation.zip}`)
    if (parameterValues.settingPreference !== 'any') criteria.push(`${parameterValues.settingPreference} setting preference`)
    if (parameterValues.weatherPreference !== 'any') criteria.push(`${parameterValues.weatherPreference} weather/climate`)
    if (parameterValues.beachAccessImportant) criteria.push(`Beach or coastal access (within 30-45 minutes preferred)`)
    if (parameterValues.mountainAccessImportant) criteria.push(`Mountain or skiing access nearby`)
    if (parameterValues.lakeAccessImportant) criteria.push(`Lake or water access nearby`)
    
    if (parameterValues.campusSizeMax < 50000) criteria.push(`Campus size under ${parameterValues.campusSizeMax} students`)
    if (parameterValues.totalUndergraduateMax < 50000) criteria.push(`Undergraduate enrollment under ${parameterValues.totalUndergraduateMax} students`)
    if (parameterValues.avgClassSizeMax < 500) criteria.push(`Average class size under ${parameterValues.avgClassSizeMax} students`)
    if (parameterValues.carOnCampus !== 'any') criteria.push(`Freshman car policy: ${parameterValues.carOnCampus}`)
    if (parameterValues.recreationCenter) criteria.push(`Pool/recreation center on campus`)
    if (parameterValues.sportsCultureLevel !== 'any') criteria.push(`${parameterValues.sportsCultureLevel} sports culture`)
    if (parameterValues.schoolSpiritLevel !== 'any') criteria.push(`${parameterValues.schoolSpiritLevel} school spirit`)
    if (parameterValues.greekLifePresence !== 'any') criteria.push(`${parameterValues.greekLifePresence} Greek life`)
    
    if (parameterValues.maleFemalRatioMax < 100) criteria.push(`Male/female ratio: ${parameterValues.maleFemalRatioMin}-${parameterValues.maleFemalRatioMax}% female`)
    if (parameterValues.lgbtqInclusive !== 'any') criteria.push(`LGBTQ+ ${parameterValues.lgbtqInclusive === 'Very Important' ? 'very' : ''} inclusive campus`)
    
    if (parameterValues.majorNeeded) criteria.push(`Strong major programs in: ${parameterValues.majorNeeded}`)
    if (parameterValues.minorNeeded) criteria.push(`Minor/additional programs in: ${parameterValues.minorNeeded}`)
    if (parameterValues.businessProgramImportant) criteria.push(`Strong business/entrepreneurship programs`)
    if (parameterValues.artsProgramImportant) criteria.push(`Strong arts, design, and creative programs`)
    if (parameterValues.internshipAccessImportant) criteria.push(`Good internship access and opportunities`)
    if (parameterValues.careerOutcomesImportant) criteria.push(`Strong post-graduation career outcomes`)
    
    if (parameterValues.selectivityMax < 100) criteria.push(`Acceptance rate around ${parameterValues.selectivityMax}% or higher`)

    const prompt = `Find U.S. colleges and universities that match these student preferences:
${criteria.length > 0 ? criteria.map(c => `• ${c}`).join('\n') : '• No specific criteria selected - recommend well-rounded colleges'}

For each college, provide complete details:
- School name and location (city, state)
- Undergraduate enrollment
- Distance to nearest beach (if applicable)
- Average temperatures by season
- Campus setting (urban, suburban, college town, rural)
- Nearby outdoor attractions (beaches, mountains, lakes, etc.)
- Campus amenities (rec center, sports, etc.)
- Relevant academic programs and majors
- Male/female ratio
- LGBTQ+ friendliness rating
- Freshman car policy
- Campus culture (sports, greek life, arts, nightlife, etc.)
- Greek life presence
- Student activities and social scene
- Estimated annual cost after average financial aid
- Acceptance rate
- Brief summary of fit

Return 8-12 matching colleges ranked by overall fit with the stated criteria.`

    return prompt
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
      const response = await fetch('https://api.anthropic.com/v1/messages', {
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
    const colleges = []
    const sections = response.split(/\n(?=\d+\.|[A-Z]{2,}:)/)
    
    sections.forEach((section, idx) => {
      if (section.trim().length > 20) {
        const lines = section.trim().split('\n')
        const firstLine = lines[0]
        const nameMatch = firstLine.match(/(?:^[\d.]+\s*)?([^–\n]+?)(?:\s*–|$)/)
        const name = nameMatch ? nameMatch[1].trim() : firstLine.substring(0, 50)
        
        if (name && name.length > 2) {
          colleges.push({
            id: `ai-${idx}`,
            name: name.replace(/\*\*/g, ''),
            city: '',
            state: '',
            website: '#',
            bio: lines.slice(0, 5).join(' ').substring(0, 350),
            fullInfo: section,
            image: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(name + ' campus')}`
          })
        }
      }
    })

    return colleges.filter(c => c.name && c.name.length > 3)
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#6b4423', margin: 0 }}>{searchResults.length} College{searchResults.length !== 1 ? 's' : ''} Found</h3>
                  <button 
                    onClick={() => exportToCSV(searchResults)}
                    style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', background: '#d4a574', color: 'white', border: 'none', cursor: 'pointer', fontSize: '12px' }}
                  >
                    📥 Export to CSV
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {searchResults.map(college => (
                    <div key={college.id} style={{ background: 'white', borderRadius: '8px', border: '2px solid #e8dcc8', overflow: 'hidden' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '16px', padding: '16px' }}>
                        <div style={{ minWidth: '200px', maxWidth: '200px', height: '150px', background: '#f0f0f0', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <a href={college.image} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: 'linear-gradient(135deg, #faf8f3 0%, #f5f1e8 100%)', cursor: 'pointer', textDecoration: 'none', color: '#c9765a', fontWeight: 'bold', fontSize: '12px', textAlign: 'center', padding: '10px', boxSizing: 'border-box' }}>
                            🖼️ View Photos
                          </a>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#6b4423', margin: '0 0 4px 0' }}>{college.name}</h4>
                          {(college.city || college.state) && <p style={{ color: '#9b8b7d', fontSize: '12px', margin: '0 0 8px 0' }}>{college.city}{college.city && college.state ? ', ' : ''}{college.state}</p>}
                          {college.website && college.website !== '#' && <a href={college.website} target="_blank" rel="noopener noreferrer" style={{ color: '#c9765a', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>Visit Website →</a>}
                          <p style={{ color: '#6b4423', fontSize: '13px', lineHeight: '1.6', marginTop: '8px' }}>{college.bio}</p>
                          {(college.netCost || college.campusSize) && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginTop: '12px', fontSize: '12px', color: '#9b8b7d' }}>
                              {college.netCost && <div>💰 ${college.netCost.toLocaleString()}/yr</div>}
                              {college.campusSize && <div>👥 {college.campusSize.toLocaleString()} students</div>}
                            </div>
                          )}
                        </div>
                        <button onClick={() => toggleSaveCollege(college)} style={{ background: isSaved(college.id) ? '#c9765a' : '#e8dcc8', color: isSaved(college.id) ? 'white' : '#6b4423', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap', height: 'fit-content' }}>{isSaved(college.id) ? '★' : '☆'}</button>
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
