import { MusicPlayer } from "@/components/music-player/music-player";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          I&apos;M KING
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          세상에서 가장 프리미엄한 음악 경험
        </p>
      </div>
      <MusicPlayer />
    </div>
  );
}
