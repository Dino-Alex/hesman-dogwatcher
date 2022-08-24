import { useEffect } from 'react'

const useGetDocumentTitlePrice = () => {
  useEffect(() => {
    document.title = `Delta Labs`
  }, [])
}
export default useGetDocumentTitlePrice
