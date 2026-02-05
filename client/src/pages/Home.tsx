import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  Brain
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

const ativos: Ativo[] = [
  { id: "1", ticker: "PETR4", nome: "Petrobras", preco: "R$ 38,50", variacao: 1.2, tipo: "acao" },
  { id: "2", ticker: "VALE3", nome: "Vale", preco: "R$ 65,20", variacao: -0.5, tipo: "acao" },
  { id: "3", ticker: "ITUB4", nome: "Itaú Unibanco", preco: "R$ 32,15", variacao: 0.8, tipo: "acao" },
  { id: "4", ticker: "KNRI11", nome: "Kinea Renda Imob", preco: "R$ 162,40", variacao: 0.3, tipo: "fii" },
  { id: "5", ticker: "HGLG11", nome: "CGHG Logística", preco: "R$ 165,10", variacao: -0.1, tipo: "fii" }
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

  const filteredConcursos = concursos.filter(c => {
    const matchRegion = selectedRegion === "todos" || c.regiao === selectedRegion;
    const matchSearch = c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.orgao.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRegion && matchSearch;
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
                <p className="text-sm text-gray-600">Concursos, IA & Investimentos</p>
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
          <div className="grid gap-6 md:grid-cols-3">
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
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="concursos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1">
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
          <TabsContent value="investimentos" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {ativos.map((ativo) => (
                <Card
                  key={ativo.id}
                  className="border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <CardHeader className="pb-2">
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
                  <CardContent>
                    <div className="space-y-3">
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
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Detalhes
                      </Button>
                    </div>
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
