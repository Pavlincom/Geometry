import { EditorShell } from "@/components/editor/editor-shell";
import { MeasurementPanel } from "@/components/editor/measurement-panel";

type CreatePageProps = {
  searchParams: Promise<{ artwork?: string | string[] }>;
};

export default async function CreatePage({ searchParams }: CreatePageProps) {
  const params = await searchParams;
  const artworkId = typeof params.artwork === "string" ? params.artwork : null;

  return (
    <>
      <EditorShell initialArtworkId={artworkId} />
      <MeasurementPanel />
    </>
  );
}
