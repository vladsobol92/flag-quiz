export type Region = "North" | "West" | "Central" | "South" | "Balkans" | "East";

export interface Country {
  code: string;
  name: string;
  capital: string;
  region: Region;
}

export const COUNTRIES: Country[] = [
  { code: "AL", name: "Albania", capital: "Tirana", region: "Balkans" },
  { code: "AD", name: "Andorra", capital: "Andorra la Vella", region: "South" },
  { code: "AT", name: "Austria", capital: "Vienna", region: "Central" },
  { code: "BY", name: "Belarus", capital: "Minsk", region: "East" },
  { code: "BE", name: "Belgium", capital: "Brussels", region: "West" },
  { code: "BA", name: "Bosnia and Herzegovina", capital: "Sarajevo", region: "Balkans" },
  { code: "BG", name: "Bulgaria", capital: "Sofia", region: "Balkans" },
  { code: "HR", name: "Croatia", capital: "Zagreb", region: "Balkans" },
  { code: "CY", name: "Cyprus", capital: "Nicosia", region: "South" },
  { code: "CZ", name: "Czechia", capital: "Prague", region: "Central" },
  { code: "DK", name: "Denmark", capital: "Copenhagen", region: "North" },
  { code: "EE", name: "Estonia", capital: "Tallinn", region: "North" },
  { code: "FI", name: "Finland", capital: "Helsinki", region: "North" },
  { code: "FR", name: "France", capital: "Paris", region: "West" },
  { code: "DE", name: "Germany", capital: "Berlin", region: "Central" },
  { code: "GR", name: "Greece", capital: "Athens", region: "South" },
  { code: "HU", name: "Hungary", capital: "Budapest", region: "Central" },
  { code: "IS", name: "Iceland", capital: "Reykjavík", region: "North" },
  { code: "IE", name: "Ireland", capital: "Dublin", region: "West" },
  { code: "IT", name: "Italy", capital: "Rome", region: "South" },
  { code: "XK", name: "Kosovo", capital: "Pristina", region: "Balkans" },
  { code: "LV", name: "Latvia", capital: "Riga", region: "North" },
  { code: "LI", name: "Liechtenstein", capital: "Vaduz", region: "Central" },
  { code: "LT", name: "Lithuania", capital: "Vilnius", region: "North" },
  { code: "LU", name: "Luxembourg", capital: "Luxembourg", region: "West" },
  { code: "MT", name: "Malta", capital: "Valletta", region: "South" },
  { code: "MD", name: "Moldova", capital: "Chișinău", region: "East" },
  { code: "MC", name: "Monaco", capital: "Monaco", region: "West" },
  { code: "ME", name: "Montenegro", capital: "Podgorica", region: "Balkans" },
  { code: "NL", name: "Netherlands", capital: "Amsterdam", region: "West" },
  { code: "MK", name: "North Macedonia", capital: "Skopje", region: "Balkans" },
  { code: "NO", name: "Norway", capital: "Oslo", region: "North" },
  { code: "PL", name: "Poland", capital: "Warsaw", region: "Central" },
  { code: "PT", name: "Portugal", capital: "Lisbon", region: "South" },
  { code: "RO", name: "Romania", capital: "Bucharest", region: "East" },
  { code: "SM", name: "San Marino", capital: "San Marino", region: "South" },
  { code: "RS", name: "Serbia", capital: "Belgrade", region: "Balkans" },
  { code: "SK", name: "Slovakia", capital: "Bratislava", region: "Central" },
  { code: "SI", name: "Slovenia", capital: "Ljubljana", region: "Balkans" },
  { code: "ES", name: "Spain", capital: "Madrid", region: "South" },
  { code: "SE", name: "Sweden", capital: "Stockholm", region: "North" },
  { code: "CH", name: "Switzerland", capital: "Bern", region: "Central" },
  { code: "UA", name: "Ukraine", capital: "Kyiv", region: "East" },
  { code: "GB", name: "United Kingdom", capital: "London", region: "West" },
  { code: "VA", name: "Vatican City", capital: "Vatican City", region: "South" },
];
