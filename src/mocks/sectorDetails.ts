import type { SectorDetail } from '../models/sector';
import type { StockRankingEntry } from '../models/stock';

const createStock = (stock: StockRankingEntry): StockRankingEntry => stock;

export const mockSectorDetails: SectorDetail[] = [
  {
    id: 'sector-tech',
    name: 'Technology',
    totalStocks: 5,
    buyRatio: 72.5,
    rank: 1,
    ratings: {
      strongBuy: 1,
      Buy: 3,
      hold: 1,
      Sell: 0,
      strongSell: 0,
    },
    stocks: [
      createStock({ ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology', upside: 18.2, buyRatio: 78.4 }),
      createStock({ ticker: 'MSFT', name: 'Microsoft', sector: 'Technology', upside: 15.6, buyRatio: 74.1 }),
      createStock({ ticker: 'NVDA', name: 'NVIDIA', sector: 'Semiconductors', upside: 21.4, buyRatio: 81.3 }),
      createStock({ ticker: 'ADBE', name: 'Adobe', sector: 'Software', upside: 12.7, buyRatio: 68.9 }),
      createStock({ ticker: 'CRM', name: 'Salesforce', sector: 'Software', upside: 16.3, buyRatio: 63.2 }),
    ],
  },
  {
    id: 'sector-finance',
    name: 'Financial Services',
    totalStocks: 4,
    buyRatio: 64.3,
    rank: 2,
    ratings: {
      strongBuy: 1,
      Buy: 2,
      hold: 1,
      Sell: 0,
      strongSell: 0,
    },
    stocks: [
      createStock({ ticker: 'JPM', name: 'JPMorgan Chase', sector: 'Banking', upside: 9.4, buyRatio: 61.2 }),
      createStock({ ticker: 'BAC', name: 'Bank of America', sector: 'Banking', upside: 11.1, buyRatio: 65.7 }),
      createStock({ ticker: 'GS', name: 'Goldman Sachs', sector: 'Investment Banking', upside: 13.5, buyRatio: 67.4 }),
      createStock({ ticker: 'MS', name: 'Morgan Stanley', sector: 'Investment Banking', upside: 10.2, buyRatio: 62.1 }),
    ],
  },
  {
    id: 'sector-healthcare',
    name: 'Healthcare',
    totalStocks: 5,
    buyRatio: 61.8,
    rank: 3,
    ratings: {
      strongBuy: 1,
      Buy: 2,
      hold: 2,
      Sell: 0,
      strongSell: 0,
    },
    stocks: [
      createStock({ ticker: 'PFE', name: 'Pfizer', sector: 'Pharmaceuticals', upside: 14.8, buyRatio: 59.2 }),
      createStock({ ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', upside: 8.6, buyRatio: 57.5 }),
      createStock({ ticker: 'UNH', name: 'UnitedHealth', sector: 'Insurance', upside: 12.1, buyRatio: 63.8 }),
      createStock({ ticker: 'MRNA', name: 'Moderna', sector: 'Biotech', upside: 24.5, buyRatio: 68.2 }),
      createStock({ ticker: 'LLY', name: 'Eli Lilly', sector: 'Biotech', upside: 10.3, buyRatio: 60.5 }),
    ],
  },
];

