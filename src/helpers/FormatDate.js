export function formatDate(dateString) {
  // Membuat objek tanggal dari string
  const date = new Date(dateString)

  // Array hari dan bulan dalam bahasa Indonesia
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ]

  // Mendapatkan nama hari, tanggal, bulan, dan tahun
  const dayName = days[date.getDay()]
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  // Mengembalikan format yang diinginkan
  return `${dayName}, ${day} ${month} ${year}`
}

export function formatDateTime(dateTimeString) {
  // Daftar nama hari
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  // Daftar nama bulan
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ]

  // Buat objek Date dari string
  const date = new Date(dateTimeString)

  // Ambil komponen tanggal
  const dayName = days[date.getDay()] // Nama hari
  const day = String(date.getDate()).padStart(2, '0') // Tanggal
  const monthName = months[date.getMonth()] // Nama bulan
  const year = date.getFullYear() // Tahun
  const hours = String(date.getHours()).padStart(2, '0') // Jam
  const minutes = String(date.getMinutes()).padStart(2, '0') // Menit

  // Format menjadi string yang diinginkan
  return `${dayName}, ${day} ${monthName} ${year} | ${hours}:${minutes}`
}
