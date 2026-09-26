import { metadataFor } from "@/lib/seo";
import { Intro } from "@/components/portfolio/Intro";
import { WorkIndex, MoreWork } from "@/components/portfolio/WorkIndex";
import { PageSchema } from "@/components/portfolio/PageSchema";
export const metadata = metadataFor("/work");
export default function Work() { return <><Intro title="Selected work"><p>Backend and AI systems, with the engineering decisions, measured results and source files behind each build.</p></Intro><WorkIndex /><MoreWork /><PageSchema route="/work" /></>; }
