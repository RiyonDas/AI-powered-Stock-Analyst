  import { useState } from 'react';
  import axios from 'axios';    
  import { 
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid 
  } from 'recharts';

  function App() {
    const [t1, setT1] = useState('');
    const [t2, setT2] = useState('');
    const [results, setResults] = useState(null);

    const handleCompare = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/compare?ticker1=${t1}&ticker2=${t2}`);
        setResults(response.data);
      } catch (error) {
        alert("Check if backend is running!");
      }
    };
    
    // Logic to determine a winner for the gold border
    const getWinner = () => {
      if (!results) return null;
      const s1 = (results.stock1.recommendation === "Strong Buy" ? 10 : 0) + (results.stock1.rsi < 50 ? 5 : 0);
      const s2 = (results.stock2.recommendation === "Strong Buy" ? 10 : 0) + (results.stock2.rsi < 50 ? 5 : 0);
      if (s1 > s2) return results.stock1.symbol;
      if (s2 > s1) return results.stock2.symbol;
      return "Tie";
    };

    const winner = getWinner();

    const barData = results ? [
      { name: 'P/E Ratio', s1: results.stock1.pe, s2: results.stock2.pe },
      { name: 'EPS', s1: results.stock1.eps, s2: results.stock2.eps },
      { name: 'D/E Ratio', s1: results.stock1.de / 10, s2: results.stock2.de / 10 },
    ] : [];
    
    const pieData = results ? [
      { name: results.stock1.symbol, value: results.stock1.marketCap },
      { name: results.stock2.symbol, value: results.stock2.marketCap },
    ] : [];

    const COLORS = ['#4ade80', '#3b82f6'];

    return (
    <div style={{ 
      padding: '40px', 
      // NEW THEME: Deep navy with a trading grid pattern
      backgroundColor: '#0b0e14', 
      backgroundImage: `
        linear-gradient(rgba(11, 14, 20, 0.9), rgba(11, 14, 20, 0.9)),
        linear-gradient(to right, #1f2937 1px, transparent 1px),
        linear-gradient(to bottom, #1f2937 1px, transparent 1px)
      `,
      backgroundSize: '100% 100%, 40px 40px, 40px 40px', 
      color: '#e5e7eb', 
      minHeight: '100vh', 
      width: '100vw', 
      boxSizing: 'border-box', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      fontFamily: "'Inter', sans-serif" 
    }}>
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '40px', 
          fontSize: '2.8rem',
          fontWeight: '800',
          background: 'linear-gradient(to right, #4ade80, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0px 0px 10px rgba(74, 222, 128, 0.3))',
          letterSpacing: '-1px'
        }}>
          📈 Simplistoxx.com
        </h1>
        <input 
          placeholder="Ticker 1" 
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#252525', color: 'white' }}
          onChange={(e) => setT1(e.target.value)} 
        />
        <span style={{ alignSelf: 'center', fontWeight: 'bold' }}>VS</span>
        <input 
          placeholder="Ticker 2" 
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#252525', color: 'white' }}
          onChange={(e) => setT2(e.target.value)} 
        />
        <button 
          onClick={handleCompare}
          style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Compare
        </button>
      </div>

      {results && (
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          <h2 style={{ textAlign: 'center', color: '#ffd700', marginBottom: '20px' }}>
             {winner === "Tie" ? "📊 Matchup Even" : `🏆 AI Choice: ${winner}`}
          </h2>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
            <StockCard data={results.stock1} isWinner={winner === results.stock1.symbol} />
            <StockCard data={results.stock2} isWinner={winner === results.stock2.symbol} />
          </div>

          {/* TWO CHARTS SIDE BY SIDE */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            
            {/* Bar Chart Container */}
            <div style={{ flex: 1, minWidth: '400px', backgroundColor: '#252525', padding: '20px', borderRadius: '15px', border: '1px solid #444' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Valuation Metrics</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }} />
                    <Legend />
                    <Bar name={results.stock1.symbol} dataKey="s1" fill="#4ade80" radius={[4, 4, 0, 0]} />
                    <Bar name={results.stock2.symbol} dataKey="s2" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart Container */}
            <div style={{ flex: 1, minWidth: '400px', backgroundColor: '#252525', padding: '20px', borderRadius: '15px', border: '1px solid #444' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Market Cap Dominance</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <p style={{ color: '#888', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>
            *D/E Ratio is scaled (/10) for visualization purposes.
          </p>
        </div>
      )}
    </div>
  );
}

  // Sub-component stays outside
  const StockCard = ({ data, isWinner }) => (
    <div style={{ 
    border: isWinner ? '2px solid #ffd700' : '1px solid rgba(255, 255, 255, 0.1)', 
    backgroundColor: 'rgba(23, 27, 34, 0.7)', // Semi-transparent
    backdropFilter: 'blur(12px)',            // The "Glass" effect
    padding: '25px', 
    borderRadius: '16px', 
    boxShadow: isWinner ? '0 0 30px rgba(255, 214, 0, 0.15)' : '0 10px 30px rgba(0,0,0,0.5)',
    transition: 'transform 0.3s ease'        // Smooth hover transition
}}>
      <h2 style={{ color: '#fff', margin: '0 0 10px 0' }}>{data.symbol} {isWinner && '⭐'}</h2>
      <hr style={{ borderColor: '#444', marginBottom: '15px' }} />
      
      <div style={{ textAlign: 'left', lineHeight: '1.8' }}>
        <p>💰 <b>Price:</b> ${data.currentPrice}</p>
        <p>📈 <b>Trend:</b> <span style={{ color: data.trend === 'Bullish' ? '#4ade80' : '#f87171' }}>{data.trend}</span></p>
        <p>📊 <b>RSI (14):</b> {data.rsi}</p>
        <p>🏫 <b>P/E Ratio:</b> {data.pe}</p>
        <p>📏 <b>50MA vs 200MA:</b> ${data.ma50} / ${data.ma200}</p>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '12px', 
        borderRadius: '8px',
        textAlign: 'center',
        backgroundColor: data.recommendation === 'Strong Buy' ? '#064e3b' : '#450a0a',
        color: 'white',
        fontWeight: 'bold',
        letterSpacing: '1px'
      }}>
        {data.recommendation.toUpperCase()}
      </div>
    </div>
  );

  export default App;
