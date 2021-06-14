import { fromJS } from "immutable"

export const annotationServiceForm = (updateForm, path) => 
  fromJS({
    name: {
        value: "",
        name: "Name",
        description: "Name of the service, as it will be shown in the menù.",
        updateForm: event => updateForm(event, path.concat(["description"]))
      },
    url: {
      value: "",
      isRequired: true, 
      name: "URL",
      description: "REQUIRED. The URL for the target documentation. Value MUST be in the format of a URL.",
      updateForm: event => updateForm(event, path.concat(["url"])),
      validationMessage: "Please enter a valid URL."
    },
    //TODO: add tipo di servizio OAS/reconciliation
  })

export const annotationServiceObject = (formData) => { 
  const url = formData.getIn(["url", "value"])
  const name = formData.getIn(["name", "value"])

  if (!url && !name) {
    return null
  }

  const annotationService = {}

  if (url) {
    annotationService.url = url
  }

  if (name) {
    annotationService.name = name
  }

  return annotationService
}
