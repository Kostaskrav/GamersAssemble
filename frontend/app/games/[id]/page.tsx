import { ForumFeed } from "@/components/posts/forum-feed";

type GamePageProps = {
  params: Promise<{ id: string }>;
};

export default async function GamePage({ params }: GamePageProps) {
  const { id } = await params;
  const gameId = Number(id);

  if (Number.isNaN(gameId)) {
    return (
      <div className="surface rounded-lg p-8 text-center text-sm text-[var(--color-bug)]">
        Invalid game id.
      </div>
    );
  }

  return <ForumFeed gameId={gameId} />;
}
