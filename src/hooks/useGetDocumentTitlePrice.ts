import { useEffect } from 'react'

const useGetDocumentTitlePrice = () => {
  useEffect(() => {
    document.title = `Run Together`
  }, [])
}
export default useGetDocumentTitlePrice
