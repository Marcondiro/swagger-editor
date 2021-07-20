import React, { Component } from "react"
import DropdownMenu from "../topbar/DropdownMenu"
import {addAnnotationServiceForm, removeAnnotationServiceForm} from "./components/annotationServiceForm"

export default class TopbarSemanticAnnotations extends Component {
  constructor(props) {
    super(props)

      this.state = {
        showAddServiceModal: false,
        showRemoveServiceModal: false,
        semanticServices: [
          {
            serviceName:'Mantis Table', 
            url:'http://localhost:5000',
            bodyType:'OAS',
            isLastUsed: false,
            prefixURL: undefined,
          },
          {
            serviceName:'Wikidata',
            url:'https://wikidata.reconci.link/en/api',
            bodyType:'reconciliation_query',
            isLastUsed: false,
            prefixURL: undefined,
          },
        ],
      }
  }
  
  updateLastUsedService = (lastUsedService) => {
    this.setState((prevState) => ({
      semanticServices: prevState.semanticServices.map((v, i) => 
        i === lastUsedService  ? {...v, isLastUsed: true} : {...v, isLastUsed: false} 
      )
    }))
  }

  openModalClick = showModalProperty => () => {
    this.setState({
      [showModalProperty]: true
    })
  }

  closeModalClick = showModalProperty => () => {
    this.setState({
      [showModalProperty]: false
    })
  }

  addService = (formData) => {
    const service = {
      serviceName: formData.getIn(["name", "value"]),
      url: formData.getIn(["url", "value"]),
      bodyType: formData.getIn(["bodyType", "value"]) === 'Reconciliation query' ? 'reconciliation_query' : 'OAS',
      isLastUsed: false,
    }

    this.setState((prevState) =>
      ({semanticServices: [...prevState.semanticServices, service]})
    )
  }

  removeService = (formData) => {
    const service = formData.getIn(["service", "value"])

    this.setState((prevState) =>
      ({semanticServices: prevState.semanticServices.filter(v => v.serviceName != service)})
    )
  }

  getServicesManifest = () => {
    const servicesToLoad = this.state.semanticServices.filter(v => v.prefixURL === undefined)
    servicesToLoad.forEach( v => {
      const requestOptions = {
        method: 'GET',
      };
      v.prefixURL = ''
      fetch(v.url, requestOptions)
        .then(res => res.json())
        .then(json => {
          if(json.view && json.view.url) {
            v.prefixURL = json.view.url
          }
        })
    })
  }

  render() {

    this.getServicesManifest()

    let { getComponent } = this.props

    const LoadSemanticMenuItem = getComponent("LoadSemanticMenuItem")
    const Modal = getComponent("TopbarModal")
    const AddForm = getComponent("AddForm")

    let makeMenuOptions = (name) => {
      let stateKey = `is${name}MenuOpen`
      let toggleFn = () => this.setState({ [stateKey]: !this.state[stateKey] })
      return {
        isOpen: !!this.state[stateKey],
        close: () => this.setState({ [stateKey]: false }),
        align: "left",
        toggle: <span className="menu-item" onClick={toggleFn}>{ name }</span>
      }
    }

    return (
      <div>
        { this.state.showAddServiceModal && 
          <Modal
            title="Add Semantic Annotations Service"
            description="Add Semantic Annotations Service"
            onCloseClick={this.closeModalClick("showAddServiceModal")}
            isShownisLarge
          >
            <AddForm
              {...this.props}
              submit={this.closeModalClick("showAddServiceModal")}
              getFormData={addAnnotationServiceForm}
              submitButtonText="Add Service"
              updateSpecJson={this.addService}
            />
          </Modal>
        }

        { this.state.showRemoveServiceModal && 
          <Modal
            title="Remove Semantic Annotations Service"
            description="Remove Semantic Annotations Service"
            onCloseClick={this.closeModalClick("showRemoveServiceModal")}
            isShownisLarge
          >
            <AddForm
              {...this.props}
              submit={this.closeModalClick("showRemoveServiceModal")}
              getFormData={removeAnnotationServiceForm}
              submitButtonText="Remove Service"
              updateSpecJson={this.removeService}
              existingData={this.state.semanticServices.map(v => v.serviceName)}
            />
          </Modal>
        }

        <DropdownMenu {...makeMenuOptions("Semantic Annotations")}>
          { this.state.semanticServices.map((service, i) =>
              <LoadSemanticMenuItem onClick={() => this.updateLastUsedService(i)} {...service} {...this.props}/>
            )
          }
          <li role="separator"></li>
          <li>
            <button type="button" onClick={this.openModalClick("showAddServiceModal")}>
              ➕ add new service
            </button>
          </li>
          <li>
            <button type="button" onClick={this.openModalClick("showRemoveServiceModal")}>
              ➖ remove service
            </button>
          </li>
        </DropdownMenu>
      </div>
    )
  }
}