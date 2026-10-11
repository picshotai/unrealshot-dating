// Only remove explicit expression prohibitions, not entire sentences. A later
// affirmative instruction ("no teeth, but he laughs") must still be rejected.
const EXPRESSION = "(?:open[- ]mouth(?:ed)?(?:\\s+(?:smile|smiles|smiling))?|half[- ]smile|smirk(?:s|ing)?|smil(?:e|es|ing)|grin(?:s|ning)?|laugh(?:s|ing|ter)?|chuckl(?:e|es|ing)|chortl(?:e|es|ing)|giggl(?:e|es|ing)|beaming|toothy(?:\\s+(?:smile|smiles|grin))?|teeth)";
const MODIFIERS = "(?:(?:a|an|any|visible|showing|show|wide|broad|faint|slight|subtle|warm|natural|forced)\\s+)*";
const NEGATED_ITEM = `${MODIFIERS}${EXPRESSION}\\b`;
const PROHIBITED_LIST = new RegExp(
  `\\b(?:no|without|never|not)\\s+${NEGATED_ITEM}(?:(?:\\s*,\\s*(?:(?:and|or)\\s+)?|\\s+(?:and|or)\\s+)(?:(?:no|without|never|not)\\s+)?${NEGATED_ITEM})*(?:\\s+(?:showing|visible|show))?`,
  "gi"
);
const NEGATED_TEETH = /\bteeth\s+(?:(?:are|remain)\s+)?(?:not|never)\s+(?:visible|showing|shown)\b/gi;

export function affirmativeExpressionText(text: string): string {
  return text.replace(PROHIBITED_LIST, " ").replace(NEGATED_TEETH, " ");
}
