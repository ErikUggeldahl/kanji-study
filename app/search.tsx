"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Search() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search === "") {
      router.replace("/");
    } else {
      router.replace(`/?search=${search}`);
    }
  };

  return (
    <form onSubmit={onSearchSubmit}>
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        className="w-32"
      />
      <button className="ml-4 p-2 border rounded" type="submit">
        Submit
      </button>
      <button
        className="ml-4 p-2 border rounded"
        disabled={!searchParams.get("search")}
        onClick={() => {
          setSearch("");
          router.replace("/");
        }}
      >
        Clear
      </button>
    </form>
  );
}
