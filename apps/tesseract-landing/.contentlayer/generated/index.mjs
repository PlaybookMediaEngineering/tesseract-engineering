// NOTE This file is auto-generated by Contentlayer

export { isType } from 'contentlayer2/client'

// NOTE During development Contentlayer imports from `.mjs` files to improve HMR speeds.
// During (production) builds Contentlayer it imports from `.json` files to improve build performance.
import allPages from './Page/_index.json' assert { type: 'json' }
import allDocs from './Doc/_index.json' assert { type: 'json' }
import allGuides from './Guide/_index.json' assert { type: 'json' }
import allPosts from './Post/_index.json' assert { type: 'json' }
import allAuthors from './Author/_index.json' assert { type: 'json' }

export { allPages, allDocs, allGuides, allPosts, allAuthors }

export const allDocuments = [...allPages, ...allDocs, ...allGuides, ...allPosts, ...allAuthors]


