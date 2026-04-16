import type { BreedType } from "../../types";

type BreedListProp = {
  breeds: BreedType[];
  setSelectedBreed: (breed: BreedType) => void;
  selectedBreed: BreedType | null;
};

export default function BreedList({
  breeds,
  setSelectedBreed,
  selectedBreed,
}: BreedListProp) {
  return (
    <ul>
      {breeds.map((breed) => (
        <li
          key={breed.name}
          onClick={() => setSelectedBreed(breed)}
          style={{
            background: selectedBreed?.name === breed.name ? "orange" : "none",
          }}
        >
          {breed.name}
        </li>
      ))}
    </ul>
  );
}
