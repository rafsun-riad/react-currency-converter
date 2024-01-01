import { useState, useEffect, useCallback } from 'react';

const API_KEY = 'b5471c01ca1c2635e2c8557f';
// https://v6.exchangerate-api.com/v6/YOUR-API-KEY/latest/USD

function Currency() {
  const [amount1, setAmount1] = useState('');
  const [amount2, setAmount2] = useState('');
  const [currency1, setCurrency1] = useState('USD');
  const [currency2, setCurrency2] = useState('BDT');
  const [exchangeRates, setExchangeRates] = useState({});

  useEffect(() => {
    async function fetchExchangeRates() {
      try {
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch exchange rate');
        }
        const data = await res.json();
        setExchangeRates(data.conversion_rates || {});
      } catch (err0r) {
        console.log(err0r);
      }
    }
    fetchExchangeRates();
  }, []);

  const handleCurrencyConvert = useCallback(
    (ammount, fromCurrency, toCurrency) => {
      if (fromCurrency === toCurrency) return ammount;

      const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
      return (ammount * rate).toFixed(2);
    },
    [exchangeRates]
  );

  useEffect(() => {
    if (!exchangeRates[currency1] && !exchangeRates[currency2]) return;
    const convertedAmount = handleCurrencyConvert(
      amount1,
      currency1,
      currency2
    );
    setAmount2(convertedAmount);
  }, [amount1, currency1, currency2, exchangeRates, handleCurrencyConvert]);

  return (
    <div className="flex flex-row mt-8 gap-x-12">
      <div className="border-black border-2 rounded-lg p-1 bg-white">
        <select
          className="bg-black text-white rounded-lg py-2"
          value={currency1}
          onChange={(e) => setCurrency1(e.target.value)}
        >
          {Object.keys(exchangeRates).map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <input
          className="ml-3 border-b-2 border-blue-700 outline-none"
          type="number"
          value={amount1}
          onChange={(e) => setAmount1(e.target.value)}
        />
      </div>

      <div className="border-black border-2 rounded-lg p-1 bg-white">
        <select
          className="bg-black text-white rounded-lg py-2"
          value={currency2}
          onChange={(e) => setCurrency2(e.target.value)}
        >
          {Object.keys(exchangeRates).map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <input
          className="ml-3 border-b-2 border-blue-700 outline-none"
          type="number"
          value={amount2}
          onChange={(e) => setAmount2(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Currency;
