import Link from "next/link";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="text-lg font-bold">
          👑🎵 I&apos;M KING
        </Link>
      </div>
    </header>
  );
}
