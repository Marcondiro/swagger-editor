import React, { Component } from "react"
import YAML from "js-yaml"

const MIME = {
  reconciliationQuery: 'application/x-www-form-urlencoded',
  json: 'application/vnd.oai.openapi+json',
  yaml: 'application/vnd.oai.openapi'
}

export default class LoadSemanticMenuItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
  }

  getDefinitionLanguage() {
    let editorContent = this.props.specSelectors.specStr() || ""

    if(editorContent.trim()[0] === "{") {
      return "json"
    }

    return "yaml"
  }

  extractSchemaObjects() {
    const schemas = this.props.specSelectors.specJson().get('components').get('schemas').toJS()
    const labels = Object.keys(schemas)
    return labels
  }

  makeReconciliationQuery() {
    const objs = this.extractSchemaObjects();
    let queries = objs.reduce((acc, curr) => (acc[curr]={'query': curr}, acc), {});
    queries = JSON.stringify(queries);
    queries = 'queries=' + queries;
    return encodeURI(queries);
  }

  reconCandidates2vocabulary(candidates) {
    const vocabulary = Object.fromEntries(Object.entries(candidates).map(([k, v]) => {
      const objSuggestions = v.result.map((entry) => {
        const type = entry.type != undefined && entry.type.length > 0 ? entry.type[0].name : undefined
        return {
          caption: entry.name,
          snippet: entry.id,
          score: entry.score,
          meta: "score: " + entry.score + ", type: " + type,
        }})
      return [k, objSuggestions]
    }))

    return vocabulary
  }

  insertMatchingAnnotations(candidates) {
    const matchingCandidates = Object.entries(candidates).map(([k, v]) => {
      const objSuggestions = v.result.filter(entry => entry.match)
      return [k, objSuggestions[0]]
    }).filter(candidate => candidate[1])

    matchingCandidates.forEach(candidate =>
      this.props.specActions.addToSpec(['components', 'schemas', candidate[0]], candidate[1].id, "x-semanticAnnotation") 
    )

    // Update the spec string in the Swagger UI state with the new json.
    const currentJson = this.props.specSelectors.specJson()
    this.props.specActions.updateSpec(YAML.safeDump(currentJson.toJS()), "semantic_annotation")
  }

  loadFromURL = () => {
    console.log(this.props)
    const url = this.props.url;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': this.props.bodyType == 'OAS' ? 
          MIME[this.getDefinitionLanguage()] :
          'application/x-www-form-urlencoded'
      },
      body: this.props.bodyType == 'OAS' ?
        JSON.stringify(this.props.specSelectors.specStr()) :
        this.makeReconciliationQuery(),
    };

    //const url_default = this.props.bodyType === 'OAS' ? 'http://localhost:5000' : 'https://wikidata.reconci.link/en/api'
    //let url = prompt("Enter the URL to load from:", url_default)
    
    this.setState({
      loading: true
    });

    fetch(url, requestOptions)
      .then(res => res.json())
      .then(json => {
        this.insertMatchingAnnotations(json)
        const newVocabulary = this.reconCandidates2vocabulary(json)
        this.props.semanticAnnotationsActions.updateVocabulary(newVocabulary)
        this.setState({
          loading: false
        })
      })
  }

  render() {
    return (
      <li>
        <button type="button" onClick={() => {this.loadFromURL(); this.props.onClick()}}>
          Load from { this.props.serviceName } {this.props.isLastUsed ? '✔' : ''}
        </button>
      </li>
    )
  }
}

LoadSemanticMenuItem.propTypes = {
  serviceName: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  bodyType: PropTypes.string.isRequired,
  isLastUsed: PropTypes.bool.isRequired,
  onClick: PropTypes.function
}