"use client";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [searchRes, setSearchRes] = useState<{
    results: string[];
    duration: number;
  }>();

  const fetchData = useCallback(async () => {
    if (!input) return setSearchRes(undefined);

    const res = await fetch(`https://nhr-search.dev-caiotheodoro.workers.dev/api/search?q=${input}`);
    const data = await res.json() as {
      results: string[];
      duration: number;
    };
    setSearchRes(data);

  }, [input]);

  
  useEffect(() => {
    let timeout: NodeJS.Timeout;


    const delayedFetchData = () => {
      clearTimeout(timeout);
      timeout = setTimeout(fetchData, 500);
    };

    delayedFetchData();

    return () => {
      clearTimeout(timeout);
    };
  }, [fetchData, input]);
  return (
    <main className="w-svw h-svh flex flex-col items-center justify-center grainy">
      <div className="flex flex-col gap-6 items-center pt-32 duration-500 animate-in  animate fade-in-5 slide-in-from-bottom-2.5 text-slate-800">
        <h1 className="text-5xl tracking-tight font-bold">Search!</h1>
        <p className="text-zinc-600 text-lg max-w-prose text-center">Benchmark w/ Hono, Cloudflare, Next.js!</p>
    <div className="max-w-md w-full">
      <Command>
        <CommandInput value={input} onValueChange={setInput} placeholder="Search Countries...."  className="placeholder:text-zinc-500"/>
        <CommandList>
          {searchRes?.results.length === 0  ? <CommandEmpty>No results found.</CommandEmpty> : null}

          {searchRes?.results ? (
            <CommandGroup heading={"Results"}>
              {searchRes?.results.map((result) => (
                <CommandItem key={result} value={result} onSelect={setInput}>{result}</CommandItem>
              ))}
            </CommandGroup>
          ) : null}

          {searchRes?.duration ? (
            <>
            <div className="h-px w-full bg-zind-200"/>

              <p className="p-2 heading-2 text-xs text-zinc-500">
                Found {searchRes?.results.length} results in {searchRes?.duration.toFixed(2)}ms
              </p>
              
            </>
          ) : null}
        </CommandList>
      </Command>
       </div>

    <input type="text" className="text p-2 rounded-lg text-zinc-600"  value={input} onChange={(e) => setInput(e.target.value)} />
      </div>  
    </main>
  );
}
