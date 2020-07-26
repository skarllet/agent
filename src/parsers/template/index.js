module.exports = (string, obj) => {
  const templateRegExp = /{{.+}}/g
  const removeTemplateRegExp = /{{|}}|\s/g

  const matches = string.match(templateRegExp)

  if (!matches)
    return string

  return matches
          .map(match => ({ template: match, key: match.replace(removeTemplateRegExp, '') }))
          .reduce((string, { template, key }) => string.replace(template, obj[key]), string)
}
