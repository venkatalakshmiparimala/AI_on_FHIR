'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00C49F', '#FFBB28'];

export default function Home() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [language, setLanguage] = useState(i18n.language);
  const [suggestions, setSuggestions] = useState([]);

  const suggestionsPerLang = {
    en: [
      'Show me all cancer patients over 50',
      'List patients under 40 with asthma',
      'Give me all hypertension cases over 60',
      'Show me all Diabetics patients over 50',
      'Show me all patients under 40 age',
    ],
    es: [
      'Muéstrame pacientes con cáncer mayores de 50',
      'Lista de pacientes menores de 40 con asma',
      'Dame todos los casos de hipertensión mayores de 60'
    ]
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    i18n.changeLanguage(selectedLang);
    setSuggestions([]);
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setQuery(input);
    const list = suggestionsPerLang[language] || [];
    if (input.length > 1) {
      const filtered = list.filter((s) =>
        s.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (text) => {
    setQuery(text);
    setSuggestions([]);
  };

  const handleSubmit = async () => {
    try {
      if (!query.trim()) {
        alert(t('noInput'));
        return;
      }

      const res = await fetch('/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Error during fetch:", err);
      alert(t('connectionFail'));
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <main style={styles.container}>
        <div style={styles.languageSelector}>
          🌐 <select onChange={handleLanguageChange} defaultValue={language}>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>

        <h1 style={styles.header}>🩺 {t('header')}</h1>
        <p style={styles.subtext}>{t('subtext')}</p>

        <div style={styles.inputGroup}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              value={query}
              onChange={handleInputChange}
              placeholder={t('placeholder')}
              style={styles.input}
            />
            {suggestions.length > 0 && (
              <ul style={styles.suggestionBox}>
                {suggestions.map((s, i) => (
                  <li key={i} style={styles.suggestionItem} onClick={() => handleSuggestionClick(s)}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button onClick={handleSubmit} style={styles.button}>{t('submit')}</button>
        </div>

        {result && (
          <div style={styles.results}>
            <h3>🧠 {t('parsed')}</h3>
            <pre style={styles.code}>{JSON.stringify(result.parsed, null, 2)}</pre>

            <h3>📊 {t('chartTitle')}</h3>
            <ResponsiveContainer width="100%" height={250}>
              {result.fhir_response.chart_data.length === 1 ? (
                <BarChart
                width={600}
                height={300}
                data={result.fhir_response.entry.map(entry => ({
                  name: `${entry.resource.name[0].given.join(' ')} ${entry.resource.name[0].family}`,
                  age: entry.resource.age
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-40}
                  textAnchor="end"
                  interval={0}
                  height={80}
                  label={{ value: t('name'), position: 'bottom', offset: 10 }}
                />
                <YAxis
                  label={{ value: t('age'), angle: -90, position: 'insideLeft' }}
                  allowDecimals={false}
                />
                <Tooltip />
                <Legend verticalAlign="top" />
                <Bar dataKey="age" fill="#82ca9d" />
              </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={result.fhir_response.chart_data}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {result.fhir_response.chart_data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>

            <h3>📋 {t('response')}</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.tableCell, ...styles.tableHeader }}>{t('name')}</th>
                  <th style={{ ...styles.tableCell, ...styles.tableHeader }}>{t('age')}</th>
                  <th style={{ ...styles.tableCell, ...styles.tableHeader }}>{t('condition')}</th>
                </tr>
              </thead>
              <tbody>
                {result.fhir_response.entry.map((entry, i) => (
                  <tr key={i}>
                    <td style={styles.tableCell}>
                      {entry.resource.name[0].given.join(' ')} {entry.resource.name[0].family}
                    </td>
                    <td style={styles.tableCell}>{entry.resource.age}</td>
                    <td style={styles.tableCell}>{entry.resource.condition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  pageWrapper: {
    background: '#0f172a',
    minHeight: '100vh',
    padding: '40px 20px',
  },
  container: {
    fontFamily: 'Segoe UI, sans-serif',
    maxWidth: 800,
    margin: '0 auto',
    padding: 40,
    borderRadius: 20,
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  languageSelector: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 10,
    fontSize: 16,
    color: '#f1f5f9'
  },
  header: {
    fontSize: 36,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    display: 'flex',
    gap: 12,
    marginBottom: 30,
    width: '100%' // 
  },
  input: {
    flex: 1,
    padding: '20px',
    fontSize: '18px',
    height: '60px',
    border: '1px solid #334155',
    borderRadius: 999,
    backgroundColor: '#1e293b',
    color: 'white',
    outline: 'none',
    position: 'relative',
    minWidth: '550px',  // 
    maxWidth: '100%'     // 
  },  
  button: {
    padding: '14px 26px',
    fontSize: 16,
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: 999,
    cursor: 'pointer',
    boxShadow: '0 0 12px #3b82f6',
    transition: 'all 0.3s ease-in-out',
  },
  suggestionBox: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 10,
    listStyle: 'none',
    margin: 0,
    padding: 0,
    zIndex: 5
  },
  suggestionItem: {
    padding: 10,
    borderBottom: '1px solid #334155',
    color: 'white',
    cursor: 'pointer'
  },
  results: {
    marginTop: 40,
  },
  code: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 10,
    fontSize: 14,
    whiteSpace: 'pre-wrap',
    border: '1px solid #334155'
  },
  table: {
    width: '100%',
    marginTop: 20,
    borderCollapse: 'separate',
    borderSpacing: '0 12px',
  },
  tableCell: {
    padding: '12px 18px',
    backgroundColor: '#1e293b',
    color: '#f1f5f9',
    borderRadius: 8,
  },
  tableHeader: {
    fontWeight: 'bold',
    color: '#93c5fd',
    textAlign: 'left'
  }
};
