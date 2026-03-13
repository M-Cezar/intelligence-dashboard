import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StockChartProps {
  ticker: string;
  data: Array<{
    date: string;
    price: number;
  }>;
  color?: string;
}

export function StockChart({ ticker, data, color = '#3b82f6' }: StockChartProps) {
  const minPrice = Math.min(...data.map(d => d.price));
  const maxPrice = Math.max(...data.map(d => d.price));
  const priceChange = data[data.length - 1].price - data[0].price;
  const percentChange = ((priceChange / data[0].price) * 100).toFixed(2);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-gray-600">{ticker}</span>
        <span className={`text-xs font-semibold ${parseFloat(percentChange) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          {parseFloat(percentChange) >= 0 ? '+' : ''}{percentChange}%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            tickFormatter={(date) => {
              const d = new Date(date);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
            interval={Math.floor(data.length / 4)}
          />
          <YAxis
            domain={[minPrice * 0.95, maxPrice * 1.05]}
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: `1px solid ${color}`,
              borderRadius: '6px',
              padding: '8px'
            }}
            formatter={(value) => `R$ ${(value as number).toFixed(2)}`}
            labelFormatter={(label) => {
              const d = new Date(label);
              return d.toLocaleDateString('pt-BR');
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
