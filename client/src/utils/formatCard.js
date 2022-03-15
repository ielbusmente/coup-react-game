/**
 * comment */
export default function formatCard(card) {
  let cardString = card.charAt(0).toUpperCase() + card.slice(1);
  if (cardString === "Con") return "Contessa";
  if (cardString === "Ass") return "Assassin";
  return cardString;
}
