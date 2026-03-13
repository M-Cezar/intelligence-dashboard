import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Users, DollarSign, Calendar, ExternalLink } from "lucide-react";
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
  },
  "2": {
    id: "2",
    titulo: "PMDF - Oficial",
    instituicao: "Polícia Militar do DF",
    vagas: 147,
    salario: "até R$ 21.211,89",
    inscricoes: "04/02 a 06/03/2026",
    regiao: "DF",
    status: "Aberto",
  },
};

export default function ConcursoDetail() {
  const [match, params] = useRoute("/concurso/:id");

  if (!match) return null;

  const concurso = concursos[params?.id || ""];

  if (!concurso) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">Concurso não encontrado</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => window.history.back()} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">{concurso.titulo}</CardTitle>
                <p className="text-gray-600">{concurso.instituicao}</p>
              </div>
              <Badge variant={concurso.status === "Aberto" ? "default" : "destructive"}>
                {concurso.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Vagas</p>
                  <p className="font-semibold">{concurso.vagas}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Salário</p>
                  <p className="font-semibold">{concurso.salario}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Inscrições</p>
                  <p className="font-semibold text-sm">{concurso.inscricoes}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Região</p>
                  <p className="font-semibold">{concurso.regiao}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ir para Inscrição
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
