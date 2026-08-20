export type Region = "Federal" | "Brasília" | "Goiás";

export interface Concurso {
  id: string;
  titulo: string;
  orgao: string;
  vagas: number;
  salario: string;
  inscricoes: string;
  status: "aberto" | "previsto" | "urgente";
  regiao: Region;
  fonteUrl: string;
}

export interface Noticia {
  id: string;
  titulo: string;
  fonte: string;
  resumo: string;
  categoria: string;
  data: string;
  linkFonte: string;
}

export interface Ativo {
  id: string;
  ticker: string;
  nome: string;
  preco: string;
  variacao: number;
  tipo: "acao" | "fii";
  dy?: string;
  pVP?: string;
  data: Array<{ date: string; price: number }>;
}

export interface Curso {
  id: string;
  titulo: string;
  plataforma: string;
  area: string;
  cargaHoraria: string;
  certificacao: boolean;
  regiao: Region;
  nivel: "iniciante" | "intermediario" | "avancado";
  status: "aberto" | "previsto" | "fechado";
  linkInscricao: string;
}

function generateYearData(basePrice: number, ticker: string): Array<{ date: string; price: number }> {
  const data: Array<{ date: string; price: number }> = [];
  const today = new Date();
  const seed = ticker.charCodeAt(0) + ticker.charCodeAt(1);

  for (let i = 365; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const randomFactor = Math.sin(seed + i * 0.1) * 0.15;
    const trendFactor = ((365 - i) / 365) * 0.2;
    const price = basePrice * (1 + randomFactor + trendFactor);
    data.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price * 100) / 100,
    });
  }

  return data;
}

export const concursos: Concurso[] = [
  { id: "1", titulo: "Câmara dos Deputados - Policial Legislativo", orgao: "Câmara dos Deputados", vagas: 80, salario: "R$ 23.703,47", inscricoes: "até 20/02/2026", status: "aberto", regiao: "Federal", fonteUrl: "https://www.camara.leg.br/" },
  { id: "2", titulo: "PMDF - Oficial", orgao: "Polícia Militar do DF", vagas: 147, salario: "até R$ 21.211,89", inscricoes: "04/02 a 06/03/2026", status: "aberto", regiao: "Brasília", fonteUrl: "https://www.pmdf.df.gov.br/" },
  { id: "3", titulo: "Diplomata (CACD)", orgao: "Ministério das Relações Exteriores", vagas: 60, salario: "R$ 22.558,56", inscricoes: "04 a 25/02/2026", status: "aberto", regiao: "Federal", fonteUrl: "https://www.gov.br/mre/pt-br/instituto-rio-branco/carreira-de-diplomata/cacd" },
  { id: "4", titulo: "VALEC Engenharia", orgao: "VALEC", vagas: 65, salario: "R$ 10.800,82", inscricoes: "até 04/02/2026", status: "urgente", regiao: "Federal", fonteUrl: "https://www.infrasa.gov.br/" },
  { id: "5", titulo: "Assembleia Legislativa - Goiás", orgao: "Alego", vagas: 120, salario: "R$ 8.500,00", inscricoes: "até 08/02/2026", status: "urgente", regiao: "Goiás", fonteUrl: "https://portal.al.go.leg.br/" },
];

export const noticias: Noticia[] = [
  { id: "1", titulo: "OpenAI vs Anthropic: O duelo no Super Bowl", fonte: "Olhar Digital", resumo: "As gigantes da IA levam a disputa para o horário nobre da TV americana.", categoria: "IA", data: "Base local", linkFonte: "https://olhardigital.com.br/" },
  { id: "2", titulo: "Especialistas de IA ganham milhões na Microsoft", fonte: "Exame", resumo: "Registro sobre remuneração de especialistas de IA em grandes empresas de tecnologia.", categoria: "Tecnologia", data: "Base local", linkFonte: "https://exame.com/" },
  { id: "3", titulo: "Moltbook: A rede social exclusiva para IAs", fonte: "BBC News Brasil", resumo: "Nova plataforma gera debates sobre o futuro da interação entre máquinas.", categoria: "IA", data: "Base local", linkFonte: "https://www.bbc.com/portuguese" },
  { id: "4", titulo: "Por que a maioria das iniciativas de IA corporativa fracassa", fonte: "InfoMoney", resumo: "Análise aprofundada sobre os desafios da implementação de IA em empresas.", categoria: "Tecnologia", data: "Base local", linkFonte: "https://www.infomoney.com.br/" },
];

export const ativos: Ativo[] = [
  { id: "1", ticker: "KLBN11", nome: "Klabin", preco: "R$ 37,50", variacao: 8.5, tipo: "acao", dy: "16,90%", pVP: "1,20", data: generateYearData(34.5, "KLBN11") },
  { id: "2", ticker: "DIRR3", nome: "Direcional", preco: "R$ 9,80", variacao: 12.3, tipo: "acao", dy: "24,26%", pVP: "0,95", data: generateYearData(8.7, "DIRR3") },
  { id: "3", ticker: "B3SA3", nome: "B3", preco: "R$ 16,45", variacao: 5.2, tipo: "acao", dy: "18,50%", pVP: "1,45", data: generateYearData(15.6, "B3SA3") },
  { id: "4", ticker: "BBSE3", nome: "BB Seguridade", preco: "R$ 23,10", variacao: 6.8, tipo: "acao", dy: "17,80%", pVP: "1,60", data: generateYearData(21.6, "BBSE3") },
  { id: "5", ticker: "JSLG3", nome: "JSL", preco: "R$ 28,30", variacao: 9.1, tipo: "acao", dy: "23,03%", pVP: "1,29", data: generateYearData(25.9, "JSLG3") },
  { id: "6", ticker: "GEPA4", nome: "Rio Paranapanema", preco: "R$ 6,20", variacao: 4.5, tipo: "acao", dy: "29,19%", pVP: "1,85", data: generateYearData(5.9, "GEPA4") },
];

export const cursos: Curso[] = [
  { id: "1", titulo: "Liderança Estratégica com IA na Administração Pública", plataforma: "Escola Virtual de Governo", area: "Gestão Pública", cargaHoraria: "30h", certificacao: true, regiao: "Federal", nivel: "intermediario", status: "aberto", linkInscricao: "https://www.escolavirtual.gov.br/catalogo" },
  { id: "2", titulo: "Transformação Digital e Governo Eletrônico", plataforma: "Aprenda Mais (MEC)", area: "Tecnologia", cargaHoraria: "40h", certificacao: true, regiao: "Federal", nivel: "iniciante", status: "aberto", linkInscricao: "https://aprendamais.mec.gov.br/" },
  { id: "3", titulo: "Gestão de Pessoas e Desenvolvimento de Equipes", plataforma: "Escola de Governo - Goiás", area: "Gestão", cargaHoraria: "30h", certificacao: true, regiao: "Goiás", nivel: "intermediario", status: "aberto", linkInscricao: "https://goias.gov.br/escoladegoverno/cursos-ead/" },
  { id: "4", titulo: "Direitos Humanos e Cidadania", plataforma: "Escola Virtual de Governo", area: "Direitos Humanos", cargaHoraria: "20h", certificacao: true, regiao: "Federal", nivel: "iniciante", status: "aberto", linkInscricao: "https://www.escolavirtual.gov.br/catalogo" },
  { id: "5", titulo: "Segurança Digital e Proteção de Dados (LGPD)", plataforma: "Aprenda Mais (MEC)", area: "Tecnologia", cargaHoraria: "25h", certificacao: true, regiao: "Federal", nivel: "intermediario", status: "aberto", linkInscricao: "https://aprendamais.mec.gov.br/" },
  { id: "6", titulo: "Empreendedorismo e Gestão de Negócios", plataforma: "SEBRAE", area: "Negócios", cargaHoraria: "15h", certificacao: true, regiao: "Brasília", nivel: "iniciante", status: "aberto", linkInscricao: "https://www.sebrae.com.br/sites/PortalSebrae/cursos" },
  { id: "7", titulo: "Gestão de Crises no Setor Público", plataforma: "Escola Virtual de Governo", area: "Gestão Pública", cargaHoraria: "30h", certificacao: true, regiao: "Federal", nivel: "avancado", status: "aberto", linkInscricao: "https://www.escolavirtual.gov.br/catalogo" },
  { id: "8", titulo: "Educação Inclusiva e Acessibilidade", plataforma: "EGOV Virtual - DF", area: "Educação", cargaHoraria: "20h", certificacao: true, regiao: "Brasília", nivel: "iniciante", status: "previsto", linkInscricao: "https://egovvirtual.df.gov.br/" },
];

export const findConcurso = (id: string) => concursos.find(item => item.id === id);
export const findNoticia = (id: string) => noticias.find(item => item.id === id);
export const findAtivo = (id: string) => ativos.find(item => item.id === id);
export const findCurso = (id: string) => cursos.find(item => item.id === id);
