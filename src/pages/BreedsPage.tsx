import { useEffect, useMemo, useState } from "react";
import type { BreedsAPIResponse, BreedType } from "../types";
import useDebounce from "../hooks/useDebounce";
import SearchInput from "../components/SearchInput/SearchInput";
import BreedList from "../components/BreedList/BreedList";
import BreedImages from "../components/BreedImages/BreedImages";
import { config } from "../config";
import styles from "./BreedsPage.module.scss";

export default function BreedsPage() {
  const [breeds, setBreeds] = useState<BreedType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterInput, setFilterInput] = useState("");
  const [selectedBreed, setSelectedBreed] = useState<BreedType | null>(null);
  const debouncedFitler = useDebounce(filterInput, 300)

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const resOjb = await fetch(`${config.dogApiUrl}/breeds/list/all`);
        const res = (await resOjb.json()) as { message: BreedsAPIResponse };
        const breedArrayFormat = Object.entries(res.message).map(
          ([name, subBreeds]) => ({ name, subBreeds }),
        );
        setBreeds(breedArrayFormat);
      } catch {
        setError("Failed to load breeds");
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

  const renderBreedSection = () => {
    if (loading) return <p className={styles.loading}>Loading dog breeds...</p>
    if (error) return <p className={styles.error}>Error loading breeds</p>

    return (
      <div className={styles.sidebar}>
        <h1 className={styles.title}>Dog Breeds</h1>
        <SearchInput value={filterInput} onChange={setFilterInput} />
        <BreedList
          breeds={filtered}
          setSelectedBreed={setSelectedBreed}
          selectedBreed={selectedBreed}
        />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {renderBreedSection()}
      <BreedImages selectedBreed={selectedBreed} />
    </div>
  );
}
