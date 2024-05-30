import { createDBClient } from "@/app/lib/database";
import Image from "next/image";

function kanjiToUnicode(kanji: string): string {
  if (kanji.length !== 1) {
    throw new Error("Input must be a single Kanji character.");
  }

  const unicodeValue = kanji.charCodeAt(0).toString(16).toUpperCase();
  return unicodeValue.padStart(5, "0");
}

export default async function KanjiPage({
  params,
}: {
  params: { id: string };
}) {
  const prisma = createDBClient();
  const kanji_data = await prisma.kanji.findUnique({
    where: {
      id: Number(params.id),
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center text-center gap-2 p-20 shadow-lg">
        <p>{kanji_data?.id}</p>
        <h1 className="text-xl">{kanji_data?.keyword}</h1>
        <h2 className="text-8xl">{kanji_data?.kanji}</h2>
        <p>Components: {kanji_data?.components}</p>
        <p>On: {kanji_data?.on_reading}</p>
        <p>Kun: {kanji_data?.kun_reading}</p>
        <div>
          <Image
            className="border"
            src={`/kanji_svg/${kanjiToUnicode(kanji_data!.kanji)}.svg`}
            width={100}
            height={100}
            alt="Kanji SVG"
          />
          <p className="text-xs">{kanji_data?.stroke_count} strokes</p>
        </div>
        <div>
          <h3>References</h3>
          <div className="grid grid-cols-2">
            <a
              href={`https://en.wiktionary.org/wiki/${kanji_data?.kanji}#Japanese`}
            >
              Wiktionary
            </a>
            <a
              href={`https://kanji.koohii.com/study/kanji/${kanji_data?.kanji}`}
            >
              Koohii
            </a>
            <a href={`https://www.kanshudo.com/kanji/${kanji_data?.kanji}`}>
              Kanshudo
            </a>
            <a href={`https://jisho.org/search/${kanji_data?.kanji}%23kanji`}>
              Jisho
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
