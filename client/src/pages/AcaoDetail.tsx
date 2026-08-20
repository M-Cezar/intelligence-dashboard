import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, TrendingUp } from "lucide-react";
import { useRoute } from "wouter";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
  "1": { id: "1", ticker: "KLBN11", nome: "Klabin", preco: 37.5, variacao: 8.5, dy: 16.9, pvp: 1.2, descricao: "Empresa do setor de papel, celulose e embalagens.", dados: [{ data: "Jan", preco: 34.5 }, { data: "Fev", preco: 35.1 }, { data: "Mar", preco: 34.9 }, { data: "Abr", preco: 36.2 }, { data: "Mai", preco: 36.8 }, { data: "Jun", preco: 37.5 }] },
  "2": { id: "2", ticker: "DIRR3", nome: "Direcional", preco: 9.8, variacao: 12.3, dy: 24.26, pvp: 0.95, descricao: "Construtora brasileira com atuação no segmento residencial.", dados: [{ data: "Jan", preco: 8.7 }, { data: "Fev", preco: 9.0 }, { data: "Mar", preco: 9.2 }, { data: "Abr", preco: 9.4 }, { data: "Mai", preco: 9.6 }, { data: "Jun", preco: 9.8 }] },
  "3": { id: "3", ticker: "B3SA3", nome: "B3", preco: 16.45, variacao: 5.2, dy: 18.5, pvp: 1.45, descricao: "Operadora da bolsa de valores e de infraestruturas do mercado financeiro brasileiro.", dados: [{ data: "Jan", preco: 15.6 }, { data: "Fev", preco: 15.8 }, { data: "Mar", preco: 16.0 }, { data: "Abr", preco: 15.9 }, { data: "Mai", preco: 16.2 }, { data: "Jun", preco: 16.45 }] },
  "4": { id: "4", ticker: "BBSE3", nome: "BB Seguridade", preco: 23.1, variacao: 6.8, dy: 17.8, pvp: 1.6, descricao: "Holding de seguros, previdência e capitalização ligada ao Banco do Brasil.", dados: [{ data: "Jan", preco: 21.6 }, { data: "Fev", preco: 21.9 }, { data: "Mar", preco: 22.2 }, { data: "Abr", preco: 22.5 }, { data: "Mai", preco: 22.8 }, { data: "Jun", preco: 23.1 }] },
  "5": { id: "5", ticker: "JSLG3", nome: "JSL", preco: 28.3, variacao: 9.1, dy: 23.03, pvp: 1.29, descricao: "Companhia brasileira de serviços de logística e mobilidade.", dados: [{ data: "Jan", preco: 25.9 }, { data: "Fev", preco: 26.3 }, { data: "Mar", preco: 26.8 }, { data: "Abr", preco: 27.2 }, { data: "Mai", preco: 27.8 }, { data: "Jun", preco: 28.3 }] },
  "6": { id: "6", ticker: "GEPA4", nome: "Rio Paranapanema", preco: 6.2, variacao: 4.5, dy: 29.19, pvp: 1.85, descricao: "Companhia do setor de geração de energia elétrica.", dados: [{ data: "Jan", preco: 5.9 }, { data: "Fev", preco: 5.95 }, { data: "Mar", preco: 6.0 }, { data: "Abr", preco: 6.05 }, { data: "Mai", preco: 6.1 }, { data: "Jun", preco: 6.2 }] },
};

export default function AcaoDetail() {
  const [match, params] = useRoute("/acao/:id");
  if (!match) return null;

  const acao = acoes[params?.id || ""];
  if (!acao) {
    return (
      <div className="min-h-screen bg-gray-50 p-4"><div className="mx-auto max-w-4xl"><Button variant="ghost" onClick={() => window.history.back()} className="mb-6"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button><Card><CardContent className="pt-6"><p className="text-center text-gray-600">Ativo não encontrado</p></CardContent></Card></div></div>
    );
  }

  const financeUrl = `https://www.google.com/finance/quote/${encodeURIComponent(acao.ticker)}:BVMF`;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl">
        <Button variant="ghost" onClick={() => window.history.back()} className="mb-6"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Dashboard</Button>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div><div className="mb-2 flex flex-wrap items-center gap-2"><CardTitle className="text-3xl">{acao.ticker}</CardTitle><Badge variant="outline">{acao.nome}</Badge></div><p className="text-gray-600">{acao.descricao}</p></div>
              <Badge variant={acao.variacao >= 0 ? "default" : "destructive"}><TrendingUp className="mr-1 h-3 w-3" />{acao.variacao >= 0 ? "+" : ""}{acao.variacao.toFixed(2)}%</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="rounded-lg bg-blue-50 p-4"><p className="mb-1 text-sm text-gray-600">Preço da base</p><p className="text-2xl font-bold text-blue-700">R$ {acao.preco.toFixed(2)}</p></div>
              <div className="rounded-lg bg-green-50 p-4"><p className="mb-1 text-sm text-gray-600">Dividend Yield</p><p className="text-2xl font-bold text-green-700">{acao.dy.toFixed(2)}%</p></div>
              <div className="rounded-lg bg-purple-50 p-4"><p className="mb-1 text-sm text-gray-600">P/VP</p><p className="text-2xl font-bold text-purple-700">{acao.pvp.toFixed(2)}</p></div>
              <div className="rounded-lg bg-orange-50 p-4"><p className="mb-1 text-sm text-gray-600">Variação da base</p><p className="text-2xl font-bold text-orange-700">{acao.variacao >= 0 ? "+" : ""}{acao.variacao.toFixed(2)}%</p></div>
            </div>

            <div><h3 className="mb-1 text-lg font-semibold">Série local demonstrativa</h3><p className="mb-4 text-sm text-gray-500">Não representa cotação em tempo real.</p><ResponsiveContainer width="100%" height={300}><LineChart data={acao.dados}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="data" /><YAxis domain={["auto", "auto"]} /><Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} /><Line type="monotone" dataKey="preco" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} /></LineChart></ResponsiveContainer></div>

            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Indicadores financeiros desta versão são dados locais de demonstração. Consulte uma fonte de mercado antes de qualquer decisão de investimento.</div>

            <div className="border-t pt-4"><Button size="lg" className="w-full" onClick={() => window.open(financeUrl, "_blank", "noopener,noreferrer")}><ExternalLink className="mr-2 h-4 w-4" /> Consultar cotação externa</Button></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
