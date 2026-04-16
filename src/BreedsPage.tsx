import React, { useEffect, useMemo, useState } from "react";
import type { BreedsAPIResponse, BreedType } from "./types";
import useDebounce from "./hooks/useDebounce";
import SearchInput from "./components/SearchInput/SearchInput";
import BreedList from "./components/BreedList/BreedList";
import BreedImages from "./components/BreedImages/BreedImages";

export default function BreedsPage() {
  const [breeds, setBreeds] = useState<BreedType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterInput, setFilterInput] = useState("");
  const [selectedBreed, setSelectedBreed] = useState<BreedType | null>(null);
  const debouncedFitler = useDebounce(filterInput, 300)

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const resOjb = await fetch("https://dog.ceo/api/breeds/list/all");
        const res = (await resOjb.json()) as { message: BreedsAPIResponse };
        const breedArrayFormat = Object.entries(res.message).map(
          ([name, subBreeds]) => ({ name, subBreeds }),
        );
        setBreeds(breedArrayFormat);
        setLoading(false);
      } catch (err: any) {
        console.log("error fetching breedlist", err);
        setError(err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchBreeds();
  }, []);



  const filtered = useMemo(() => {
    return debouncedFitler
      ? breeds.filter((breed) =>
          breed.name.toLowerCase().includes(debouncedFitler.toLowerCase()),
        )
      : breeds;
  }, [breeds, debouncedFitler]);

  return (
    <>
      {loading ? <p>Loading dog breeds ...</p> : null}
      {error ? <p>error loading</p> : null}
      <div style={{ display: "flex", gap: "50px" }}>
        <div>
          <h1>BreedLists</h1>
          <SearchInput
            value={filterInput}
            onChange={setFilterInput}
          />
          {filtered.length > 0 ? (
            <div>
              <div style={{ display: "flex", gap: "100px" }}>
                <BreedList
                  breeds={filtered}
                  setSelectedBreed={setSelectedBreed}
                  selectedBreed={selectedBreed}
                />
              </div>
            </div>
          ) : (
            <p>no breeds to match your filter input</p>
          )}
        </div>

        <BreedImages selectedBreed={selectedBreed } />
      </div>
    </>
  );
}
