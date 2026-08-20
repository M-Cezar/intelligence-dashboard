import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Award, BookOpen, Clock, ExternalLink, MapPin } from "lucide-react";
import { useRoute } from "wouter";

interface Curso {
  id: string;
  titulo: string;
  plataforma: string;
  area: string;
  cargaHoraria: string;
  certificacao: boolean;
  regiao: string;
  nivel: "Iniciante" | "Intermediário" | "Avançado";
  status: "Aberto" | "Previsto" | "Fechado";
  descricao: string;
  linkInscricao: string;
}

const cursos: Record<string, Curso> = {
  "1": { id: "1", titulo: "Liderança Estratégica com IA na Administração Pública", plataforma: "Escola Virtual de Governo", area: "Gestão Pública", cargaHoraria: "30h", certificacao: true, regiao: "Federal", nivel: "Intermediário", status: "Aberto", descricao: "Formação voltada ao uso estratégico de inteligência artificial, liderança e transformação de processos no setor público.", linkInscricao: "https://www.escolavirtual.gov.br/catalogo" },
  "2": { id: "2", titulo: "Transformação Digital e Governo Eletrônico", plataforma: "Aprenda Mais (MEC)", area: "Tecnologia", cargaHoraria: "40h", certificacao: true, regiao: "Federal", nivel: "Iniciante", status: "Aberto", descricao: "Introdução aos fundamentos de transformação digital, serviços públicos digitais e modernização da administração.", linkInscricao: "https://aprendamais.mec.gov.br/" },
  "3": { id: "3", titulo: "Gestão de Pessoas e Desenvolvimento de Equipes", plataforma: "Escola de Governo - Goiás", area: "Gestão", cargaHoraria: "30h", certificacao: true, regiao: "Goiás", nivel: "Intermediário", status: "Aberto", descricao: "Curso sobre gestão de pessoas, desenvolvimento de equipes, liderança e competências aplicadas ao setor público.", linkInscricao: "https://goias.gov.br/escoladegoverno/cursos-ead/" },
  "4": { id: "4", titulo: "Direitos Humanos e Cidadania", plataforma: "Escola Virtual de Governo", area: "Direitos Humanos", cargaHoraria: "20h", certificacao: true, regiao: "Federal", nivel: "Iniciante", status: "Aberto", descricao: "Formação introdutória sobre direitos humanos, cidadania, inclusão e políticas públicas.", linkInscricao: "https://www.escolavirtual.gov.br/catalogo" },
  "5": { id: "5", titulo: "Segurança Digital e Proteção de Dados (LGPD)", plataforma: "Aprenda Mais (MEC)", area: "Tecnologia", cargaHoraria: "25h", certificacao: true, regiao: "Federal", nivel: "Intermediário", status: "Aberto", descricao: "Conteúdo sobre segurança digital, privacidade e princípios de proteção de dados pessoais conforme a LGPD.", linkInscricao: "https://aprendamais.mec.gov.br/" },
  "6": { id: "6", titulo: "Empreendedorismo e Gestão de Negócios", plataforma: "SEBRAE", area: "Negócios", cargaHoraria: "15h", certificacao: true, regiao: "Brasília", nivel: "Iniciante", status: "Aberto", descricao: "Fundamentos de empreendedorismo, planejamento, gestão e desenvolvimento de negócios.", linkInscricao: "https://www.sebrae.com.br/sites/PortalSebrae/cursos" },
  "7": { id: "7", titulo: "Gestão de Crises no Setor Público", plataforma: "Escola Virtual de Governo", area: "Gestão Pública", cargaHoraria: "30h", certificacao: true, regiao: "Federal", nivel: "Avançado", status: "Aberto", descricao: "Formação sobre preparação, resposta, comunicação e tomada de decisão em cenários de crise na administração pública.", linkInscricao: "https://www.escolavirtual.gov.br/catalogo" },
  "8": { id: "8", titulo: "Educação Inclusiva e Acessibilidade", plataforma: "EGOV Virtual - DF", area: "Educação", cargaHoraria: "20h", certificacao: true, regiao: "Brasília", nivel: "Iniciante", status: "Previsto", descricao: "Conteúdo voltado à inclusão, acessibilidade e práticas educacionais para diferentes necessidades.", linkInscricao: "https://egovvirtual.df.gov.br/" },
};

export default function CursoDetail() {
  const [match, params] = useRoute("/curso/:id");
  if (!match) return null;

  const curso = cursos[params?.id || ""];
  if (!curso) {
    return (
      <div className="min-h-screen bg-gray-50 p-4"><div className="mx-auto max-w-4xl"><Button variant="ghost" onClick={() => window.history.back()} className="mb-6"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button><Card><CardContent className="pt-6"><p className="text-center text-gray-600">Curso não encontrado</p></CardContent></Card></div></div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl">
        <Button variant="ghost" onClick={() => window.history.back()} className="mb-6"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Dashboard</Button>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div><CardTitle className="mb-2 text-2xl sm:text-3xl">{curso.titulo}</CardTitle><p className="text-gray-600">{curso.plataforma}</p></div>
              <Badge variant={curso.status === "Aberto" ? "default" : "secondary"}>{curso.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
              <div className="flex items-center gap-3"><BookOpen className="h-5 w-5 text-blue-600" /><div><p className="text-sm text-gray-600">Área</p><p className="font-semibold">{curso.area}</p></div></div>
              <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-orange-600" /><div><p className="text-sm text-gray-600">Carga</p><p className="font-semibold">{curso.cargaHoraria}</p></div></div>
              <div className="flex items-center gap-3"><Award className="h-5 w-5 text-green-600" /><div><p className="text-sm text-gray-600">Certificado</p><p className="font-semibold">{curso.certificacao ? "Sim" : "Não"}</p></div></div>
              <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-purple-600" /><div><p className="text-sm text-gray-600">Região</p><p className="font-semibold">{curso.regiao}</p></div></div>
              <div><p className="text-sm text-gray-600">Nível</p><p className="font-semibold">{curso.nivel}</p></div>
            </div>

            <div><h3 className="mb-2 text-lg font-semibold">Sobre o curso</h3><p className="text-gray-700">{curso.descricao}</p></div>
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Disponibilidade, carga horária e certificação podem mudar. Confirme sempre na plataforma oficial.</div>
            <div className="border-t pt-4"><Button size="lg" className="w-full" onClick={() => window.open(curso.linkInscricao, "_blank", "noopener,noreferrer")}><ExternalLink className="mr-2 h-4 w-4" /> Abrir plataforma oficial</Button></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
