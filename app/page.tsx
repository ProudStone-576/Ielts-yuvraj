import { CoachHome } from "@/components/CoachHome";
import { catalog } from "@/lib/catalog";

export default function Home() {
  return <CoachHome catalog={catalog()} />;
}
