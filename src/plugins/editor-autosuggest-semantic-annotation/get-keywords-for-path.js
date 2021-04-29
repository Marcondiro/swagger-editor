import isArray from "lodash/isArray"
import isObject from "lodash/isObject"

export default function getKeywordsForPath({ system, path, keywordMap}) {
  keywordMap = Object.assign({}, keywordMap)

  // is getting path was not successful stop here and return no candidates
  if (!isArray(path)) {
    return []
  }

  // traverse down the keywordMap for each key in the path until there is
  // no key in the path

  var key = path.shift()

  while (key && isObject(keywordMap)) {
    keywordMap = getChild(keywordMap, key)
    key = path.shift()
  }

  // if no keywordMap was found after the traversal return no candidates
  if (!keywordMap) {
    return []
  }

  if(isArray(keywordMap)) {
    return keywordMap
      .map(entry => {
        return {
          caption: entry.caption,
          snippet: entry.snippet,
          meta: "annotation",
          score: 500
        }
      })
  }

  if(keywordMap["x-semanticAnnotation"]) {
    return [{
      value: "x-semanticAnnotation: ",
      meta: "keyword",
      score: 300
    }]
  }

}

function getChild(object, key) {
  var keys = Object.keys(object)
  var regex
  var isArrayAccess = /^\d+$/.test(key)

  if(isArrayAccess && isArray(object)) {
    return object[0]
  }

  for (var i = 0; i < keys.length; i++) {
    let childVal = object[keys[i]]
    regex = new RegExp("^" + (childVal.__regex || keys[i]))

    if (regex.test(key) && childVal) {
      if(typeof childVal === "object" && !isArray(childVal)) {
        return Object.assign({}, childVal)
      } else {
        return childVal
      }
    }
  }
}