import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define the interface for catalogue items
interface CatalogueItem {
  path: string
  title: string
  parent: string
  children?: CatalogueItem[]
}

// Read catalogue.json
const catalogueJson = fs.readFileSync(path.join(__dirname, '..', 'src', 'catalogue.json'), 'utf8')
const catalogue = JSON.parse(catalogueJson) as CatalogueItem[]
const baseUrl: string = 'https://github.com/qiqihaobenben/Front-End-Basics/blob/develop/docs/'

// Function to generate markdown content
function generateMarkdown(items: CatalogueItem[], level = 1): string {
  let markdown = ''

  for (const item of items) {
    // Create heading based on level
    const heading = '#'.repeat(level + 1) + ' ' + item.title
    markdown += heading + '\n\n'

    // If it has children, process them
    if (item.children && item.children.length > 0) {
      // First, extract all direct .md files as links
      const mdFiles = item.children.filter((child) => child.path.endsWith('.md'))
      if (mdFiles.length > 0) {
        for (const mdFile of mdFiles) {
          const url = `${baseUrl}${mdFile.path}`
          markdown += `- [${mdFile.title}](${url})\n`
        }
        markdown += '\n'
      }

      // Then process directories (non-md files)
      const directories = item.children.filter((child) => !child.path.endsWith('.md'))
      if (directories.length > 0) {
        markdown += generateMarkdown(directories, level + 1)
      }
    } else if (item.path.endsWith('.md')) {
      // If it's a leaf node with .md extension, add it as a link
      const url = `${baseUrl}${item.path}`
      markdown += `- [${item.title}](${url})\n\n`
    }
  }

  return markdown
}

// Generate the markdown content
const markdownContent = `# Front-End-Basics & Grow Up 目录\n\n
- [GitHub](https://github.com/qiqihaobenben/Front-End-Basics)
- [文档地址](https://docs.chenfangxu.com/)\n\n
${generateMarkdown(catalogue)}`

// Write to README.md
fs.writeFileSync(path.join(__dirname, '..', 'README.md'), markdownContent)

console.log('README.md has been generated successfully!')
