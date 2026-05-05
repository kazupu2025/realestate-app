import styles from './PropertyCard.module.css'

export default function PropertyCard({ property, onEdit, onDelete }) {
  const { name, rent, area, floor_plan } = property

  return (
    <div className={styles.card}>
      <div className={styles.colorBar} />
      <div className={styles.content}>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.rent}>家賃：{rent.toLocaleString('ja-JP')}円 / 月</p>
        <p className={styles.area}>エリア：{area}</p>
        <p className={styles.floorPlan}>間取り：{floor_plan}</p>
        <div className={styles.actions}>
          <button onClick={() => onEdit(property)} className={styles.editButton}>
            編集
          </button>
          <button onClick={() => onDelete(property.id)} className={styles.deleteButton}>
            削除
          </button>
        </div>
      </div>
    </div>
  )
}
