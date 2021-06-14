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

  let key = path.shift()
  let parentObj

  while (key && isObject(keywordMap)) {
    keywordMap = getChild(keywordMap, key)
    let previousKey = key
    key = path.shift()
    if (key === "x-semanticAnnotation") {
      parentObj = previousKey
    }
  }

  // if no keywordMap was found after the traversal return no candidates
  if (!keywordMap) {
    return []
  }

  if(isArray(keywordMap)) {
    const externalVocabulary = system.semanticAnnotationsSelectors.selectVocabulary()
    let completion = []

    if(externalVocabulary && externalVocabulary[parentObj] ) {
      completion = externalVocabulary[parentObj]
    }
    else {
      completion = keywordMap
        .map(entry => {
          return {
            caption: entry.caption,
            snippet: entry.snippet,
            meta: "annotation",
            score: 100,
          }
        })
    }
    return completion
  }

  if(keywordMap["x-semanticAnnotation"]) {
    return [{
      value: "x-semanticAnnotation: ",
      meta: "keyword",
      score: 301
    },]
  }

}

function getChild(object, key) {
  let keys = Object.keys(object)
  let isArrayAccess = /^\d+$/.test(key)

  if(isArrayAccess && isArray(object)) {
    return object[0]
  }

  for (let i = 0; i < keys.length; i++) {
    let childVal = object[keys[i]]
    let regex = new RegExp("^" + (childVal.__regex || keys[i]))

    if (regex.test(key) && childVal) {
      if(typeof childVal === "object" && !isArray(childVal)) {
        return Object.assign({}, childVal)
      } else {
        return childVal
      }
    }
  }
}