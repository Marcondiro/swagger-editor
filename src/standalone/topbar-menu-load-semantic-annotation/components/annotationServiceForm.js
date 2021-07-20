import { fromJS } from "immutable"
import { isURL } from "validator"

export const addAnnotationServiceForm = (updateForm, path) => 
  fromJS({
    name: {
      value: "",
      isRequired: true,
      name: "Service name",
      description: "Name of the service, as it will be shown in the menù.",
      updateForm: event => updateForm(event, path.concat(["name"])),
    },
    url: {
      value: "",
      isRequired: true, 
      name: "URL",
      description: "The URL of the service. Value MUST be in the format of a URL.",
      isValid: value => isURL(value, {require_tld: false}),
      validationMessage: "Please enter a valid URL.",
      updateForm: event => updateForm(event, path.concat(["url"])),
    },
    bodyType: { 
      value: "",
      isRequired: true,
      name: "Service body type",          
      description: "Body type of the request to be sent to the service.",
      updateForm: event => updateForm(event, path.concat(["bodyType"])),
      validationMessage: "Please select a body type. The field is required.",
      options: ["Reconciliation query", "Full Open API Specification document"]
    },
  })

export const removeAnnotationServiceForm = (updateForm, path, services) =>
  fromJS({
    service: { 
      value: "",
      isRequired: true,
      name: "Service",          
      description: "Service to remove",
      updateForm: event => updateForm(event, path.concat(["service"])),
      validationMessage: "Please select a service. The field is required.",
      options: services
    },
  })