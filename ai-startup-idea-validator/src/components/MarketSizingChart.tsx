import React from "react";
import { MarketSizeDetail } from "../types";
import { DollarSign, Landmark, Globe, Compass, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface MarketSizingChartProps {
  marketSize: {
    tam: MarketSizeDetail;
    sam: MarketSizeDetail;
    som: MarketSizeDetail;
  };
  currencySymbol?: string;
}

// Utility to parse market sizing string values into numbers for plotting
function parseMarketValue(valStr: string): number {
  if (!valStr) return 0;
  
  // Find first multiplier indicator in the original string
  const multiplierMatch = valStr.match(/(BILLION|MILLION|THOUSAND|TRILLION|B|M|K|T)/i);
  let multiplier = 1;
  if (multiplierMatch) {
    const term = multiplierMatch[1].toUpperCase();
    if (term === "BILLION" || term === "B") {
      multiplier = 1_000_000_000;
    } else if (term === "MILLION" || term === "M") {
      multiplier = 1_000_000;
    } else if (term === "TRILLION" || term === "T") {
      multiplier = 1_000_000_000_000;
    } else if (term === "THOUSAND" || term === "K") {
      multiplier = 1_000;
    }
  }
  
  // Clean up all non-numeric and non-sign/dot characters for parsing
  const clean = valStr.replace(/[^0-9.+-]/g, "");
  const numberMatch = clean.match(/^[+-]?([0-9]*\.[0-9]+|[0-9]+)/);
  if (numberMatch) {
    return parseFloat(numberMatch[0]) * multiplier;
  }
  return 0;
}

export default function MarketSizingChart({ marketSize, currencySymbol = "$" }: MarketSizingChartProps) {
  const { tam, sam, som } = marketSize;

  const formatValueShort = (value: number) => {
    if (value >= 1_000_000_000_000) return `${currencySymbol}${(value / 1_000_000_000_000).toFixed(1)}T`;
    if (value >= 1_000_000_000) return `${currencySymbol}${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${currencySymbol}${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${currencySymbol}${(value / 1_000).toFixed(1)}K`;
    return `${currencySymbol}${value}`;
  };

  // Compile data for Recharts
  const chartData = [
    {
      name: "TAM",
      fullName: "Total Addressable Market",
      rawString: tam.value,
      value: parseMarketValue(tam.value),
      color: "#2563eb", // Blue-600
      definition: tam.definition,
    },
    {
      name: "SAM",
      fullName: "Serviceable Addressable Market",
      rawString: sam.value,
      value: parseMarketValue(sam.value),
      color: "#0d9488", // Teal-600
      definition: sam.definition,
    },
    {
      name: "SOM",
      fullName: "Serviceable Obtainable Market",
      rawString: som.value,
      value: parseMarketValue(som.value),
      color: "#7c3aed", // Violet-600
      definition: som.definition,
    },
  ];

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800 shadow-xl text-left text-xs max-w-xs space-y-1.5">
          <p className="font-bold text-slate-200 uppercase tracking-widest text-[9px]">
            {data.fullName}
          </p>
          <p className="font-black text-base text-white">
            {data.rawString}
          </p>
          <p className="text-slate-400 text-[11px] font-medium leading-relaxed">
            {data.definition}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="market-sizing-block" className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          📈 Market Sizing (TAM / SAM / SOM)
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Estimated financial reach, addressability limits, and localized beachhead thresholds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 print-grid">
        {/* TAM */}
        <div className="p-5 rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-950/10 relative overflow-hidden flex flex-col justify-between print-card transition-colors duration-200">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Globe className="w-24 h-24 text-blue-900 dark:text-blue-200" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-400">
              <Globe className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Total Addressable Market</span>
            </div>
            <h4 className="text-3xl font-black text-blue-900 dark:text-blue-300 tracking-tight my-2">
              {tam.value}
            </h4>
            <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-4 bg-blue-100/40 dark:bg-blue-900/30 px-2.5 py-1 rounded-md inline-block">
              {tam.definition}
            </p>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 border-t border-blue-100/60 dark:border-blue-900/25 pt-3 mt-4">
            {tam.description}
          </p>
        </div>

        {/* SAM */}
        <div className="p-5 rounded-2xl border border-teal-100 dark:border-teal-900/40 bg-teal-50/20 dark:bg-teal-950/10 relative overflow-hidden flex flex-col justify-between print-card transition-colors duration-200">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Landmark className="w-24 h-24 text-teal-900 dark:text-teal-200" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2 text-teal-700 dark:text-teal-400">
              <Landmark className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Serviceable Addressable Market</span>
            </div>
            <h4 className="text-3xl font-black text-teal-900 dark:text-teal-300 tracking-tight my-2">
              {sam.value}
            </h4>
            <p className="text-xs font-semibold text-teal-800 dark:text-teal-300 mb-4 bg-teal-100/40 dark:bg-teal-900/30 px-2.5 py-1 rounded-md inline-block">
              {sam.definition}
            </p>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 border-t border-teal-100/60 dark:border-teal-900/25 pt-3 mt-4">
            {sam.description}
          </p>
        </div>

        {/* SOM */}
        <div className="p-5 rounded-2xl border border-violet-100 dark:border-violet-900/40 bg-violet-50/20 dark:bg-violet-950/10 relative overflow-hidden flex flex-col justify-between print-card transition-colors duration-200">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Compass className="w-24 h-24 text-violet-900 dark:text-violet-200" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2 text-violet-700 dark:text-violet-400">
              <Compass className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Serviceable Obtainable Market</span>
            </div>
            <h4 className="text-3xl font-black text-violet-900 dark:text-violet-300 tracking-tight my-2">
              {som.value}
            </h4>
            <p className="text-xs font-semibold text-violet-800 dark:text-violet-300 mb-4 bg-violet-100/40 dark:bg-violet-900/30 px-2.5 py-1 rounded-md inline-block">
              {som.definition}
            </p>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 border-t border-violet-100/60 dark:border-violet-900/25 pt-3 mt-4">
            {som.description}
          </p>
        </div>
      </div>

      {/* Interactive Recharts Sizing Comparison */}
      <div className="p-6 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-4 no-print transition-colors duration-200">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
            Comparative Volume Analytics
          </h4>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 15, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={12} 
                fontWeight={700}
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                fontWeight={500}
                tickLine={false} 
                axisLine={false}
                tickFormatter={formatValueShort}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "currentColor", opacity: 0.05 }} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={55}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
