import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeSeriesDataPoint {
  date: string;
  value: number;
  type?: string;
}

interface CountMetricTimeSeriesProps {
  title: string;
  description?: string;
  data: TimeSeriesDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  valueFormatter?: (value: number) => string;
  customDateFormatter?: (date: string) => string;
  categories?: string[];
  showLegend?: boolean;
  defaultAggregation?: 'daily' | 'weekly' | 'monthly';
  hideAggregation?: boolean;
}

const CountMetricTimeSeries: React.FC<CountMetricTimeSeriesProps> = ({
  title,
  description,
  data,
  xAxisLabel,
  yAxisLabel,
  valueFormatter = (value) => value.toLocaleString(),
  customDateFormatter,
  categories,
  showLegend = false,
  defaultAggregation = 'monthly',
  hideAggregation = false,
}) => {
  const [aggregation, setAggregation] = useState<'daily' | 'weekly' | 'monthly'>(defaultAggregation);

  const aggregateData = (rawData: TimeSeriesDataPoint[]) => {
    if (!rawData.length) return [];

    const aggregatedMap = new Map<string, { [key: string]: number }>();

    rawData.forEach(point => {
      let key: string;
      const date = new Date(point.date);

      if (aggregation === 'daily') {
        key = point.date;
      } else if (aggregation === 'weekly') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!aggregatedMap.has(key)) {
        aggregatedMap.set(key, {});
      }

      const entry = aggregatedMap.get(key)!;
      const category = point.type || 'value';
      entry[category] = (entry[category] || 0) + point.value;
    });

    return Array.from(aggregatedMap.entries())
      .map(([date, values]) => ({
        date,
        ...values
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const aggregatedData = aggregateData(data);

  const formatDate = (date: string) => {
    if (customDateFormatter) return customDateFormatter(date);

    const d = new Date(date);
    if (aggregation === 'daily') {
      return d.toLocaleDateString();
    } else if (aggregation === 'weekly') {
      return `Week of ${d.toLocaleDateString()}`;
    } else {
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
    }
  };

  const colors = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#eab308'];

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-medium">{title}</CardTitle>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {!hideAggregation && (
          <Select
            value={aggregation}
            onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setAggregation(value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select aggregation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={aggregatedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -10 } : undefined}
              />
              <YAxis
                tickFormatter={valueFormatter}
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
              />
              <Tooltip
                formatter={valueFormatter}
                labelFormatter={formatDate}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  color: 'hsl(var(--popover-foreground))'
                }}
                itemStyle={{
                  color: 'hsl(var(--popover-foreground))'
                }}
                labelStyle={{
                  color: 'hsl(var(--popover-foreground))'
                }}
              />
              {showLegend && <Legend />}
              {categories ? (
                categories.map((category, index) => (
                  <Line
                    key={category}
                    type="monotone"
                    dataKey={category}
                    stroke={colors[index % colors.length]}
                    dot={false}
                  />
                ))
              ) : (
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={colors[0]}
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountMetricTimeSeries; 