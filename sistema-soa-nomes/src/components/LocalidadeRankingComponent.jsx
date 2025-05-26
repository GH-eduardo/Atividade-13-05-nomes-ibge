import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import IBGEApiService from '../services/IBGEApiService';
import DataProcessingService from '../services/DataProcessingService';
import ValidationService from '../services/ValidationService';

const LocalidadeRankingComponent = () => {
  const [localidade, setLocalidade] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');
      
      const validatedLocalidade = ValidationService.validateLocalidade(localidade);
      const apiData = await IBGEApiService.fetchLocalidadeNames(validatedLocalidade);
      const processedData = DataProcessingService.processLocalidadeRanking(apiData);

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
        <MapPin className="n-600" size={24} />
        <h2 className="ont-bold -800">Ranking de Nomes por Localidade</h2>
      </div>
      
      <div className="flex gap-2 mb-4">
        <select
          value={localidade}
          onChange={(e) => setLocalidade(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Selecione uma localidade</option>
          <option value="11">Rondônia</option>
          <option value="12">Acre</option>
          <option value="13">Amazonas</option>
          <option value="14">Roraima</option>
          <option value="15">Pará</option>
          <option value="16">Amapá</option>
          <option value="17">Tocantins</option>
          <option value="21">Maranhão</option>
          <option value="22">Piauí</option>
          <option value="23">Ceará</option>
          <option value="24">Rio Grande do Norte</option>
          <option value="25">Paraíba</option>
          <option value="26">Pernambuco</option>
          <option value="27">Alagoas</option>
          <option value="28">Sergipe</option>
          <option value="29">Bahia</option>
          <option value="31">Minas Gerais</option>
          <option value="32">Espírito Santo</option>
          <option value="33">Rio de Janeiro</option>
          <option value="35">São Paulo</option>
          <option value="41">Paraná</option>
          <option value="42">Santa Catarina</option>
          <option value="43">Rio Grande do Sul</option>
          <option value="50">Mato Grosso do Sul</option>
          <option value="51">Mato Grosso</option>
          <option value="52">Goiás</option>
          <option value="53">Distrito Federal</option>
        </select>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-green-600 e rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Search size={16} />
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {error && (
        <div className="600 mb-4 p-3 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {data.length > 0 && (
        <div>
          <h3 className="ont-semibold mb-4">Top 3 Nomes na Localidade Selecionada</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2">Posição</th>
                  <th className="border border-gray-300 px-4 py-2">Nome</th>
                  <th className="border border-gray-300 px-4 py-2">Frequência</th>
                  <th className="border border-gray-300 px-4 py-2">Proporção (relativo ao top 20)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{item.position}º</td>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">{item.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.frequency?.toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.proportion?.toFixed(4)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalidadeRankingComponent;