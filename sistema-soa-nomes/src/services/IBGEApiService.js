class IBGEApiService {
  static baseUrl = 'https://servicodados.ibge.gov.br/api/v2/censos/nomes';

  static async fetchNameData(name, localidade = null) {
    try {      let url = `${this.baseUrl}/${encodeURIComponent(name)}`;
      if (localidade) {
        url += `?localidade=${localidade}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados do IBGE:', error);
      throw error;
    }
  }

  static async fetchLocalidadeNames(localidade) {
    try {
      const response = await fetch(`${this.baseUrl}/ranking?localidade=${localidade}`);
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar ranking por localidade:', error);
      throw error;
    }
  }
}

export default IBGEApiService;