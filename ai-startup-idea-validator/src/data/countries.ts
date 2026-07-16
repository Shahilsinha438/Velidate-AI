export interface CountryData {
  name: string;
  code: string;
  currency: string;
  symbol: string;
  flag: string;
  region: string;
}

export const COUNTRIES: CountryData[] = [
  // North America
  { name: "United States", code: "US", currency: "USD", symbol: "$", flag: "🇺🇸", region: "North America" },
  { name: "Canada", code: "CA", currency: "CAD", symbol: "C$", flag: "🇨🇦", region: "North America" },
  { name: "Mexico", code: "MX", currency: "MXN", symbol: "Mex$", flag: "🇲🇽", region: "North America" },

  // Europe
  { name: "United Kingdom", code: "GB", currency: "GBP", symbol: "£", flag: "🇬🇧", region: "Europe" },
  { name: "Germany", code: "DE", currency: "EUR", symbol: "€", flag: "🇩🇪", region: "Europe" },
  { name: "France", code: "FR", currency: "EUR", symbol: "€", flag: "🇫🇷", region: "Europe" },
  { name: "Italy", code: "IT", currency: "EUR", symbol: "€", flag: "🇮🇹", region: "Europe" },
  { name: "Spain", code: "ES", currency: "EUR", symbol: "€", flag: "🇪🇸", region: "Europe" },
  { name: "Netherlands", code: "NL", currency: "EUR", symbol: "€", flag: "🇳🇱", region: "Europe" },
  { name: "Belgium", code: "BE", currency: "EUR", symbol: "€", flag: "🇧🇪", region: "Europe" },
  { name: "Switzerland", code: "CH", currency: "CHF", symbol: "CHF", flag: "🇨🇭", region: "Europe" },
  { name: "Sweden", code: "SE", currency: "SEK", symbol: "kr", flag: "🇸🇪", region: "Europe" },
  { name: "Norway", code: "NO", currency: "NOK", symbol: "kr", flag: "🇳🇴", region: "Europe" },
  { name: "Denmark", code: "DK", currency: "DKK", symbol: "kr", flag: "🇩🇰", region: "Europe" },
  { name: "Ireland", code: "IE", currency: "EUR", symbol: "€", flag: "🇮🇪", region: "Europe" },
  { name: "Poland", code: "PL", currency: "PLN", symbol: "zł", flag: "🇵🇱", region: "Europe" },

  // Asia-Pacific
  { name: "India", code: "IN", currency: "INR", symbol: "₹", flag: "🇮🇳", region: "Asia-Pacific" },
  { name: "Japan", code: "JP", currency: "JPY", symbol: "¥", flag: "🇯🇵", region: "Asia-Pacific" },
  { name: "China", code: "CN", currency: "CNY", symbol: "¥", flag: "🇨🇳", region: "Asia-Pacific" },
  { name: "Australia", code: "AU", currency: "AUD", symbol: "A$", flag: "🇦🇺", region: "Asia-Pacific" },
  { name: "New Zealand", code: "NZ", currency: "NZD", symbol: "NZ$", flag: "🇳🇿", region: "Asia-Pacific" },
  { name: "Singapore", code: "SG", currency: "SGD", symbol: "S$", flag: "🇸🇬", region: "Asia-Pacific" },
  { name: "South Korea", code: "KR", currency: "KRW", symbol: "₩", flag: "🇰🇷", region: "Asia-Pacific" },
  { name: "Hong Kong", code: "HK", currency: "HKD", symbol: "HK$", flag: "🇭🇰", region: "Asia-Pacific" },
  { name: "Taiwan", code: "TW", currency: "TWD", symbol: "NT$", flag: "🇹🇼", region: "Asia-Pacific" },
  { name: "Indonesia", code: "ID", currency: "IDR", symbol: "Rp", flag: "🇮🇩", region: "Asia-Pacific" },
  { name: "Malaysia", code: "MY", currency: "MYR", symbol: "RM", flag: "🇲🇾", region: "Asia-Pacific" },
  { name: "Philippines", code: "PH", currency: "PHP", symbol: "₱", flag: "🇵🇭", region: "Asia-Pacific" },
  { name: "Thailand", code: "TH", currency: "THB", symbol: "฿", flag: "🇹🇭", region: "Asia-Pacific" },
  { name: "Vietnam", code: "VN", currency: "VND", symbol: "₫", flag: "🇻🇳", region: "Asia-Pacific" },

  // Latin America
  { name: "Brazil", code: "BR", currency: "BRL", symbol: "R$", flag: "🇧🇷", region: "Latin America" },
  { name: "Argentina", code: "AR", currency: "ARS", symbol: "AR$", flag: "🇦🇷", region: "Latin America" },
  { name: "Colombia", code: "CO", currency: "COP", symbol: "COL$", flag: "🇨🇴", region: "Latin America" },
  { name: "Chile", code: "CL", currency: "CLP", symbol: "CLP$", flag: "🇨🇱", region: "Latin America" },
  { name: "Peru", code: "PE", currency: "PEN", symbol: "S/.", flag: "🇵🇪", region: "Latin America" },

  // Middle East & Africa
  { name: "United Arab Emirates", code: "AE", currency: "AED", symbol: "AED", flag: "🇦🇪", region: "Middle East & Africa" },
  { name: "Saudi Arabia", code: "SA", currency: "SAR", symbol: "SR", flag: "🇸🇦", region: "Middle East & Africa" },
  { name: "Israel", code: "IL", currency: "ILS", symbol: "₪", flag: "🇮🇱", region: "Middle East & Africa" },
  { name: "Turkey", code: "TR", currency: "TRY", symbol: "₺", flag: "🇹🇷", region: "Middle East & Africa" },
  { name: "South Africa", code: "ZA", currency: "ZAR", symbol: "R", flag: "🇿🇦", region: "Middle East & Africa" },
  { name: "Nigeria", code: "NG", currency: "NGN", symbol: "₦", flag: "🇳🇬", region: "Middle East & Africa" },
  { name: "Egypt", code: "EG", currency: "EGP", symbol: "E£", flag: "🇪🇬", region: "Middle East & Africa" },
  { name: "Kenya", code: "KE", currency: "KES", symbol: "KSh", flag: "🇰🇪", region: "Middle East & Africa" },

  // Global / Custom
  { name: "Global / Multi-region", code: "GL", currency: "USD", symbol: "$", flag: "🌐", region: "Global" }
];

export function getCountryByGeography(geoName: string): CountryData {
  const normalized = (geoName || "").trim().toLowerCase();
  
  // Try exact or partial match
  const found = COUNTRIES.find(c => 
    normalized.includes(c.name.toLowerCase()) || 
    c.name.toLowerCase().includes(normalized)
  );

  return found || COUNTRIES[0]; // Fallback to US / $
}
