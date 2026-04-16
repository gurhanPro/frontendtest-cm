import React, { useEffect, useMemo, useState } from "react";

type BreedType = { name: string; subBreeds: string[] };
type BreedsAPIResponse = Record<string, string[]>;

export default function BreedList() {
  const [breeds, setBreeds] = useState<BreedType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterInput, setFilterInput ] = useState('')
  const [selectedBreed, setSelectedBreed] = useState<BreedType | null>(null)
  const [debouncedFitler, setDebouncedFilter]= useState('')

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

  useEffect(()=> {
    const timer = setTimeout(()=> { setDebouncedFilter(filterInput)}, 300)
    return () => clearTimeout(timer)
  },[filterInput])

  const filtered = useMemo(()=> {
    return debouncedFitler ? breeds.filter(breed => breed.name.toLowerCase().includes(debouncedFitler.toLowerCase())) : breeds
  },[breeds, debouncedFitler])

  return (
    <>
      {loading ? <p>Loading dog breeds ...</p> : null}
      {error ? <p>error loading</p> : null}
      <div style={{display: 'flex', gap: '50px'}}>
      <div>
        <h1>BreedLists</h1>
        <input
          value={filterInput}
          onChange={(event) => setFilterInput(event.target.value)}
          placeholder="type a bread name"
        />
              {filtered.length > 0 ? (
        <div>
          <div style={{ display: "flex", gap: "100px" }}>
            <ul>
              {filtered.map((breed) => (
                <li key={breed.name} onClick={()=> setSelectedBreed(breed)} style={{background: selectedBreed?.name === breed.name ? 'orange' : 'none'}}>{breed.name}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>no breeds to match your filter input</p>
      )}
      </div>

      <div>
        <h2>selected breed: {selectedBreed?.name}</h2>
      </div>
      </div>

    </>
  );
}
