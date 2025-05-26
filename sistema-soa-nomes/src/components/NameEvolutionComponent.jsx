import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, TrendingUp } from 'lucide-react';
import IBGEApiService from '../services/IBGEApiService';
import DataProcessingService from '../services/DataProcessingService';
import ValidationService from '../services/ValidationService';

const NameEvolutionComponent = () => {
  const [name, setName] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');
      
      const validatedName = ValidationService.validateName(name);
      const apiData = await IBGEApiService.fetchNameData(validatedName);
      const processedData = DataProcessingService.processNameEvolution(apiData);
      
      setData(processedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-blue-600" size={24} />
        <h2 className="text-xl font-bold text-gray-800">Evolução do Ranking de um Nome</h2>
      </div>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite um nome (ex: Maria, João)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Search size={16} />
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {error && (
        <div className="text-red-600 mb-4 p-3 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {data.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Evolução de Frequência do Nome "{name}"</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="decade" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="frequency" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default NameEvolutionComponent;