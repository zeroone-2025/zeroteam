import { useQuery } from "@tanstack/react-query";
import type { Song } from "@/lib/songs-data";

export function useSongs() {
  return useQuery<Song[]>({
    queryKey: ["songs"],
    queryFn: () => fetch("/api/songs").then((r) => r.json()),
  });
}
