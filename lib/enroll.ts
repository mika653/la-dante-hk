// Where the "Enrol" buttons send people: La Dante's ScuolaSemplice public
// enrolment page. It opens in a new tab so the website stays open behind it.
// One place to change it if the office ever gets a new ScuolaSemplice link.
export const ENROLL_URL = "https://ladantehongkong.scuolasemplice.it/selling/public/bVnocBLzi8#/";

// Spread onto a Link/anchor to open the enrolment page in a new tab safely.
export const enrolLinkProps = { href: ENROLL_URL, target: "_blank" as const, rel: "noopener noreferrer" };
