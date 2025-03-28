import upload from '@/assets/image/loading1.svg'
import upload1 from '@/assets/image/upload_2.jpg'
import React, { useRef, useState } from 'react'

const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
export const checkImage = (file) => {
  if (!file) {
    return
  }

  if (!validTypes.includes(file.type)) {
    return 'Định dạng ảnh không hỗ trợ'
  }

  if (file.size > 1024 * 1024 * 1) {
    return 'Kích thước ảnh quá lớn'
  }

  return ''
}
const BoxUploadImage = ({ image, id }) => {
  const [imgEdited, setImgEdited] = useState(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)
  const localUrlRef = useRef(null)

  const handleClickUpload = () => {
    inputRef.current.click()
  }

  const handleChange = (event) => {
    const file = event.target.files[0]

    const message = checkImage(file)
    if (message !== '') {
      // toastError(message)
      console.log(message)
      return
    }

    if (file) {
      setUploading(true)
      callApiUpload(file)
    }
  }

  const callApiUpload = (file) => {
    // uploadImage(file, 'main', id).then((response) => {
    //   setImgEdited(response.data.result.url)
    // })
    //   .catch(() => { })
    //   .finally(() => {
    //     setUploading(false)
    //   })
    if (localUrlRef.current) {
      URL.revokeObjectURL(localUrlRef.current)
    }
    const localUrl = URL.createObjectURL(file)
    localUrlRef.current = localUrl
    setTimeout(() => {
      setUploading(false)
      setImgEdited(localUrl)
    }, 1000)
  }

  const genImageSrc = () => {
    if (uploading) {
      return upload
    }

    if (imgEdited) {
      return imgEdited
    }

    if (image) {
      return image
    }
    return upload1
  }

  return (
    <div style={{ height: '210px', border: '2px solid #B9B7B7', borderRadius: '10px', width: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5px', background: 'white' }} onClick={handleClickUpload}>
      <img src={genImageSrc()} alt='upload' style={{ height: '100%', maxWidth: '100%', objectFit: 'contain' }} />
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg, image/jpg, image/png"
        hidden
        onChange={handleChange}
      />
    </div>
  )
}

export default React.memo(BoxUploadImage)
