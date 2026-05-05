import styles from './SearchFilter.module.css'

export default function SearchFilter({ keyword, setKeyword, maxRent, setMaxRent, floorPlan, setFloorPlan }) {
  return (
    <div className={styles.bar}>
      <div className={styles.keywordRow}>
        <span className={styles.icon}>🔍</span>
        <input
          type="text"
          placeholder="物件名・エリアで検索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className={styles.keywordInput}
        />
      </div>
      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            家賃上限：<span className={styles.rentValue}>¥{maxRent.toLocaleString('ja-JP')}</span>
          </label>
          <input
            type="range"
            min={50000}
            max={500000}
            step={5000}
            value={maxRent}
            onChange={(e) => setMaxRent(Number(e.target.value))}
            className={styles.slider}
          />
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>間取り</label>
          <select
            value={floorPlan}
            onChange={(e) => setFloorPlan(e.target.value)}
            className={styles.select}
          >
            <option value="">すべて</option>
            <option value="1K">1K</option>
            <option value="1DK">1DK</option>
            <option value="1LDK">1LDK</option>
            <option value="2LDK">2LDK</option>
            <option value="3LDK以上">3LDK以上</option>
          </select>
        </div>
      </div>
    </div>
  )
}
