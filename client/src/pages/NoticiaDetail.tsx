import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    titulo: "OpenAI vs Anthropic: O duelo no Super Bowl",
    categoria: "IA",
    data: "Base local",
    resumo: "As gigantes da IA levam a disputa para o horário nobre da TV americana.",
    conteudo: "Registro local incluído no protótipo do Intelligence Dashboard para validar a navegação, a leitura detalhada e a abertura da fonte. A integração com notícias em tempo real será adicionada na etapa de dados ao vivo.",
    fonte: "Olhar Digital",
    linkFonte: "https://olhardigital.com.br/",
  },
  "2": {
    id: "2",
    titulo: "Especialistas de IA ganham milhões na Microsoft",
    categoria: "Tecnologia",
    data: "Base local",
    resumo: "Registro sobre remuneração de especialistas de IA em grandes empresas de tecnologia.",
    conteudo: "Registro local usado para validar a estrutura de notícias do aplicativo. O conteúdo ao vivo deverá ser obtido diretamente de fontes externas com data, URL e horário de atualização.",
    fonte: "Exame",
    linkFonte: "https://exame.com/",
  },
  "3": {
    id: "3",
    titulo: "Moltbook: A rede social exclusiva para IAs",
    categoria: "IA",
    data: "Base local",
    resumo: "Nova plataforma gera debates sobre o futuro da interação entre máquinas.",
    conteudo: "Registro local usado para testar a página detalhada e a navegação da seção IA & Tech. Nesta versão, a fonte deve ser consultada para validação do conteúdo e atualização.",
    fonte: "BBC News Brasil",
    linkFonte: "https://www.bbc.com/portuguese",
  },
  "4": {
    id: "4",
    titulo: "Por que a maioria das iniciativas de IA corporativa fracassa",
    categoria: "Tecnologia",
    data: "Base local",
    resumo: "Análise sobre desafios de implementação de inteligência artificial em empresas.",
    conteudo: "Registro local incluído para completar a navegação da seção de tecnologia. O produto final deverá armazenar fonte, data de publicação, data de coleta e link original para cada notícia.",
    fonte: "InfoMoney",
    linkFonte: "https://www.infomoney.com.br/",
  },
};

export default function NoticiaDetail() {
  const [match, params] = useRoute("/noticia/:id");
  if (!match) return null;

  const noticia = noticias[params?.id || ""];
  if (!noticia) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-4xl">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-6"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>
          <Card><CardContent className="pt-6"><p className="text-center text-gray-600">Notícia não encontrada</p></CardContent></Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl">
        <Button variant="ghost" onClick={() => window.history.back()} className="mb-6"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Dashboard</Button>
        <Card className="mb-6">
          <CardHeader>
            <Badge className="mb-3 w-fit" variant="outline"><Lightbulb className="mr-1 h-3 w-3" /> {noticia.categoria}</Badge>
            <CardTitle className="mb-2 text-2xl sm:text-3xl">{noticia.titulo}</CardTitle>
            <div className="mt-4 flex items-center text-sm text-gray-600"><Calendar className="mr-2 h-4 w-4" /> {noticia.data}</div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded border-l-4 border-blue-600 bg-blue-50 p-4"><p className="font-medium text-gray-700">{noticia.resumo}</p></div>
            <div><h3 className="mb-3 text-lg font-semibold">Contexto</h3><p className="leading-relaxed text-gray-700">{noticia.conteudo}</p></div>
            <div className="border-t pt-4">
              <p className="mb-3 text-sm text-gray-600"><strong>Fonte:</strong> {noticia.fonte}</p>
              <Button size="lg" className="w-full" onClick={() => window.open(noticia.linkFonte, "_blank", "noopener,noreferrer")}><ExternalLink className="mr-2 h-4 w-4" /> Abrir fonte</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
