import Hero from "@/components/sections/Hero";
import SelectedWork from "@/components/sections/SelectedWork";
import About from "@/components/sections/About";
import Expertise from "@/components/sections/Expertise";
import Contact from "@/components/sections/Contact";
import FloatingNav from "@/components/layout/FloatingNav";
import HeroWorkTransition from "@/components/layout/HeroWorkTransition";


export default function Home() {
  return (
    <>
      <FloatingNav />
      <main>
        <HeroWorkTransition>
          <Hero />
          <SelectedWork />
        </HeroWorkTransition>

        <Expertise />
        <About />
        <Contact />
      </main>
    </>
  );
}