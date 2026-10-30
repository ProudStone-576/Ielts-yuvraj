import { MockDay } from "@/components/MockDay";
import { catalog } from "@/lib/catalog";

export default function MockPage() {
  return <MockDay catalog={catalog()} />;
}
