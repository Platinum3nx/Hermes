import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [services, setServices] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    wallet_address: '',
    endpoint_url: ''
  });

  const fetchData = async () => {
    try {
      const servicesRes = await axios.get('http://localhost:3000/services');
      setServices(servicesRes.data);

      const transactionsRes = await axios.get('http://localhost:3000/transactions');
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/register', formData);
      // Clear form and immediately refresh list
      setFormData({ name: '', price: '', wallet_address: '', endpoint_url: '' });
      fetchData();
    } catch (error) {
      console.error('Error registering service:', error);
      alert('Failed to register service');
    }
  };

  return (
    <div className="hermes-container">
      <div className="scanline"></div>

      <header className="hermes-header">
        <div className="brand-box">
          <h1>HERMES</h1>
          <div className="subtitle">AUTONOMOUS AGENT GATEWAY // SEPOLIA NETWORK</div>
        </div>
        <div className="status-box">
          <span className="pulsing-dot"></span>
          SYSTEM ONLINE
        </div>
      </header>

      <div className="hermes-grid">

        {/* SECTION 1: REGISTRY UPLINK (FORM) */}
        <div className="grid-item uplink-panel">
          <h2 className="panel-title">REGISTRY UPLINK</h2>
          <form className="hermes-form" onSubmit={handleRegister}>
            <div className="input-group">
              <label>AGENT ID</label>
              <input
                type="text"
                name="name"
                placeholder="Ex: GPU_NODE_ALPHA"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label>COST (MNEE)</label>
              <input
                type="text"
                name="price"
                placeholder="Ex: 50"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label>WALLET ADDR</label>
              <input
                type="text"
                name="wallet_address"
                placeholder="0x..."
                value={formData.wallet_address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label>ENDPOINT</label>
              <input
                type="text"
                name="endpoint_url"
                placeholder="http://..."
                value={formData.endpoint_url}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="hermes-btn">INITIALIZE PROTOCOL</button>
          </form>
        </div>

        {/* SECTION 2: ACTIVE NODES (LIST) */}
        <div className="grid-item nodes-panel">
          <h2 className="panel-title">ACTIVE NODES [{services.length}]</h2>
          <div className="scroll-content">
            {services.map(service => (
              <div key={service.id} className="node-card">
                <div className="node-status">
                  <div className="status-dot online"></div>
                  ONLINE
                </div>
                <div className="node-info">
                  <div className="node-name">{service.name}</div>
                  <div className="node-id">ID: {service.id}</div>
                  <div className="node-meta">
                    <span>ADDR: {service.wallet_address.substring(0, 8)}...</span>
                    <span className="price-tag">{service.price} MNEE</span>
                  </div>
                </div>
              </div>
            ))}
            {services.length === 0 && <div className="empty-state">SCANNING FOR NODES...</div>}
          </div>
        </div>

        {/* SECTION 3: LIVE LEDGER (ACTIVITY) */}
        <div className="grid-item ledger-panel">
          <h2 className="panel-title">LIVE LEDGER STREAM</h2>
          <div className="scroll-content">
            {transactions.map(tx => (
              <div key={tx.id} className={`ledger-entry type-${tx.status}`}>
                <div className="ledger-time">{new Date(tx.timestamp).toLocaleTimeString()}</div>
                <div className="ledger-content">
                  <div className="ledger-hash">HASH: {tx.tx_hash.substring(0, 16)}...</div>
                  <div className="ledger-target">TARGET: {tx.service_name || `Unknown #${tx.service_id}`}</div>
                </div>
                <div className={`ledger-status status-${tx.status}`}>
                  {tx.status.toUpperCase()}
                </div>
              </div>
            ))}
            {transactions.length === 0 && <div className="empty-state">WAITING FOR TRAFFIC...</div>}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
