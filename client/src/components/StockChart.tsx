import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface StockChartProps {
  ticker: string;
  data: Array<{
    date: string;
    price: number;
  }>;
  color?: string;
}

export function StockChart({ ticker, data, color = "#3b82f6" }: StockChartProps) {
  const validData = data.filter(item => Number.isFinite(item.price));

  if (validData.length === 0) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center rounded-md border border-dashed text-sm text-gray-500">
        Sem dados válidos para {ticker}
      </div>
    );
  }

  const prices = validData.map(item => item.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const firstPrice = validData[0].price;
  const lastPrice = validData[validData.length - 1].price;
  const percentChange = firstPrice === 0 ? 0 : ((lastPrice - firstPrice) / firstPrice) * 100;
  const yPadding = minPrice === maxPrice ? Math.max(Math.abs(minPrice) * 0.05, 1) : 0;
  const yMin = minPrice === maxPrice ? minPrice - yPadding : minPrice * 0.95;
  const yMax = minPrice === maxPrice ? maxPrice + yPadding : maxPrice * 1.05;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-gray-600">{ticker}</span>
        <span className={`text-xs font-semibold ${percentChange >= 0 ? "text-emerald-600" : "text-red-600"}`}>
          {percentChange >= 0 ? "+" : ""}{percentChange.toFixed(2)}%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={validData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            tickFormatter={(date) => {
              const d = new Date(date);
              return Number.isNaN(d.getTime()) ? String(date) : `${d.getMonth() + 1}/${d.getDate()}`;
            }}
            interval={Math.max(0, Math.floor(validData.length / 4))}
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: `1px solid ${color}`,
              borderRadius: "6px",
              padding: "8px",
            }}
            formatter={(value) => `R$ ${(value as number).toFixed(2)}`}
            labelFormatter={(label) => {
              const d = new Date(label);
              return Number.isNaN(d.getTime()) ? String(label) : d.toLocaleDateString("pt-BR");
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
