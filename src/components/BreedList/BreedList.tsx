import type { BreedType } from "../../types";
import styles from "./BreedList.module.scss";

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
  if (breeds.length === 0) return <p className={styles.noResults}>No breeds match your filter</p>

  return (
    <ul className={styles.list}>
      {breeds.map((breed) => (
        <li
          key={breed.name}
          onClick={() => setSelectedBreed(breed)}
          className={`${styles.item} ${selectedBreed?.name === breed.name ? styles.selected : ''}`}
        >
          {breed.name}
        </li>
      ))}
    </ul>
  );
}
