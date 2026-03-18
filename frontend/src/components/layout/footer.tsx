export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        제로톤(Zero-Thon) — Zero에서 One을 만드는 2시간의 경험
        <p className="mt-1 text-xs">
          BGM 출처:{" "}
          <a
            href="https://sellbuymusic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            셀바이뮤직 (SellBuyMusic)
          </a>
        </p>
      </div>
    </footer>
  );
}
