export const getSubTopics = (longText) => {
  const subTopics = []
  let currentH1 = null

  // Regex untuk menangkap <h1> dan <h2> beserta isinya
  const sections = longText.match(/<h1.*?>.*?<\/h1>|<h2.*?>.*?<\/h2>/g)

  if (sections) {
    sections.forEach((section) => {
      const isH1 = section.includes('<h1')
      const isH2 = section.includes('<h2')

      if (isH1) {
        // Ambil isi dari <span> dan hapus <span>, &nbsp;, serta tag lainnya
        const title = section
          .replace(/<span[^>]*>(.*?)<\/span>/g, '$1') // Ambil isi dari <span> dan hapus <span>
          .replace(/<[^>]*>/g, '') // Hapus tag HTML lainnya
          .replace(/&nbsp;/g, ' ') // Hapus &nbsp; dan ganti dengan spasi
          .trim()

        // Buat ID dari title (lowercase dan ganti spasi dengan '-')
        const id = title.toLowerCase().replace(/\s+/g, '-')

        // Jika title tidak kosong, tambahkan ke subTopics
        if (title) {
          currentH1 = { id, title, subTopics: [] }
          subTopics.push(currentH1)
        }
      } else if (isH2 && currentH1) {
        const subTitle = section
          .replace(/<[^>]*>/g, '') // Hapus tag HTML lainnya
          .replace(/&nbsp;/g, ' ') // Hapus &nbsp; dan ganti dengan spasi
          .trim()

        // Buat ID dari subTitle (lowercase dan ganti spasi dengan '-')
        const subId = subTitle.toLowerCase().replace(/\s+/g, '-')

        // Jika subTitle tidak kosong, tambahkan ke subTopics
        if (subTitle) {
          currentH1.subTopics.push({ id: subId, title: subTitle })
        }
      }
    })
  }

  return subTopics
}
