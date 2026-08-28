import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, BookOpen, Brain, Briefcase, Search, TrendingUp } from "lucide-react";

type Item = { id: string; title: string; subtitle: string; meta: string; badge: string };

const concursos: Item[] = [
  { id: "1", title: "Câmara dos Deputados - Policial Legislativo", subtitle: "Câmara dos Deputados", meta: "80 vagas • R$ 23.703,47", badge: "Federal" },
  { id: "2", title: "PMDF - Oficial", subtitle: "Polícia Militar do Distrito Federal", meta: "147 vagas • até R$ 21.211,89", badge: "Brasília" },
  { id: "3", title: "Diplomata (CACD)", subtitle: "Ministério das Relações Exteriores", meta: "60 vagas • R$ 22.558,56", badge: "Federal" },
  { id: "4", title: "VALEC Engenharia", subtitle: "Infra S.A.", meta: "65 vagas • R$ 10.800,82", badge: "Federal" },
  { id: "5", title: "Assembleia Legislativa - Goiás", subtitle: "ALEGO", meta: "120 vagas • R$ 8.500,00", badge: "Goiás" },
];

const noticias: Item[] = [
  { id: "1", title: "OpenAI vs Anthropic: disputa no mercado de IA", subtitle: "IA", meta: "Base local para validação", badge: "IA" },
  { id: "2", title: "Especialistas de IA e o mercado de tecnologia", subtitle: "Tecnologia", meta: "Base local para validação", badge: "Tech" },
  { id: "3", title: "Novas redes e agentes de inteligência artificial", subtitle: "IA", meta: "Base local para validação", badge: "IA" },
  { id: "4", title: "Desafios da IA corporativa", subtitle: "Tecnologia", meta: "Base local para validação", badge: "Tech" },
];

const ativos: Item[] = [
  { id: "1", title: "KLBN11", subtitle: "Klabin", meta: "R$ 37,50 • DY 16,90%", badge: "Ação" },
  { id: "2", title: "DIRR3", subtitle: "Direcional", meta: "R$ 9,80 • DY 24,26%", badge: "Ação" },
  { id: "3", title: "B3SA3", subtitle: "B3", meta: "R$ 16,45 • DY 18,50%", badge: "Ação" },
  { id: "4", title: "BBSE3", subtitle: "BB Seguridade", meta: "R$ 23,10 • DY 17,80%", badge: "Ação" },
  { id: "5", title: "JSLG3", subtitle: "JSL", meta: "R$ 28,30 • DY 23,03%", badge: "Ação" },
  { id: "6", title: "GEPA4", subtitle: "Rio Paranapanema", meta: "R$ 6,20 • DY 29,19%", badge: "Ação" },
];

const cursos: Item[] = [
  { id: "1", title: "Liderança Estratégica com IA na Administração Pública", subtitle: "Escola Virtual de Governo", meta: "30h • Certificado", badge: "Gestão Pública" },
  { id: "2", title: "Transformação Digital e Governo Eletrônico", subtitle: "Aprenda Mais (MEC)", meta: "40h • Certificado", badge: "Tecnologia" },
  { id: "3", title: "Gestão de Pessoas e Desenvolvimento de Equipes", subtitle: "Escola de Governo - Goiás", meta: "30h • Certificado", badge: "Gestão" },
  { id: "4", title: "Direitos Humanos e Cidadania", subtitle: "Escola Virtual de Governo", meta: "20h • Certificado", badge: "Direitos Humanos" },
  { id: "5", title: "Segurança Digital e Proteção de Dados (LGPD)", subtitle: "Aprenda Mais (MEC)", meta: "25h • Certificado", badge: "Tecnologia" },
  { id: "6", title: "Empreendedorismo e Gestão de Negócios", subtitle: "SEBRAE", meta: "15h • Certificado", badge: "Negócios" },
  { id: "7", title: "Gestão de Crises no Setor Público", subtitle: "Escola Virtual de Governo", meta: "30h • Certificado", badge: "Gestão Pública" },
  { id: "8", title: "Educação Inclusiva e Acessibilidade", subtitle: "EGOV Virtual - DF", meta: "20h • Certificado", badge: "Educação" },
];

function ItemGrid({ items, path }: { items: Item[]; path: string }) {
  const [, navigate] = useLocation();
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map(item => (
        <Card key={item.id} className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => navigate(`/${path}/${item.id}`)}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-base leading-snug">{item.title}</CardTitle>
              <Badge variant="secondary">{item.badge}</Badge>
            </div>
            <CardDescription>{item.subtitle}</CardDescription>
          </CardHeader>
          <CardContent><p className="text-sm text-slate-700">{item.meta}</p></CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function Home() {
  const { user, isNative, logout } = useAuth();
  const [search, setSearch] = useState("");
  const filter = (items: Item[]) => items.filter(item => `${item.title} ${item.subtitle} ${item.meta} ${item.badge}`.toLowerCase().includes(search.toLowerCase()));
  const counts = useMemo(() => ({ concursos: concursos.length, noticias: noticias.length, ativos: ativos.length, cursos: cursos.length }), []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold">Intelligence Dashboard</h1>
            <p className="text-sm text-slate-600">Informações centralizadas para consulta e análise</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-600">{user?.name || (isNative ? "Modo local" : "Usuário")}</span>
            {!isNative && user ? <Button variant="outline" size="sm" onClick={() => void logout()}>Sair</Button> : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card><CardContent className="flex items-center gap-3 p-4"><Briefcase className="h-5 w-5"/><div><p className="text-2xl font-bold">{counts.concursos}</p><p className="text-xs text-slate-600">Concursos</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-3 p-4"><Brain className="h-5 w-5"/><div><p className="text-2xl font-bold">{counts.noticias}</p><p className="text-xs text-slate-600">IA & Tech</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-3 p-4"><TrendingUp className="h-5 w-5"/><div><p className="text-2xl font-bold">{counts.ativos}</p><p className="text-xs text-slate-600">Investimentos</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-3 p-4"><Award className="h-5 w-5"/><div><p className="text-2xl font-bold">{counts.cursos}</p><p className="text-xs text-slate-600">Cursos</p></div></CardContent></Card>
        </section>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Pesquisar em todos os módulos..." className="pl-9" />
        </div>

        <Tabs defaultValue="concursos" className="space-y-5">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4">
            <TabsTrigger value="concursos"><Briefcase className="mr-2 h-4 w-4"/>Concursos</TabsTrigger>
            <TabsTrigger value="noticias"><Brain className="mr-2 h-4 w-4"/>IA & Tech</TabsTrigger>
            <TabsTrigger value="ativos"><TrendingUp className="mr-2 h-4 w-4"/>Investimentos</TabsTrigger>
            <TabsTrigger value="cursos"><BookOpen className="mr-2 h-4 w-4"/>Cursos</TabsTrigger>
          </TabsList>
          <TabsContent value="concursos"><ItemGrid items={filter(concursos)} path="concurso" /></TabsContent>
          <TabsContent value="noticias"><ItemGrid items={filter(noticias)} path="noticia" /></TabsContent>
          <TabsContent value="ativos"><ItemGrid items={filter(ativos)} path="acao" /></TabsContent>
          <TabsContent value="cursos"><ItemGrid items={filter(cursos)} path="curso" /></TabsContent>
        </Tabs>
      </main>

      <footer className="mt-12 border-t bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-slate-500">
          Intelligence Dashboard • Base local para validação; confirme dados nas fontes oficiais
        </div>
      </footer>
    </div>
  );
}
