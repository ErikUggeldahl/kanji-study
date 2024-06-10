import prisma from "@/app/lib/database";
import { kanjiToUnicode } from "@/app/lib/kanji-util";
import Image from "next/image";

export function generateStaticParams() {
  return Array.from({ length: 2200 }, (_, i) => ({ id: String(i + 1) }));
}

export default async function KanjiPage({
  params,
}: {
  params: { id: string };
}) {
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
        {kanji_data?.primitive_meanings && (
          <p>Primitive meanings: {kanji_data.primitive_meanings}</p>
        )}
        <p>Primitives: {kanji_data?.components || "None"}</p>

        <p>Mnemonic: {kanji_data?.mnemonic || "None"}</p>
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
