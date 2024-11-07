export const getSubTopics = (longText) => {
  const subTopics = []
  let currentH1 = null
  const h2Counts = {} // Menyimpan jumlah kemunculan untuk setiap <h2>

  const sections = longText.match(/<h1.*?>.*?<\/h1>|<h2.*?>.*?<\/h2>/g)

  if (sections) {
    sections.forEach((section) => {
      const isH1 = section.includes('<h1')
      const isH2 = section.includes('<h2')

      if (isH1) {
        const title = section
          .replace(/<span[^>]*>(.*?)<\/span>/g, '$1')
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
          .trim()

        const id = title.toLowerCase().replace(/\s+/g, '-')

        if (title) {
          currentH1 = { id, title, subTopics: [] }
          subTopics.push(currentH1)
        }
      } else if (isH2 && currentH1) {
        const subTitle = section
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
          .trim()

        let subId = subTitle.toLowerCase().replace(/\s+/g, '-')

        // Periksa apakah subId sudah ada di h2Counts
        if (h2Counts[subId]) {
          h2Counts[subId] += 1
          subId = `${subId}-${h2Counts[subId]}` // Tambahkan angka untuk membuat ID unik
        } else {
          h2Counts[subId] = 1
        }

        if (subTitle) {
          currentH1.subTopics.push({ id: subId, title: subTitle })
        }
      }
    })
  }

  return subTopics
}
