import './App.css';
import NameEvolutionComponent from './components/NameEvolutionComponent';
import LocalidadeRankingComponent from './components/LocalidadeRankingComponent';
import NameComparisonComponent from './components/NameComparisonComponent';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Sistema SOA - Análise de Tendências de Nomes no Brasil
          </h1>
          <p className="text-gray-600 text-lg">
            Dados históricos do IBGE sobre popularidade de nomes próprios
          </p>
        </header>

        <div className="space-y-8">
          <NameEvolutionComponent />
          <LocalidadeRankingComponent />
          <NameComparisonComponent />
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>Dados fornecidos pela API do IBGE | Sistema baseado em Arquitetura SOA</p>
        </footer>
      </div>
    </div>
  );
};

export default App;