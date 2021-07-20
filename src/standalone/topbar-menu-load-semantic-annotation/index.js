import LoadSemanticMenuItem from "./components/LoadSemanticMenuItem"
import TopbarSemanticAnnotations from "./topbar-semantic-annotations"

export default {
  components: {
    TopbarSemanticAnnotations,
    LoadSemanticMenuItem,
  },
  statePlugins: {
    semanticAnnotations: {
      actions: {
        updateVocabulary: (vocabulary) => {
          return {
            type: "voc_set_vocabulary",
            payload: vocabulary
          }
        }
      },
      reducers: {
        "voc_set_vocabulary": (state, action) => {
          return state.set("vocabulary", action.payload)
        }
      }
    },
  }
}