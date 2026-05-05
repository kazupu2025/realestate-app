import { useState } from 'react'
import { useProperties } from '../hooks/useProperties'
import { useAuth } from '../context/AuthContext'
import PropertyCard from '../components/PropertyCard'
import PropertyModal from '../components/PropertyModal'
import styles from './PropertiesPage.module.css'

export default function PropertiesPage() {
  const { properties, loading, error, addProperty, updateProperty, deleteProperty } = useProperties()
  const { signOut } = useAuth()

  // モーダルの開閉状態と編集対象物件を管理する
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)

  // 追加ボタン押下: 追加モード（editingProperty=null）でモーダルを開く
  const handleAddClick = () => {
    setEditingProperty(null)
    setModalOpen(true)
  }

  // 編集ボタン押下: 編集モード（editingProperty=物件データ）でモーダルを開く
  const handleEdit = (property) => {
    setEditingProperty(property)
    setModalOpen(true)
  }

  // モーダルの保存: editingProperty の有無で追加・更新を切り替える
  const handleSave = async (formData) => {
    if (editingProperty) {
      return await updateProperty(editingProperty.id, formData)
    }
    return await addProperty(formData)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>🏠 不動産管理システム</h1>
          <div className={styles.headerActions}>
            <button onClick={handleAddClick} className={styles.addButton}>
              ＋ 物件を追加
            </button>
            <button onClick={signOut} className={styles.logoutButton}>
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <main className={styles.container}>
        {error && <p className={styles.error}>エラー: {error}</p>}

        {loading ? (
          <p className={styles.loading}>読み込み中...</p>
        ) : properties.length === 0 ? (
          <p className={styles.empty}>
            登録された物件がありません。「＋ 物件を追加」から登録してください。
          </p>
        ) : (
          <div className={styles.grid}>
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={handleEdit}
                onDelete={deleteProperty}
              />
            ))}
          </div>
        )}
      </main>

      <PropertyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        property={editingProperty}
        onSave={handleSave}
      />
    </div>
  )
}
