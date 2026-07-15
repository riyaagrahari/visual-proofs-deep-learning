import { NeuralBackground } from "./components/background/NeuralBackground";
import { SectionNav } from "./components/layout/SectionNav";
import { Hero } from "./components/sections/Hero";
import { Vision } from "./components/sections/Vision";
import { DataStrategy } from "./components/sections/DataStrategy";
import { DataCleaning } from "./components/sections/DataCleaning";
import { TrainingPipeline } from "./components/sections/TrainingPipeline";
import { TokenizerDesign } from "./components/sections/TokenizerDesign";
import { FertilityTargets } from "./components/sections/FertilityTargets";
import { Evaluation } from "./components/sections/Evaluation";
import { FinalDesign } from "./components/sections/FinalDesign";
import { References } from "./components/sections/References";

export default function App() {
  return (
    <div className="relative min-h-screen">
      <NeuralBackground />
      <SectionNav />
      <main>
        <Hero />
        <Vision />
        <DataStrategy />
        <DataCleaning />
        <TrainingPipeline />
        <TokenizerDesign />
        <FertilityTargets />
        <Evaluation />
        <FinalDesign />
        <References />
      </main>
    </div>
  );
}
