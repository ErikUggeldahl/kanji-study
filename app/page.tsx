import { PrismaClient, kanji } from "@prisma/client";
import Link from "next/link";
import Search from "./search";

export default async function Home({
  searchParams,
}: {
  searchParams: { search: string };
}) {
  const prisma = new PrismaClient();
  const kanji_data = await prisma.kanji.findMany({
    take: 2200,
    orderBy: {
      id: "asc",
    },
  });

  const search = async (search: string) => {
    if (parseInt(search)) {
      return await prisma.kanji.findUnique({
        where: {
          id: Number(search),
        },
      });
    } else {
      return await prisma.kanji.findFirst({
        where: {
          OR: [
            {
              kanji: {
                contains: search,
              },
            },
            {
              keyword: {
                contains: search,
              },
            },
          ],
        },
      });
    }
  };

  const searchResults = await search(searchParams.search);

  const KanjiHundred = ({
    start,
    kanji,
  }: {
    start: number;
    kanji: kanji[];
  }) => (
    <div className="flex flex-col justify-center">
      <h2 className="text-center">
        {start}-{start + 99}
      </h2>
      <div className="grid grid-cols-10">
        {kanji.map((k) => (
          <KanjiBox key={k.id} kanji={k} />
        ))}
      </div>
    </div>
  );

  const KanjiBox = ({ kanji, large }: { kanji: kanji; large?: boolean }) => {
    const textSize = large ? "text-lg" : "text-xs";
    const width = large ? "w-24" : "w-12";
    const height = large ? "h-32" : "";

    return (
      <Link href={`/kanji/${kanji.id}`}>
        <div
          className={`${width} ${height} flex flex-col justify-center p-0.5 border truncate text-center`}
          key={kanji.id}
        >
          <span className={textSize}>{kanji.id}</span>
          <span>{kanji.kanji}</span>
          <span className={textSize}>{kanji.keyword}</span>
        </div>
      </Link>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between gap-8 p-24">
      <h1>Remembering the Kanji Study Aid</h1>
      <div className="flex flex-col items-center gap-4">
        <Search />
        {searchResults && <KanjiBox large={true} kanji={searchResults} />}
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-8">
        {Array.from({ length: 2200 / 100 }, (_, i) => i).map((i) => (
          <KanjiHundred
            key={i}
            start={i * 100 + 1}
            kanji={kanji_data.slice(i * 100, (i + 1) * 100)}
          />
        ))}
      </div>
    </main>
  );
}
