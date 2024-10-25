export function parseContent(inputHTML) {
  // Function to remove all HTML tags
  function stripHTMLTags(str) {
    const doc = new DOMParser().parseFromString(str, 'text/html')
    return doc.body.textContent || ''
  }

  // Remove all <img> tags
  const cleanHTML = inputHTML.replace(/<img[^>]*>/g, '')

  const parser = new DOMParser()
  const doc = parser.parseFromString(cleanHTML, 'text/html')

  const sections = []
  const headings = doc.querySelectorAll('h1, h2, p, ul, ol')

  let currentSection = null
  let currentSubSections = []

  headings.forEach((element) => {
    if (element.tagName === 'H1') {
      // Save the current section before starting a new one
      if (currentSection) {
        if (currentSubSections.length > 0) {
          currentSection.content = currentSubSections
        }
        sections.push(currentSection)
      }
      currentSection = {
        title: stripHTMLTags(element.innerHTML),
        content: []
      }
      currentSubSections = []
    } else if (element.tagName === 'H2') {
      // Start a new sub-section
      currentSubSections.push({
        title: stripHTMLTags(element.innerHTML),
        content: []
      })
    } else if (element.tagName === 'P') {
      // Append paragraph content to the latest sub-section or the main section if no sub-sections
      if (currentSubSections.length > 0) {
        const lastSubSection = currentSubSections[currentSubSections.length - 1]
        lastSubSection.content.push(stripHTMLTags(element.innerHTML))
      } else if (currentSection) {
        currentSection.content.push(stripHTMLTags(element.innerHTML))
      }
    } else if (element.tagName === 'UL' || element.tagName === 'OL') {
      // Handle lists (ul and ol)
      const listItems = Array.from(element.querySelectorAll('li')).map((li) =>
        stripHTMLTags(li.innerHTML)
      )
      if (currentSubSections.length > 0) {
        const lastSubSection = currentSubSections[currentSubSections.length - 1]
        lastSubSection.content.push(...listItems)
      } else if (currentSection) {
        currentSection.content.push(...listItems)
      }
    }
  })

  // Add the last section if there is one
  if (currentSection) {
    if (currentSubSections.length > 0) {
      currentSection.content = currentSubSections
    }
    sections.push(currentSection)
  }

  return sections
}
