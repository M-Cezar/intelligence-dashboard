import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, ExternalLink, Lightbulb } from "lucide-react";
import { useRoute } from "wouter";

interface Noticia {
  id: string;
  titulo: string;
  categoria: string;
  data: string;
  resumo: string;
  conteudo: string;
  fonte: string;
  linkFonte: string;
}

const noticias: Record<string, Noticia> = {
  "1": {
    id: "1",
    titulo: "OpenAI lança GPT-5 com capacidades revolucionárias",
    categoria: "IA Generativa",
    data: "26/02/2026",
    resumo: "Novo modelo de linguagem com melhorias significativas em raciocínio e criatividade",
    conteudo:
      "A OpenAI anunciou o lançamento do GPT-5, seu modelo de linguagem mais avançado até o momento. O novo modelo apresenta melhorias significativas em raciocínio lógico, compreensão de contexto e capacidades criativas. Segundo a empresa, o GPT-5 é capaz de resolver problemas complexos com maior precisão e velocidade.",
    fonte: "OpenAI Blog",
    linkFonte: "https://openai.com",
  },
  "2": {
    id: "2",
    titulo: "Google desenvolve IA para previsão de terremotos",
    categoria: "IA Aplicada",
    data: "25/02/2026",
    resumo: "Novo sistema utiliza machine learning para prever terremotos com maior precisão",
    conteudo:
      "Pesquisadores do Google desenvolveram um novo sistema de IA que utiliza machine learning para prever terremotos com maior precisão. O sistema analisa dados sísmicos históricos e padrões geológicos para identificar possíveis epicentros.",
    fonte: "Google Research",
    linkFonte: "https://research.google.com",
  },
};

export default function NoticiaDetail() {
  const [match, params] = useRoute("/noticia/:id");

  if (!match) return null;

  const noticia = noticias[params?.id || ""];

  if (!noticia) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">Notícia não encontrada</p>
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
                <Badge className="mb-3" variant="outline">
                  <Lightbulb className="w-3 h-3 mr-1" />
                  {noticia.categoria}
                </Badge>
                <CardTitle className="text-3xl mb-2">{noticia.titulo}</CardTitle>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-4">
              <Calendar className="w-4 h-4 mr-2" />
              {noticia.data}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <p className="text-gray-700 font-medium">{noticia.resumo}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Conteúdo</h3>
              <p className="text-gray-700 leading-relaxed">{noticia.conteudo}</p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3">
                <strong>Fonte:</strong> {noticia.fonte}
              </p>
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ler Artigo Completo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
