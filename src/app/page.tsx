import GooeyNav from "@/blocks/Components/GooeyNav/GooeyNav";
import Image from "next/image";

export default function Home() {
  const items = [

  { label: "Home", href: "#" },

  { label: "About", href: "#" },

  { label: "Contact", href: "#" },

];
  return (
<GooeyNav

    items={items}

    particleCount={15}

    particleDistances={[90, 10]}

    particleR={100}

    initialActiveIndex={0}

    animationTime={600}

    timeVariance={300}

    colors={[1, 2, 3, 1, 2, 3, 1, 4]}

  />
  );
}
