import { useState, useEffect } from 'react'
import styles from './PropertyModal.module.css'

// 物件の追加・編集に共用するモーダルコンポーネント
// property が null → 追加モード（フィールドは空）
// property にデータあり → 編集モード（フィールドに現在値をプリセット）
export default function PropertyModal({ isOpen, onClose, property, onSave }) {
  const [name, setName] = useState('')
  const [rent, setRent] = useState('')
  const [area, setArea] = useState('')
  const [floorPlan, setFloorPlan] = useState('')
  const [loading, setLoading] = useState(false)

  // モーダルが開くたびにフォームフィールドを初期化する
  useEffect(() => {
    if (property) {
      setName(property.name)
      setRent(String(property.rent))
      setArea(property.area)
      setFloorPlan(property.floor_plan)
    } else {
      setName('')
      setRent('')
      setArea('')
      setFloorPlan('')
    }
  }, [property, isOpen])

  // モーダルが閉じているときは何もレンダリングしない
  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const success = await onSave({
      name,
      rent: parseInt(rent, 10),
      area,
      floor_plan: floorPlan,
    })
    // onSave が true を返した場合のみモーダルを閉じる（エラー時は開いたまま）
    if (success) onClose()
    setLoading(false)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* クリックイベントがオーバーレイに伝播してモーダルが閉じないよう止める */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{property ? '物件を編集' : '物件を追加'}</h2>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            物件名
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
            />
          </label>
          <label className={styles.label}>
            家賃（円）
            <input
              type="number"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              className={styles.input}
              min={0}
              required
            />
          </label>
          <label className={styles.label}>
            エリア
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className={styles.input}
              required
            />
          </label>
          <label className={styles.label}>
            間取り（例: 1LDK）
            <input
              type="text"
              value={floorPlan}
              onChange={(e) => setFloorPlan(e.target.value)}
              className={styles.input}
              required
            />
          </label>
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              キャンセル
            </button>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? '送信中...' : property ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
