import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Users } from 'lucide-react';
import IBGEApiService from '../services/IBGEApiService';
import DataProcessingService from '../services/DataProcessingService';
import ValidationService from '../services/ValidationService';

const NameComparisonComponent = () => {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');
      
      const validatedName1 = ValidationService.validateName(name1);
      const validatedName2 = ValidationService.validateName(name2);
      
      const [apiData1, apiData2] = await Promise.all([
        IBGEApiService.fetchNameData(validatedName1),
        IBGEApiService.fetchNameData(validatedName2)
      ]);
      
      const processedData = DataProcessingService.processComparisonData(
        apiData1, apiData2, validatedName1, validatedName2
      );
      
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
        <Users className="text-purple-600" size={24} />
        <h2 className="text-xl font-bold text-gray-800">Comparação de Dois Nomes</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
        <input
          type="text"
          value={name1}
          onChange={(e) => setName1(e.target.value)}
          placeholder="Primeiro nome"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          value={name2}
          onChange={(e) => setName2(e.target.value)}
          placeholder="Segundo nome"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 justify-center"
        >
          <Search size={16} />
          {loading ? 'Comparando...' : 'Comparar'}
        </button>
      </div>

      {error && (
        <div className="text-red-600 mb-4 p-3 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {data.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Comparação de Frequência: "{name1}" vs "{name2}"</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="decade" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={name1} stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey={name2} stroke="#06b6d4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default NameComparisonComponent;