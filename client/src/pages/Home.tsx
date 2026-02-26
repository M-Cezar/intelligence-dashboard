import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StockChart } from "@/components/StockChart";
import { 
  TrendingUp, 
  Briefcase, 
  Zap, 
  ChevronRight, 
  Filter, 
  Search,
  MapPin,
  Clock,
  DollarSign,
  Users,
  FileText,
  Brain,
  BookOpen,
  Award
} from "lucide-react";
import { Input } from "@/components/ui/input";

/**
 * Design Philosophy: Modernismo Corporativo com Foco em Dados
 * - Hierarquia clara com informação crítica em primeiro plano
 * - Densidade informativa sem poluição visual
 * - Cores semânticas: Azul (confiança), Verde (crescimento), Âmbar (urgência)
 * - Espaçamento generoso entre seções para evitar fadiga
 */

interface Concurso {
  id: string;
  titulo: string;
  orgao: string;
  vagas: number;
  salario: string;
  inscricoes: string;
  status: "aberto" | "previsto" | "urgente";
  regiao: string;
}

interface Noticia {
  id: string;
  titulo: string;
  fonte: string;
  resumo: string;
  categoria: string;
  data: string;
}

interface Ativo {
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

interface Curso {
  id: string;
  titulo: string;
  plataforma: string;
  area: string;
  cargaHoraria: string;
  certificacao: boolean;
  regiao: string;
  nivel: "iniciante" | "intermediario" | "avancado";
  status: "aberto" | "previsto" | "fechado";
}

const concursos: Concurso[] = [
  {
    id: "1",
    titulo: "Câmara dos Deputados - Policial Legislativo",
    orgao: "Câmara dos Deputados",
    vagas: 80,
    salario: "R$ 23.703,47",
    inscricoes: "até 20/02/2026",
    status: "aberto",
    regiao: "Federal"
  },
  {
    id: "2",
    titulo: "PMDF - Oficial",
    orgao: "Polícia Militar do DF",
    vagas: 147,
    salario: "até R$ 21.211,89",
    inscricoes: "04/02 a 06/03/2026",
    status: "aberto",
    regiao: "Brasília"
  },
  {
    id: "3",
    titulo: "Diplomata (CACD)",
    orgao: "Ministério das Relações Exteriores",
    vagas: 60,
    salario: "R$ 22.558,56",
    inscricoes: "04 a 25/02/2026",
    status: "aberto",
    regiao: "Federal"
  },
  {
    id: "4",
    titulo: "VALEC Engenharia",
    orgao: "VALEC",
    vagas: 65,
    salario: "R$ 10.800,82",
    inscricoes: "até 04/02/2026",
    status: "urgente",
    regiao: "Federal"
  },
  {
    id: "5",
    titulo: "Assembleia Legislativa - Goiás",
    orgao: "Alego",
    vagas: 120,
    salario: "R$ 8.500,00",
    inscricoes: "até 08/02/2026",
    status: "urgente",
    regiao: "Goiás"
  }
];

const noticias: Noticia[] = [
  {
    id: "1",
    titulo: "OpenAI vs Anthropic: O duelo no Super Bowl",
    fonte: "Olhar Digital",
    resumo: "As gigantes da IA levam a disputa para o horário nobre da TV americana.",
    categoria: "IA",
    data: "Hoje"
  },
  {
    id: "2",
    titulo: "Especialistas de IA ganham milhões na Microsoft",
    fonte: "Exame",
    resumo: "Vazamento revela salários astronômicos para talentos de IA na gigante de tecnologia.",
    categoria: "Tecnologia",
    data: "Hoje"
  },
  {
    id: "3",
    titulo: "Moltbook: A rede social exclusiva para IAs",
    fonte: "BBC News Brasil",
    resumo: "Nova plataforma gera debates sobre o futuro da interação entre máquinas.",
    categoria: "IA",
    data: "Ontem"
  },
  {
    id: "4",
    titulo: "Por que a maioria das iniciativas de IA corporativa fracassa",
    fonte: "InfoMoney",
    resumo: "Análise aprofundada sobre os desafios da implementação de IA em empresas.",
    categoria: "Tecnologia",
    data: "2 dias atrás"
  }
];

// Função para gerar dados históricos de 1 ano
function generateYearData(basePrice: number, ticker: string): Array<{ date: string; price: number }> {
  const data = [];
  const today = new Date();
  
  // Seed baseado no ticker para consistência
  const seed = ticker.charCodeAt(0) + ticker.charCodeAt(1);
  
  for (let i = 365; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Gerar variação pseudo-aleatória consistente
    const randomFactor = Math.sin(seed + i * 0.1) * 0.15;
    const trendFactor = (365 - i) / 365 * 0.2;
    const price = basePrice * (1 + randomFactor + trendFactor);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100
    });
  }
  
  return data;
}

const ativos: Ativo[] = [
  { 
    id: "1", 
    ticker: "KLBN11", 
    nome: "Klabin", 
    preco: "R$ 37,50", 
    variacao: 8.5, 
    tipo: "acao",
    dy: "16,90%",
    pVP: "1,20",
    data: generateYearData(34.5, "KLBN11")
  },
  { 
    id: "2", 
    ticker: "DIRR3", 
    nome: "Direcional", 
    preco: "R$ 9,80", 
    variacao: 12.3, 
    tipo: "acao",
    dy: "24,26%",
    pVP: "0,95",
    data: generateYearData(8.7, "DIRR3")
  },
  { 
    id: "3", 
    ticker: "B3SA3", 
    nome: "B3", 
    preco: "R$ 16,45", 
    variacao: 5.2, 
    tipo: "acao",
    dy: "18,50%",
    pVP: "1,45",
    data: generateYearData(15.6, "B3SA3")
  },
  { 
    id: "4", 
    ticker: "BBSE3", 
    nome: "BB Seguridade", 
    preco: "R$ 23,10", 
    variacao: 6.8, 
    tipo: "acao",
    dy: "17,80%",
    pVP: "1,60",
    data: generateYearData(21.6, "BBSE3")
  },
  { 
    id: "5", 
    ticker: "JSLG3", 
    nome: "JSL", 
    preco: "R$ 28,30", 
    variacao: 9.1, 
    tipo: "acao",
    dy: "23,03%",
    pVP: "1,29",
    data: generateYearData(25.9, "JSLG3")
  },
  { 
    id: "6", 
    ticker: "GEPA4", 
    nome: "Rio Paranapanema", 
    preco: "R$ 6,20", 
    variacao: 4.5, 
    tipo: "acao",
    dy: "29,19%",
    pVP: "1,85",
    data: generateYearData(5.9, "GEPA4")
  }
];

const cursos: Curso[] = [
  {
    id: "1",
    titulo: "Liderança Estratégica com IA na Administração Pública",
    plataforma: "Escola Virtual de Governo",
    area: "Gestão Pública",
    cargaHoraria: "30h",
    certificacao: true,
    regiao: "Federal",
    nivel: "intermediario",
    status: "aberto"
  },
  {
    id: "2",
    titulo: "Transformação Digital e Governo Eletrônico",
    plataforma: "Aprenda Mais (MEC)",
    area: "Tecnologia",
    cargaHoraria: "40h",
    certificacao: true,
    regiao: "Federal",
    nivel: "iniciante",
    status: "aberto"
  },
  {
    id: "3",
    titulo: "Gestão de Pessoas e Desenvolvimento de Equipes",
    plataforma: "Escola de Governo - Goiás",
    area: "Gestão",
    cargaHoraria: "30h",
    certificacao: true,
    regiao: "Goiás",
    nivel: "intermediario",
    status: "aberto"
  },
  {
    id: "4",
    titulo: "Direitos Humanos e Cidadania",
    plataforma: "Escola Virtual de Governo",
    area: "Direitos Humanos",
    cargaHoraria: "20h",
    certificacao: true,
    regiao: "Federal",
    nivel: "iniciante",
    status: "aberto"
  },
  {
    id: "5",
    titulo: "Segurança Digital e Proteção de Dados (LGPD)",
    plataforma: "Aprenda Mais (MEC)",
    area: "Tecnologia",
    cargaHoraria: "25h",
    certificacao: true,
    regiao: "Federal",
    nivel: "intermediario",
    status: "aberto"
  },
  {
    id: "6",
    titulo: "Empreendedorismo e Gestão de Negócios",
    plataforma: "SEBRAE",
    area: "Negócios",
    cargaHoraria: "15h",
    certificacao: true,
    regiao: "Brasília",
    nivel: "iniciante",
    status: "aberto"
  },
  {
    id: "7",
    titulo: "Gestão de Crises no Setor Público",
    plataforma: "Escola Virtual de Governo",
    area: "Gestão Pública",
    cargaHoraria: "30h",
    certificacao: true,
    regiao: "Federal",
    nivel: "avancado",
    status: "aberto"
  },
  {
    id: "8",
    titulo: "Educação Inclusiva e Acessibilidade",
    plataforma: "EGOV Virtual - DF",
    area: "Educação",
    cargaHoraria: "20h",
    certificacao: true,
    regiao: "Brasília",
    nivel: "iniciante",
    status: "previsto"
  }
];

function getStatusColor(status: string) {
  switch (status) {
    case "aberto":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "previsto":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "urgente":
      return "bg-amber-100 text-amber-800 border-amber-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "aberto":
      return "Inscrições Abertas";
    case "previsto":
      return "Previsto";
    case "urgente":
      return "Urgente";
    default:
      return status;
  }
}

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedChart, setExpandedChart] = useState<string | null>(null);
  const [selectedCursoRegion, setSelectedCursoRegion] = useState<string>("todos");
  const [selectedArea, setSelectedArea] = useState<string>("todas");

  const filteredConcursos = concursos.filter(c => {
    const matchRegion = selectedRegion === "todos" || c.regiao === selectedRegion;
    const matchSearch = c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.orgao.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRegion && matchSearch;
  });

  const filteredCursos = cursos.filter(curso => {
    const matchRegion = selectedCursoRegion === "todos" || curso.regiao === selectedCursoRegion;
    const matchArea = selectedArea === "todas" || curso.area === selectedArea;
    return matchRegion && matchArea;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 p-2">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Intelligence Dashboard</h1>
                <p className="text-sm text-gray-600">Concursos, IA, Investimentos & Cursos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                Atualizado hoje
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="border-0 bg-gradient-to-br from-emerald-50 to-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-emerald-700">
                  <TrendingUp className="h-5 w-5" />
                  Oportunidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{filteredConcursos.length}</div>
                <p className="text-sm text-gray-600 mt-1">Concursos disponíveis</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-blue-50 to-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Brain className="h-5 w-5" />
                  IA & Tech
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{noticias.length}</div>
                <p className="text-sm text-gray-600 mt-1">Notícias recentes</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-amber-50 to-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-amber-700">
                  <DollarSign className="h-5 w-5" />
                  Mercado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{ativos.length}</div>
                <p className="text-sm text-gray-600 mt-1">Ativos monitorados</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-purple-50 to-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <BookOpen className="h-5 w-5" />
                  Cursos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{filteredCursos.length}</div>
                <p className="text-sm text-gray-600 mt-1">Cursos com certificado</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="concursos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1">
            <TabsTrigger value="concursos" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Concursos
            </TabsTrigger>
            <TabsTrigger value="ia" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              IA & Tech
            </TabsTrigger>
            <TabsTrigger value="investimentos" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Investimentos
            </TabsTrigger>
            <TabsTrigger value="cursos" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Cursos
            </TabsTrigger>
          </TabsList>

          {/* Concursos Tab */}
          <TabsContent value="concursos" className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar concursos..."
                    className="pl-10 bg-white border-gray-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedRegion === "todos" ? "default" : "outline"}
                  onClick={() => setSelectedRegion("todos")}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Todos
                </Button>
                <Button
                  variant={selectedRegion === "Federal" ? "default" : "outline"}
                  onClick={() => setSelectedRegion("Federal")}
                >
                  Federal
                </Button>
                <Button
                  variant={selectedRegion === "Brasília" ? "default" : "outline"}
                  onClick={() => setSelectedRegion("Brasília")}
                >
                  DF
                </Button>
                <Button
                  variant={selectedRegion === "Goiás" ? "default" : "outline"}
                  onClick={() => setSelectedRegion("Goiás")}
                >
                  GO
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredConcursos.map((concurso) => (
                <Card
                  key={concurso.id}
                  className="border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900 group-hover:text-blue-700 transition-colors">
                          {concurso.titulo}
                        </CardTitle>
                        <CardDescription className="mt-1 text-gray-600">
                          {concurso.orgao}
                        </CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(concurso.status)} border`}>
                        {getStatusLabel(concurso.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-600">Vagas</p>
                          <p className="font-semibold text-gray-900">{concurso.vagas}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-600">Salário</p>
                          <p className="font-semibold text-gray-900">{concurso.salario}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-600">Inscrições</p>
                          <p className="font-semibold text-gray-900 text-sm">{concurso.inscricoes}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-600">Região</p>
                          <p className="font-semibold text-gray-900">{concurso.regiao}</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="mt-4 w-full justify-between text-blue-700 hover:bg-blue-50"
                    >
                      Ver detalhes
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* IA & Tech Tab */}
          <TabsContent value="ia" className="space-y-4">
            <div className="grid gap-4">
              {noticias.map((noticia) => (
                <Card
                  key={noticia.id}
                  className="border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900 group-hover:text-blue-700 transition-colors">
                          {noticia.titulo}
                        </CardTitle>
                        <CardDescription className="mt-2 text-gray-600">
                          {noticia.resumo}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-0">
                          {noticia.categoria}
                        </Badge>
                        <span className="text-xs text-gray-500">{noticia.data}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Fonte: <span className="font-semibold">{noticia.fonte}</span></p>
                      <Button variant="ghost" className="text-blue-700 hover:bg-blue-50 gap-2">
                        Ler mais
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Investimentos Tab */}
          <TabsContent value="investimentos" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {ativos.map((ativo) => (
                <Card
                  key={ativo.id}
                  className="border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base text-gray-900">
                          {ativo.ticker}
                        </CardTitle>
                        <CardDescription>{ativo.nome}</CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className={ativo.tipo === "acao" ? "bg-blue-50 text-blue-700 border-blue-300" : "bg-emerald-50 text-emerald-700 border-emerald-300"}
                      >
                        {ativo.tipo === "acao" ? "Ação" : "FII"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-gray-900">{ativo.preco}</span>
                      <span
                        className={`text-sm font-semibold ${
                          ativo.variacao >= 0
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {ativo.variacao >= 0 ? "+" : ""}{ativo.variacao}%
                      </span>
                    </div>

                    {/* DY e P/VP */}
                    {ativo.dy && (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-emerald-50 rounded p-2">
                          <p className="text-xs text-gray-600">Dividend Yield</p>
                          <p className="font-semibold text-emerald-700">{ativo.dy}</p>
                        </div>
                        <div className="bg-blue-50 rounded p-2">
                          <p className="text-xs text-gray-600">P/VP</p>
                          <p className="font-semibold text-blue-700">{ativo.pVP}</p>
                        </div>
                      </div>
                    )}

                    {/* Gráfico */}
                    <div className="pt-2 border-t border-gray-200">
                      <StockChart
                        ticker={ativo.ticker}
                        data={ativo.data}
                        color={ativo.variacao >= 0 ? "#10b981" : "#ef4444"}
                      />
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Detalhes
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Cursos Tab */}
          <TabsContent value="cursos" className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-1" />
              <div className="flex gap-2">
                <Button
                  variant={selectedCursoRegion === "todos" ? "default" : "outline"}
                  onClick={() => setSelectedCursoRegion("todos")}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Todos
                </Button>
                <Button
                  variant={selectedCursoRegion === "Federal" ? "default" : "outline"}
                  onClick={() => setSelectedCursoRegion("Federal")}
                >
                  Federal
                </Button>
                <Button
                  variant={selectedCursoRegion === "Goiás" ? "default" : "outline"}
                  onClick={() => setSelectedCursoRegion("Goiás")}
                >
                  GO
                </Button>
                <Button
                  variant={selectedCursoRegion === "Brasília" ? "default" : "outline"}
                  onClick={() => setSelectedCursoRegion("Brasília")}
                >
                  DF
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredCursos.map((curso) => (
                <Card
                  key={curso.id}
                  className="border-gray-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900 group-hover:text-purple-700 transition-colors">
                          {curso.titulo}
                        </CardTitle>
                        <CardDescription className="mt-1 text-gray-600">
                          {curso.plataforma}
                        </CardDescription>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-300 border">
                        {curso.status === "aberto" ? "Aberto" : "Previsto"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-3 mb-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-600">Area</p>
                          <p className="font-semibold text-gray-900 text-sm">{curso.area}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-600">Carga Horária</p>
                          <p className="font-semibold text-gray-900 text-sm">{curso.cargaHoraria}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-600">Certificado</p>
                          <p className="font-semibold text-gray-900 text-sm">Sim</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-purple-700 hover:bg-purple-50"
                    >
                      Inscrever-se
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>Dashboard de Inteligência e Oportunidades • Dados atualizados em tempo real</p>
          <p className="mt-2">Desenvolvido com ❤️ para ajudar você a tomar melhores decisões</p>
        </div>
      </footer>
    </div>
  );
}
