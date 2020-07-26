module.exports = (string, obj) => {
  const templateRegExp = /{{.+}}/g
  const removeTemplateRegExp = /{{|}}|\s/g

  return string
    .match(templateRegExp)
    .map(match => ({ template: match, key: match.replace(removeTemplateRegExp, '') }))
    .reduce((string, { template, key }) => string.replace(template, obj[key]), string)
}
