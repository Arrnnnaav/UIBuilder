import { JsonLd } from "@/components/seo/JsonLd";
import { jsonLdFor } from "@/lib/seo";
export function PageSchema({ route }: { route: string }) { return <>{jsonLdFor(route).map((data, index) => <JsonLd data={data} key={index} />)}</>; }
