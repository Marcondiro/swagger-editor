import * as wrapActions from "./wrap-actions"

export default function EditorAutosuggestSemanticAnnotationPlugin() {
  return {
    statePlugins: {
      editor: {
        wrapActions,
      },
      semanticAnnotations: {
        selectors: {
          selectVocabulary: (state) => state.get("vocabulary")
        },
      },
    },
  }
}
