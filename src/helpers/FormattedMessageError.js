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
            return 'Image'
          case 'short_desc':
            return 'Deskripsi Singkat'
          case 'category':
            return 'Kategori'
          case 'content':
            return 'Konten'
          case 'title':
            return 'Judul'
          case 'version':
            return 'Versi'
          case 'username':
            return 'Username'
          case 'password':
            return 'Password'
          case 'email':
            return 'Email'
          case 'confirmPassword':
            return 'Konfirmasi Password'
          case 'name':
            return 'Nama Lengkap'
          default:
            return field
        }
      })
      .join(', ')

    return `Terjadi kesalahan pada kolom: ${fieldNames}`
  }

  return 'Tidak ada kesalahan yang terdeteksi.'
}
