export interface NavSection {
  id: string;
  label: string;
  index: string;
}

export const SECTIONS: NavSection[] = [
  { id: "hero", label: "Overview", index: "00" },
  { id: "vision", label: "Vision", index: "01" },
  { id: "data", label: "Data Strategy", index: "02" },
  { id: "cleaning", label: "Data Cleaning", index: "03" },
  { id: "training", label: "Training", index: "04" },
  { id: "tokenizer", label: "Tokenizer", index: "05" },
  { id: "fertility", label: "Fertility", index: "06" },
  { id: "evaluation", label: "Evaluation", index: "07" },
  { id: "architecture", label: "Final Design", index: "08" },
  { id: "references", label: "References", index: "09" },
];
