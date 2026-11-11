// Bundled partner logos (from ladante.cc/membership/privileges, Nov 2026), used
// whenever a privilege has no uploaded logo in Admin → Privileges. Matching is
// on a normalised brand name, so "The Italian Club HK" finds "the-italian-club".
// An uploaded logo always wins.
const LOGOS: [string, string][] = [
  ["alice pizza", "alice-pizza.jpg"],
  ["bella lee", "bella-lee.jpg"],
  ["gia trattoria", "gia-trattoria.png"],
  ["mother of pizza", "mother-of-pizzas.jpg"],
  ["botta di cru", "botta-di-cru.jpg"],
  ["cheese meets wine", "cheese-meets-wine.png"],
  ["italian club", "the-italian-club.png"],
  ["castello del vino", "castello-del-vino.jpg"],
  ["valdivia", "valdivia.jpg"],
  ["hk butler", "hk-butler.png"],
  ["wine paradise", "wine-paradise.png"],
  ["tenute san fabiano", "tenute-san-fabiano.jpg"],
  ["generali", "generali.jpg"],
  ["dbms", "dbms-global.jpg"],
  ["scuola romanica", "scuola-romanica.png"],
  ["cadillac", "cadillac.jpg"],
  ["grappa", "grappas-qre.jpg"],
  ["happy valley bar", "happy-valley-bar-grill.jpg"],
  ["inn side out", "inn-side-out.jpg"],
  ["mostaccioli", "mostaccioli-brothers.jpg"],
  ["mickey b", "mickey-b-pizza.jpg"],
  ["simply fresh", "simply-fresh.jpg"],
  ["vinoveritas", "vinoveritas.jpg"],
  ["vino veritas", "vinoveritas.jpg"],
  ["borgovivo", "borgovivo.jpg"],
  ["bella ciao", "bella-ciao.jpg"],
];

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** Uploaded logo if present, else a bundled logo matched by brand, else null (initials). */
export function privilegeLogo(brand: string, uploaded?: string | null): string | null {
  if (uploaded) return uploaded;
  const b = norm(brand);
  const hit = LOGOS.find(([key]) => b.includes(key));
  return hit ? `/privileges/${hit[1]}` : null;
}
