

import { ServiceHero } from "@/components/main/ServiceHero";
import { PopularPosts } from "@/components/main/PopularPosts";

export default function Home() {
  return (
    <div className="flex flex-col">
      <ServiceHero />
      <PopularPosts />
    </div>
  );
}
