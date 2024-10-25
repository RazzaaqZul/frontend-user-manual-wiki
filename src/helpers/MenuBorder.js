export const getBorderClasses = (index) => {
  switch (index) {
    case 0: // Item 1
      return 'border-r border-b'
    case 1: // Item 2
      return 'border-r border-l border-b'
    case 2: // Item 3
      return 'border-l border-b'
    case 3: // Item 4
      return 'border-t border-b border-r'
    case 4: // Item 5
      return 'border-t border-b border-r border-l'
    case 5: // Item 6
      return 'border-t border-b border-l'
    case 6: // Item 7
      return 'border-t border-r'
    case 7: // Item 8
      return 'border-t border-r border-l'
    case 8: // Item 9
      return 'border-t border-l'
    default:
      return ''
  }
}
