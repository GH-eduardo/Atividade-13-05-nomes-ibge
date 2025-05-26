# Sistema SOA para Análise de Tendências de Nomes no Brasil

## Visão Geral
Este projeto implementa um sistema baseado na Arquitetura Orientada a Serviços (SOA) para análise de tendências de nomes próprios no Brasil, utilizando dados históricos da API do IBGE desde a década de 1930.

## Aplicação dos Princípios SOA

## 1. Separação de Responsabilidades
O sistema foi estruturado em camadas distintas, cada uma com responsabilidades bem definidas:
### Camada de Serviços (Service Layer)

- IBGEApiService: Responsável exclusivamente pela comunicação com a API externa do IBGE
- DataProcessingService: Processa e transforma os dados recebidos da API em formatos adequados para visualização
- ValidationService: Valida entradas do usuário antes do processamento

### Camada de Apresentação (Presentation Layer)

- NameEvolutionComponent: Interface para evolução de ranking de um nome
- LocalidadeRankingComponent: Interface para ranking por localidade
- NameComparisonComponent: Interface para comparação entre dois nomes

## 2. Baixo Acoplamento
Os serviços são independentes entre si:

- Cada serviço pode ser modificado sem afetar os outros
- A comunicação entre camadas ocorre através de interfaces bem definidas
- Os componentes da UI não conhecem detalhes da implementação dos serviços

## 3. Alta Coesão
Cada serviço tem uma responsabilidade específica e bem delimitada:

- IBGEApiService: Apenas comunicação HTTP
- DataProcessingService: Apenas transformação de dados
- ValidationService: Apenas validação de entrada
- Componentes UI: Apenas apresentação e interação com usuário

## 4. Reutilização de Serviços
Os serviços são reutilizados por múltiplos componentes:

- ValidationService.validateName() é usado por todos os componentes que recebem nomes
- IBGEApiService.fetchNameData() é reutilizado para diferentes tipos de consulta
- DataProcessingService tem métodos específicos para cada tipo de processamento

## 5. Abstração de Serviços
Os serviços expõem apenas interfaces necessárias, ocultando complexidade interna:

- A UI não precisa conhecer detalhes da API do IBGE
- O processamento de dados é transparente para os componentes
- Tratamento de erros é centralizado nos serviços

## Funcionalidades Implementadas
### 1. Evolução do Ranking de um Nome

- Entrada: Nome e período (implicitamente desde 1930)
- Saída: Gráfico de linha mostrando evolução da frequência
- Serviços utilizados: IBGEApiService, DataProcessingService, ValidationService

### 2. Ranking de Nomes por Localidade

- Entrada: Seleção de UF
- Saída: Tabela com top 3 nomes mais frequentes
- Serviços utilizados: IBGEApiService, DataProcessingService, ValidationService

### 3. Comparação de Dois Nomes

- Entrada: Dois nomes para comparação
- Saída: Gráfico comparativo de frequências ao longo do tempo
- Serviços utilizados: Todos os serviços da arquitetura

## Tecnologias Utilizadas

- React.js: Framework principal para desenvolvimento da interface
- Recharts: Biblioteca para criação de gráficos
- Tailwind CSS: Framework CSS para estilização
- Lucide React: Ícones para a interface
- Fetch API: Comunicação HTTP com a API do IBGE

## Estrutura do Projeto
```
src/
├── services/           # Camada de Serviços SOA
│   ├── IBGEApiService.js
│   ├── DataProcessingService.js
│   └── ValidationService.js
├── components/         # Camada de Apresentação
│   ├── NameEvolutionComponent.jsx
│   ├── LocalidadeRankingComponent.jsx
│   └── NameComparisonComponent.jsx
└── App.jsx            # Componente principal
```


## Como Executar
- Pré-requisitos:

Node.js (versão 14 ou superior)
npm ou yarn

### Instalação

- Clone o repositório:

```
git clone [url-do-repositorio]
cd sistema-soa-nomes
```

- Instale as dependências:

```
npm install
```
# ou
```
yarn install
```

- Execute o projeto:

```
npm start
```
# ou
```
yarn start
```

- Acesse no navegador o endereço:
```
http://localhost:3000 
```

- Dependências Principais
json{
  "react": "^18.0.0",
  "recharts": "^2.5.0",
  "lucide-react": "^0.263.1"
}

## Arquitetura SOA Detalhada
### Benefícios Implementados

- Manutenibilidade: Cada serviço pode ser modificado independentemente
- Testabilidade: Serviços podem ser testados isoladamente
- Escalabilidade: Novos serviços podem ser adicionados facilmente
- Flexibilidade: Diferentes componentes podem usar os mesmos serviços
- Padronização: Interface consistente entre serviços

### Padrões SOA Aplicados

- Service Contract: Cada serviço define claramente suas interfaces
- Service Loose Coupling: Serviços são independentes entre si
- Service Abstraction: Detalhes internos são ocultados
- Service Reusability: Serviços são reutilizados por múltiplos consumidores
- Service Autonomy: Cada serviço controla sua lógica e dados

## Comunicação entre Serviços
A comunicação segue o padrão de chamadas síncronas:

- UI → Validation Service → API Service → Data Processing Service → UI
- Tratamento de erros é propagado através das camadas
- Dados são transformados apenas quando necessário