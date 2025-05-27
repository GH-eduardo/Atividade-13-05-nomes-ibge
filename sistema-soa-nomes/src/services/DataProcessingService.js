import IBGEApiService from './IBGEApiService';

// Serviço de Processamento de Dados
class DataProcessingService {
  static async processNameEvolution(apiData, nome) {
    if (!apiData || !apiData[0] || !apiData[0].res) {
      return [];
    }

    function formataPeriodo(periodo) {
      periodo = periodo.replace('[', '');
      periodo = periodo.replace('[', '');
      periodo = periodo.replace(',', '-');
      return periodo;
    }

    async function calcularRankingHistorico(nomeAlvo, periodoAlvo) {
      try {
        const nomesPopulares = [
          'MARIA', 'ANA', 'JOSE', 'ANTONIO', 'JOAO', 'FRANCISCO', 'CARLOS', 'PAULO', 'PEDRO', 'LUCAS',
          'LUIZ', 'MARCOS', 'LUIS', 'GABRIEL', 'RAFAEL', 'DANIEL', 'MARCELO', 'BRUNO', 'EDUARDO', 'FELIPE',
          'RAIMUNDO', 'RODRIGO', 'MANOEL', 'RICARDO', 'SERGIO', 'FERNANDO', 'JORGE', 'ROBERTO', 'FABIO', 'JOANA',
          'FRANCISCA', 'ANTONIA', 'ADRIANA', 'JULIANA', 'MARCIA', 'FERNANDA', 'PATRICIA', 'ALINE', 'SANDRA', 'CAMILA'
        ];

        const comparacaoFrequencias = [];
        
        for (const nomePopular of nomesPopulares.slice(0, 20)) { // Limita para não sobrecarregar
          try {
            const dadosNome = await IBGEApiService.fetchNameData(nomePopular);
            if (dadosNome && dadosNome[0] && dadosNome[0].res) {
              const periodoEncontrado = dadosNome[0].res.find(item => {
                const periodoFormatado = formataPeriodo(item.periodo);
                return periodoFormatado === periodoAlvo;
              });
              
              if (periodoEncontrado) {
                comparacaoFrequencias.push({
                  nome: nomePopular,
                  frequencia: periodoEncontrado.frequencia
                });
              }
            }
          } catch (error) {
            console.warn(`Erro ao buscar dados para ${nomePopular}:`, error);
          }
        }

        const dadosNomeAlvo = await IBGEApiService.fetchNameData(nomeAlvo);
        let frequenciaNomeAlvo = 0;
        
        if (dadosNomeAlvo && dadosNomeAlvo[0] && dadosNomeAlvo[0].res) {
          const periodoEncontrado = dadosNomeAlvo[0].res.find(item => {
            const periodoFormatado = formataPeriodo(item.periodo);
            return periodoFormatado === periodoAlvo;
          });
          
          if (periodoEncontrado) {
            frequenciaNomeAlvo = periodoEncontrado.frequencia;
          }
        }

        comparacaoFrequencias.push({
          nome: nomeAlvo.toUpperCase(),
          frequencia: frequenciaNomeAlvo
        });

        comparacaoFrequencias.sort((a, b) => b.frequencia - a.frequencia);
        
        const posicao = comparacaoFrequencias.findIndex(item => 
          item.nome.toUpperCase() === nomeAlvo.toUpperCase()
        ) + 1;

        return posicao <= 20 ? posicao : null; // Só retorna se estiver no top 20
        
      } catch (error) {
        console.error(`Erro ao calcular ranking histórico para ${periodoAlvo}:`, error);
        return null;
      }
    }

    const processedItems = [];
    
    for (const item of apiData[0].res) {
      const periodoFormatado = formataPeriodo(item.periodo);
      
      const rankingHistorico = await calcularRankingHistorico(nome, periodoFormatado);
      
      console.log(`Ranking para período ${periodoFormatado}:`, rankingHistorico);
      
      processedItems.push({
        periodo: periodoFormatado,
        frequencia: item.frequencia,
        ranking: rankingHistorico !== null ? rankingHistorico : 'Fora do top 20'
      });
    }

    console.log('Dados processados com ranking histórico:', processedItems);

    return processedItems.map(item => ({
      decade: item.periodo,
      frequency: item.frequencia,
      ranking: typeof item.ranking === 'number' ? item.ranking : null
    })).sort((a, b) => {
      const decadeA = parseInt(a.decade.split('-')[0]);
      const decadeB = parseInt(b.decade.split('-')[0]);
      return decadeA - decadeB;
    });
  }

  static async processComparisonData(data1, data2, name1, name2) {
    const processed1 = await this.processNameEvolution(data1, name1);
    const processed2 = await this.processNameEvolution(data2, name2);

    const allDecades = new Set([
      ...processed1.map(d => d.decade),
      ...processed2.map(d => d.decade)
    ]);

    return Array.from(allDecades).sort().map(decade => {
      const data1Item = processed1.find(d => d.decade === decade);
      const data2Item = processed2.find(d => d.decade === decade);
      
      return {
        decade,
        [name1]: data1Item ? data1Item.frequency : 0,
        [name2]: data2Item ? data2Item.frequency : 0
      };
    });
  }

  static processLocalidadeRanking(apiData) {
    if (!apiData || !Array.isArray(apiData)) {
      return [];
    }

    const top20Nomes = apiData[0].res;
    
    function soma(top20) {
      let s = 0;
      for (let i in top20) {
        s += parseInt(top20[i].frequencia);
      }
      return s;
    }

    const totalOcorrenciasTop20Nomes = soma(top20Nomes);

    return top20Nomes.slice(0, 3).map((item, index) => ({
      position: index + 1,
      name: item.nome,
      frequency: item.frequencia,
      proportion: (item.frequencia / totalOcorrenciasTop20Nomes) * 100
    }));
  }
}

export default DataProcessingService;