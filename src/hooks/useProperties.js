import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// 物件データのCRUD操作と状態管理を担うカスタムフック
export function useProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 自分の物件を全件取得する（RLSにより自動的に自分のデータのみ返る）
  const fetchProperties = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      setError(error.message)
    } else {
      setProperties(data)
    }
    setLoading(false)
  }

  // 物件を新規登録する（user_id は現在のログインユーザーのIDをセットする）
  const addProperty = async (formData) => {
    setError(null)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('properties')
      .insert({ ...formData, user_id: user.id })
    if (error) {
      setError(error.message)
      return false
    }
    await fetchProperties()
    return true
  }

  // 指定IDの物件を更新する
  const updateProperty = async (id, formData) => {
    setError(null)
    const { error } = await supabase
      .from('properties')
      .update(formData)
      .eq('id', id)
    if (error) {
      setError(error.message)
      return false
    }
    await fetchProperties()
    return true
  }

  // 指定IDの物件を削除する
  const deleteProperty = async (id) => {
    setError(null)
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
    if (error) {
      setError(error.message)
      return false
    }
    await fetchProperties()
    return true
  }

  // マウント時に物件一覧を取得する
  useEffect(() => {
    fetchProperties()
  }, [])

  return { properties, loading, error, fetchProperties, addProperty, updateProperty, deleteProperty }
}
