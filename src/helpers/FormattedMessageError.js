// Function to generate a formatted error message
export const formattedMessage = (errorMessage) => {
  console.log('test ini formattedMessage')
  console.log(errorMessage)

  const errorFields = Object.keys(errorMessage).filter((key) => errorMessage[key].length > 0)
  if (errorMessage.update && Object.keys(errorMessage).length === 1) {
    return errorMessage.update
  }
  if (errorFields.length > 0) {
    const fieldNames = errorFields
      .map((field) => {
        switch (field) {
          case 'img':
            return 'image'
          case 'short_desc':
            return 'deskripsi singkat'
          case 'category':
            return 'kategori'
          case 'content':
            return 'konten'
          case 'title':
            return 'judul'
          case 'version':
            return 'versi'
          case 'username':
            return 'username'
          case 'password':
            return 'password'
          case 'email':
            return 'email'
          default:
            return field
        }
      })
      .join(', ')

    return `Terjadi kesalahan pada field: ${fieldNames}`
  }

  return 'Tidak ada kesalahan yang terdeteksi.'
}
