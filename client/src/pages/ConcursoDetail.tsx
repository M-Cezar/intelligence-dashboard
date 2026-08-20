import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, DollarSign, ExternalLink, MapPin, Users } from "lucide-react";
import { useRoute } from "wouter";

interface Concurso {
  id: string;
  titulo: string;
  instituicao: string;
  vagas: number;
  salario: string;
  inscricoes: string;
  regiao: "Federal" | "DF" | "GO";
  status: "Aberto" | "Urgente" | "Previsto";
  fonteUrl: string;
}

const concursos: Record<string, Concurso> = {
  "1": {
    id: "1",
    titulo: "Câmara dos Deputados - Policial Legislativo",
    instituicao: "Câmara dos Deputados",
    vagas: 80,
    salario: "R$ 23.703,47",
    inscricoes: "até 20/02/2026",
    regiao: "Federal",
    status: "Aberto",
    fonteUrl: "https://www.camara.leg.br/",
  },
  "2": {
    id: "2",
    titulo: "PMDF - Oficial",
    instituicao: "Polícia Militar do Distrito Federal",
    vagas: 147,
    salario: "até R$ 21.211,89",
    inscricoes: "04/02 a 06/03/2026",
    regiao: "DF",
    status: "Aberto",
    fonteUrl: "https://www.pmdf.df.gov.br/",
  },
  "3": {
    id: "3",
    titulo: "Diplomata (CACD)",
    instituicao: "Ministério das Relações Exteriores",
    vagas: 60,
    salario: "R$ 22.558,56",
    inscricoes: "04 a 25/02/2026",
    regiao: "Federal",
    status: "Aberto",
    fonteUrl: "https://www.gov.br/mre/pt-br/instituto-rio-branco/carreira-de-diplomata/cacd",
  },
  "4": {
    id: "4",
    titulo: "VALEC Engenharia",
    instituicao: "VALEC",
    vagas: 65,
    salario: "R$ 10.800,82",
    inscricoes: "até 04/02/2026",
    regiao: "Federal",
    status: "Urgente",
    fonteUrl: "https://www.infrasa.gov.br/",
  },
  "5": {
    id: "5",
    titulo: "Assembleia Legislativa - Goiás",
    instituicao: "Assembleia Legislativa do Estado de Goiás",
    vagas: 120,
    salario: "R$ 8.500,00",
    inscricoes: "até 08/02/2026",
    regiao: "GO",
    status: "Urgente",
    fonteUrl: "https://portal.al.go.leg.br/",
  },
};

export default function ConcursoDetail() {
  const [match, params] = useRoute("/concurso/:id");
  if (!match) return null;

  const concurso = concursos[params?.id || ""];
  if (!concurso) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-4xl">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <Card><CardContent className="pt-6"><p className="text-center text-gray-600">Concurso não encontrado</p></CardContent></Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl">
        <Button variant="ghost" onClick={() => window.history.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Dashboard
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="mb-2 text-2xl sm:text-3xl">{concurso.titulo}</CardTitle>
                <p className="text-gray-600">{concurso.instituicao}</p>
              </div>
              <Badge variant={concurso.status === "Aberto" ? "default" : "destructive"}>{concurso.status}</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="flex items-center gap-3"><Users className="h-5 w-5 text-blue-600" /><div><p className="text-sm text-gray-600">Vagas</p><p className="font-semibold">{concurso.vagas}</p></div></div>
              <div className="flex items-center gap-3"><DollarSign className="h-5 w-5 text-green-600" /><div><p className="text-sm text-gray-600">Salário</p><p className="font-semibold">{concurso.salario}</p></div></div>
              <div className="flex items-center gap-3"><Calendar className="h-5 w-5 text-orange-600" /><div><p className="text-sm text-gray-600">Inscrições</p><p className="text-sm font-semibold">{concurso.inscricoes}</p></div></div>
              <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-purple-600" /><div><p className="text-sm text-gray-600">Região</p><p className="font-semibold">{concurso.regiao}</p></div></div>
            </div>

            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              Os dados desta versão são uma base local de referência. Confirme situação, prazo e edital na fonte oficial antes de tomar qualquer decisão.
            </div>

            <div className="border-t pt-4">
              <Button size="lg" className="w-full" onClick={() => window.open(concurso.fonteUrl, "_blank", "noopener,noreferrer")}>
                <ExternalLink className="mr-2 h-4 w-4" /> Abrir fonte oficial
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
