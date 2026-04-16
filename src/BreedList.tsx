import React, { useEffect, useState } from "react";

type BreedType = { name: string; subBreeds: string[] };
type BreedsAPIResponse = Record<string, string[]>;

export default function BreedList() {
  const [breeds, setBreeds] = useState<BreedType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <>
      {loading ? <p>Loading dog breeds ...</p> : null}
      {error ? <p>error loading</p> : null}
      {breeds.length > 0 && (
        <div>
          <h1>BreedLists</h1>
          <div style={{ display: "flex", gap: "100px" }}>
            <ul>
              {breeds.map((breed) => (
                <li key={breed.name}>{breed.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
