'use strict'

const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')

const {assets} = require('../assets')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

// Create a template object from a template of the assets folder.
// Use the type to determine which template must be selected.
function createTemplate (type) {
  const templatePath = getTemplatePath(assets, type)

  if (!templatePath) {
    throw new Error('Missing template! Make sure your presskit has a "type" field (product/company)')
  }

  registerPartials(assets)

  const template = fs.readFileSync(templatePath, 'utf-8')
  return handlebars.compile(template)
}

// Get the path to the corresponding template in the assets folder.
function getTemplatePath (folder, type) {
  switch (type) {
    case 'product':
      return path.join(folder, 'product.html')
    case 'company':
      return path.join(folder, 'company.html')
  }
}

// Add all the required partials.
function registerPartials (folder) {
  const partialsFolder = path.join(folder, '_includes')

  const partials = fs.readdirSync(partialsFolder)
    .filter(isValidPartial)
    .reduce((result, partial) => {
      const ext = path.extname(partial)
      const fileFullPath = path.join(partialsFolder, partial)
      const data = fs.readFileSync(fileFullPath, 'utf-8')

      // Store as `"filename without extension": content`.
      result[path.basename(partial, ext)] = data
      return result
    }, {})

  handlebars.registerPartial(partials)
}

// Is the file an HTML file?
function isValidPartial (file) {
  const ext = path.extname(file)
  return ext === '.html'
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  createTemplate
}