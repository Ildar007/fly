import { CurrencyDto } from "../dtos/subscriptions/CurrencyDto";

const currencies: CurrencyDto[] = [
  {
    name: "United States Dollar",
    value: "usd",
    symbol: "$",
    default: true,
    disabled: false,
    parities: [{ from: "usd", parity: 1 }],
    symbolRight: false,
    thousandSeparator: ",",
    decimalSeparator: ".",
  },
  {
    name: "Euro",
    value: "eur",
    symbol: "€",
    disabled: true,
    parities: [{ from: "usd", parity: 1 }],
    symbolRight: true,
    thousandSeparator: ".",
    decimalSeparator: ",",
  },
  {
    name: "Great Britain Pound",
    value: "gbp",
    symbol: "£",
    disabled: true,
    parities: [{ from: "usd", parity: 0.85 }],
    symbolRight: false,
    thousandSeparator: ",",
    decimalSeparator: ".",
  },
  {
    name: "Indian Rupee",
    value: "inr",
    symbol: "₹",
    disabled: true,
    parities: [{ from: "usd", parity: 79.96 }],
    symbolRight: false,
    thousandSeparator: ",",
    decimalSeparator: ".",
  },
  {
    name: "Mexican Peso",
    value: "mxn",
    symbol: "$",
    disabled: true,
    parities: [{ from: "usd", parity: 16.98 }],
    symbolRight: false,
    thousandSeparator: ",",
    decimalSeparator: ".",
  },
  {
    name: "Canadian Dollar",
    value: "cad",
    symbol: "C$",
    disabled: true,
    parities: [{ from: "usd", parity: 1.3 }],
    symbolRight: false,
    thousandSeparator: ",",
    decimalSeparator: ".",
  },
  {
    name: "Japanese Yen",
    value: "jpy",
    symbol: "¥",
    disabled: true,
    parities: [{ from: "usd", parity: 110 }],
    symbolRight: false,
    thousandSeparator: ",",
    decimalSeparator: ".",
  },
  {
    name: "Australian Dollar",
    value: "aud",
    symbol: "A$",
    disabled: true,
    parities: [{ from: "usd", parity: 1.4 }],
    symbolRight: false,
    thousandSeparator: ",",
    decimalSeparator: ".",
  },
  {
    name: "Swiss Franc",
    value: "chf",
    symbol: "CHF",
    disabled: true,
    parities: [{ from: "usd", parity: 0.92 }],
    symbolRight: true,
    thousandSeparator: "'",
    decimalSeparator: ".",
  },
  {
    name: "Chinese Yuan",
    value: "cny",
    symbol: "¥",
    disabled: true,
    parities: [{ from: "usd", parity: 6.36 }],
    symbolRight: false,
    thousandSeparator: ",",
    decimalSeparator: ".",
  },
  {
    name: "South Korean Won",
    value: "krw",
    symbol: "₩",
    disabled: true,
    parities: [{ from: "usd", parity: 1190 }],
    symbolRight: false,
    thousandSeparator: ",",
    decimalSeparator: ".",
  },
  {
    name: "Russian Ruble",
    value: "rub",
    symbol: "₽",
    disabled: true,
    parities: [{ from: "usd", parity: 76 }],
    symbolRight: false,
    thousandSeparator: " ",
    decimalSeparator: ",",
  },
  {
    name: "Brazilian Real",
    value: "brl",
    symbol: "R$",
    disabled: true,
    parities: [{ from: "usd", parity: 5.2 }],
    symbolRight: false,
    thousandSeparator: ".",
    decimalSeparator: ",",
  },
  {
    name: "South African Rand",
    value: "zar",
    symbol: "R",
    disabled: true,
    parities: [{ from: "usd", parity: 15 }],
    symbolRight: false,
    thousandSeparator: ",",
    decimalSeparator: ".",
  },
];
export default currencies;