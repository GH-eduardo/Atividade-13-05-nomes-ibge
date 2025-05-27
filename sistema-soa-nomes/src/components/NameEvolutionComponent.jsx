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
  const [showRanking, setShowRanking] = useState(false); // Toggle entre frequência e ranking

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');
      
      const validatedName = ValidationService.validateName(name);
      const apiData = await IBGEApiService.fetchNameData(validatedName);
      
      const processedData = await DataProcessingService.processNameEvolution(apiData, validatedName);
      
      setData(processedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const hasValidRanking = data.length > 0 && data[0].ranking !== null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-blue-600" size={24} />
        <h2 className="text-xl font-bold text-gray-800">Evolução do Nome</h2>
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Evolução do Nome "{name}"
            </h3>
            
            {hasValidRanking && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Exibir:
                </label>
                <select
                  value={showRanking ? 'ranking' : 'frequency'}
                  onChange={(e) => setShowRanking(e.target.value === 'ranking')}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="frequency">Frequência</option>
                  <option value="ranking">Ranking</option>
                </select>
              </div>
            )}
          </div>

          {hasValidRanking && (
            <div className="mb-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Ranking atual:</strong> {data[8].ranking}º lugar entre os nomes mais populares do Brasil
              </p>
            </div>
          )}

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="decade" />
              <YAxis 
                scale={showRanking && hasValidRanking ? 'linear' : 'linear'}
                domain={showRanking && hasValidRanking ? [1, 20] : ['dataMin', 'dataMax']}
                reversed={showRanking && hasValidRanking} // Ranking menor = melhor posição
              />
              <Tooltip 
                formatter={(value, name) => [
                  value,
                  showRanking && hasValidRanking ? 'Posição no Ranking' : 'Frequência'
                ]}
                labelFormatter={(label) => `Período: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={showRanking && hasValidRanking ? 'ranking' : 'frequency'}
                stroke="#2563eb" 
                strokeWidth={2}
                name={showRanking && hasValidRanking ? 'Ranking' : 'Frequência'}
              />
            </LineChart>
          </ResponsiveContainer>

          {!hasValidRanking && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Este nome não está entre os 20 mais populares do Brasil, 
                por isso não é possível exibir informações de ranking.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NameEvolutionComponent;