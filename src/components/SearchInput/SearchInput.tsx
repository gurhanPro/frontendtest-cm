import styles from "./SearchInput.module.scss";

export default function SearchInput({value, onChange} : { value:string, onChange: (v: string)=>void }){
  return (
   <input
      value={value}
      onChange={(e)=> onChange(e.target.value)}
      placeholder="type a bread name"
      className={styles.input}
    />
  )
}
