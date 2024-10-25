export const getImageUrl = (name, type) => {
  if (type == 'image') {
    return new URL(`../assets/images/${name}`, import.meta.url).href
  } else {
    return new URL(`../assets/icon/${name}`, import.meta.url).href
  }
}
