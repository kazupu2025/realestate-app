import { useState } from 'react'
import { useProperties } from '../hooks/useProperties'
import { useFilter } from '../hooks/useFilter'
import { useAuth } from '../context/AuthContext'
import PropertyCard from '../components/PropertyCard'
import PropertyModal from '../components/PropertyModal'
import SearchFilter from '../components/SearchFilter'
import styles from './PropertiesPage.module.css'

export default function PropertiesPage() {
  const { properties, loading, error, addProperty, updateProperty, deleteProperty } = useProperties()
  const { signOut } = useAuth()
  const { filtered, keyword, setKeyword, maxRent, setMaxRent, floorPlan, setFloorPlan } = useFilter(properties)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)

  const handleAddClick = () => {
    setEditingProperty(null)
    setModalOpen(true)
  }

  const handleEdit = (property) => {
    setEditingProperty(property)
    setModalOpen(true)
  }

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
        ) : (
          <>
            <SearchFilter
              keyword={keyword}
              setKeyword={setKeyword}
              maxRent={maxRent}
              setMaxRent={setMaxRent}
              floorPlan={floorPlan}
              setFloorPlan={setFloorPlan}
            />
            {filtered.length === 0 ? (
              <p className={styles.empty}>
                {properties.length === 0
                  ? '登録された物件がありません。「＋ 物件を追加」から登録してください。'
                  : '条件に一致する物件が見つかりません。'}
              </p>
            ) : (
              <div className={styles.grid}>
                {filtered.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onEdit={handleEdit}
                    onDelete={deleteProperty}
                  />
                ))}
              </div>
            )}
          </>
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
