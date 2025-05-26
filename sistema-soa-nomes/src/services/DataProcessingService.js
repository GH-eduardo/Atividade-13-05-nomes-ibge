// Serviço de Processamento de Dados
class DataProcessingService {
  static processNameEvolution(apiData) {
    if (!apiData || !apiData[0] || !apiData[0].res) {
      return [];
    }

    function formataPeriodo(periodo) {
      periodo = periodo.replace('[', '');
      periodo = periodo.replace('[', '');
      periodo = periodo.replace(',', '-');
      return periodo;
    }

    apiData[0].res = apiData[0].res.map( item => {
      return ({
        periodo: formataPeriodo(item.periodo),
        frequencia: item.frequencia
      })
    });

    return apiData[0].res.map(item => ({
      decade: `${item.periodo}`,
      frequency: item.frequencia,
      ranking: item.ranking
    })).sort((a, b) => parseInt(a.decade) - parseInt(b.decade));
  }

  static processComparisonData(data1, data2, name1, name2) {
    const processed1 = this.processNameEvolution(data1);
    const processed2 = this.processNameEvolution(data2);

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

    function soma (top20) {
      let s = 0;
      for (let i in top20) {
        s += parseInt(top20[i].frequencia);
      }
      return s;
    }

    const totalOcorrenciasTop20Nomes = soma(top20Nomes);
    // Pega os 3 primeiros nomes
    return (top20Nomes).slice(0, 3).map((item, index) => ({
      position: index + 1,
      name: item.nome,
      frequency: item.frequencia,
      proportion: item.frequencia/totalOcorrenciasTop20Nomes*100
    }));
  }
}

export default DataProcessingService;