import Image from "next/image";
import Landing from "./components/Landing";
import Schedule from "./components/Schedule";
import FAQ from "./components/FAQ";

export default function Home() {
  return (
    <div>
      <Landing />
      <Schedule />
      <FAQ />
    </div>
  );
}
