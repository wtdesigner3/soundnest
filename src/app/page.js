import HomeClient from "@/components/HomeClient";
import { getHomeContent } from "@/lib/home";

export default async function HomePage() {
  const homeData = await getHomeContent();
  return <HomeClient initialData={homeData} />;
}
