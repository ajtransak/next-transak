"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

interface Network {
  name: string;
  fiatCurrenciesNotSupported: string[];
  chainId: string | null;
}

interface Crypto {
  coinId: string;
  uniqueId: string;
  name: string;
  symbol: string;
  network: Network;
  image: { thumb: string };
  [key: string]: string | number | boolean | object;
}

interface PaymentOption {
  name: string;
  processingTime: string;
  icon: string;
  [key: string]: string | number | boolean | object;
}

interface Fiat {
  symbol: string;
  name: string;
  icon: string;
  paymentOptions: PaymentOption[];
  network: Network;
  [key: string]: string | number | boolean | object;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [fiats, setFiats] = useState<Fiat[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [selectedFiat, setSelectedFiat] = useState<Fiat | null>(null);

  useEffect(() => {
    const fetchCryptos = axios.get(
      "https://api-stg.transak.com/api/v2/currencies/crypto-currencies",
      { headers: { accept: "application/json" } }
    );
    const fetchFiats = axios.get(
      "https://api-stg.transak.com/api/v2/currencies/fiat-currencies",
      { headers: { accept: "application/json" } }
    );

    Promise.all([fetchCryptos, fetchFiats])
      .then(([cryptoRes, fiatRes]) => {
        setCryptos(cryptoRes.data.response);
        setFiats(fiatRes.data.response);
        setSelectedCrypto(cryptoRes.data.response[0] || null);
        setSelectedFiat(fiatRes.data.response[0] || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleCryptoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = cryptos.find(
      (crypto) => crypto.uniqueId === e.target.value
    );
    setSelectedCrypto(selected || null);
  };

  const handleFiatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = fiats.find((fiat) => fiat.symbol === e.target.value);
    setSelectedFiat(selected || null);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {selectedCrypto && (
            <div className="bg-white shadow-lg rounded-lg p-4 mb-4 flex items-center w-full max-w-md">
              <Image
                src={selectedCrypto.image.thumb}
                alt={`${selectedCrypto.name} logo`}
                height={48}
                width={48}
                className="mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedCrypto.name} ({selectedCrypto.symbol})
                </h2>
                <p className="text-gray-600">
                  Network: {selectedCrypto.network.name}
                </p>
              </div>
            </div>
          )}

          {selectedFiat && (
            <div className="bg-white shadow-lg rounded-lg p-4 mb-4 w-full max-w-md">
              <div className="flex items-center mb-4">
                <div
                  className="mr-4"
                  dangerouslySetInnerHTML={{ __html: selectedFiat.icon }}
                />
                <div>
                  <h2 className="text-xl font-semibold">
                    {selectedFiat.name} ({selectedFiat.symbol})
                  </h2>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Payment Methods:</h3>
              <ul className="list-disc list-inside">
                {selectedFiat.paymentOptions.map((option, index) => (
                  <li key={index} className="flex items-center mb-1">
                    <Image
                      src={option.icon}
                      alt={`${option.name} icon`}
                      height={24}
                      width={24}
                      className="mr-2"
                    />
                    <span>
                      {option.name} - {option.processingTime}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <select
            value={selectedCrypto?.uniqueId || ""}
            onChange={handleCryptoChange}
            className="w-72 p-3 border border-gray-300 rounded-lg text-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="">Select a cryptocurrency</option>
            {cryptos.map((crypto) => (
              <option key={crypto.uniqueId} value={crypto.uniqueId}>
                {crypto.name} ({crypto.symbol}) - {crypto.network.name}
              </option>
            ))}
          </select>

          <select
            value={selectedFiat?.symbol || ""}
            onChange={handleFiatChange}
            className="w-72 p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="">Select a fiat currency</option>
            {fiats.map((fiat) => (
              <option key={fiat.symbol} value={fiat.symbol}>
                {fiat.name} ({fiat.symbol})
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
}
