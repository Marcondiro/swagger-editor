import LoadSemanticMenuItem from "./components/LoadSemanticMenuItem"

export default {
  components: {
    LoadSemanticMenuItem
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