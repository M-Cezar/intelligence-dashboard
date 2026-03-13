import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, DollarSign, Percent } from "lucide-react";
import { useRoute } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Acao {
  id: string;
  ticker: string;
  nome: string;
  preco: number;
  variacao: number;
  dy: number;
  pvp: number;
  descricao: string;
  dados: Array<{ data: string; preco: number }>;
}

const acoes: Record<string, Acao> = {
  "1": {
    id: "1",
    ticker: "KLBN11",
    nome: "Klabin",
    preco: 37.5,
    variacao: 40.79,
    dy: 16.9,
    pvp: 1.2,
    descricao: "Empresa de papel e celulose, uma das maiores do Brasil",
    dados: [
      { data: "Jan", preco: 26.5 },
      { data: "Fev", preco: 28.2 },
      { data: "Mar", preco: 30.1 },
      { data: "Abr", preco: 32.5 },
      { data: "Mai", preco: 34.8 },
      { data: "Jun", preco: 37.5 },
    ],
  },
  "2": {
    id: "2",
    ticker: "DIRR3",
    nome: "Direcional Engenharia",
    preco: 9.2,
    variacao: 52.3,
    dy: 24.26,
    pvp: 0.95,
    descricao: "Construtora com foco em imóveis residenciais",
    dados: [
      { data: "Jan", preco: 6.0 },
      { data: "Fev", preco: 6.8 },
      { data: "Mar", preco: 7.5 },
      { data: "Abr", preco: 8.2 },
      { data: "Mai", preco: 8.8 },
      { data: "Jun", preco: 9.2 },
    ],
  },
};

export default function AcaoDetail() {
  const [match, params] = useRoute("/acao/:id");

  if (!match) return null;

  const acao = acoes[params?.id || ""];

  if (!acao) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">Ação não encontrada</p>
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
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-3xl">{acao.ticker}</CardTitle>
                  <Badge variant="outline">{acao.nome}</Badge>
                </div>
                <p className="text-gray-600">{acao.descricao}</p>
              </div>
              <Badge variant={acao.variacao > 0 ? "default" : "destructive"}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {acao.variacao > 0 ? "+" : ""}{acao.variacao.toFixed(2)}%
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Preço Atual</p>
                <p className="text-2xl font-bold text-blue-600">R$ {acao.preco.toFixed(2)}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Dividend Yield</p>
                <p className="text-2xl font-bold text-green-600">{acao.dy}%</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">P/VP</p>
                <p className="text-2xl font-bold text-purple-600">{acao.pvp}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Variação 1 Ano</p>
                <p className="text-2xl font-bold text-orange-600">+{acao.variacao.toFixed(2)}%</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Gráfico de Preço - 1 Ano</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={acao.dados}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`} />
                  <Line
                    type="monotone"
                    dataKey="preco"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-4 border-t">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                <DollarSign className="w-4 h-4 mr-2" />
                Investir Agora
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
