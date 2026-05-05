import { useState, useMemo } from 'react'

export function useFilter(properties) {
  const [keyword, setKeyword] = useState('')
  const [maxRent, setMaxRent] = useState(150000)
  const [floorPlan, setFloorPlan] = useState('')

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (keyword) {
        const kw = keyword.toLowerCase()
        if (!p.name.toLowerCase().includes(kw) && !p.area.toLowerCase().includes(kw)) {
          return false
        }
      }
      if (p.rent > maxRent) return false
      if (floorPlan && p.floor_plan !== floorPlan) return false
      return true
    })
  }, [properties, keyword, maxRent, floorPlan])

  return { filtered, keyword, setKeyword, maxRent, setMaxRent, floorPlan, setFloorPlan }
}
