import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, BookOpen, Award, ExternalLink } from "lucide-react";
import { useRoute } from "wouter";

interface Curso {
  id: string;
  titulo: string;
  plataforma: string;
  area: string;
  cargaHoraria: string;
  certificacao: boolean;
  regiao: string;
  status: "Aberto" | "Previsto";
  descricao: string;
  linkInscricao: string;
}

const cursos: Record<string, Curso> = {
  "1": {
    id: "1",
    titulo: "Gestão de Pessoas e Desenvolvimento de Equipes",
    plataforma: "Escola de Governo - Goiás",
    area: "Gestão",
    cargaHoraria: "30h",
    certificacao: true,
    regiao: "Goiás",
    status: "Aberto",
    descricao:
      "Curso sobre gestão de pessoas, desenvolvimento de equipes e liderança no setor público. Aprenda técnicas modernas de gestão e desenvolvimento de competências.",
    linkInscricao: "https://goias.gov.br",
  },
  "2": {
    id: "2",
    titulo: "Direitos Humanos e Cidadania",
    plataforma: "Escola Virtual de Governo",
    area: "Direitos Humanos",
    cargaHoraria: "20h",
    certificacao: true,
    regiao: "Federal",
    status: "Aberto",
    descricao:
      "Curso sobre direitos humanos, cidadania e inclusão social. Conheça os marcos legais e as políticas públicas de proteção aos direitos fundamentais.",
    linkInscricao: "https://www.escolavirtual.gov.br",
  },
};

export default function CursoDetail() {
  const [match, params] = useRoute("/curso/:id");

  if (!match) return null;

  const curso = cursos[params?.id || ""];

  if (!curso) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">Curso não encontrado</p>
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
                <CardTitle className="text-3xl mb-2">{curso.titulo}</CardTitle>
                <p className="text-gray-600">{curso.plataforma}</p>
              </div>
              <Badge variant={curso.status === "Aberto" ? "default" : "secondary"}>
                {curso.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Área</p>
                  <p className="font-semibold">{curso.area}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Carga Horária</p>
                  <p className="font-semibold">{curso.cargaHoraria}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Certificação</p>
                  <p className="font-semibold">{curso.certificacao ? "Sim" : "Não"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-sm text-gray-600">Região</p>
                  <p className="font-semibold">{curso.regiao}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Sobre o Curso</h3>
              <p className="text-gray-700">{curso.descricao}</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <p className="text-sm text-gray-700">
                <strong>Público-alvo:</strong> Servidores públicos, estudantes e profissionais interessados em desenvolvimento.
              </p>
            </div>

            <div className="pt-4 border-t">
              <Button 
                size="lg" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => window.open(curso.linkInscricao, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Inscrever-se Agora
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
