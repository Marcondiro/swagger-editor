import vocabulary from "./vocabulary"

const anyOf = (...objs) => objs ? Object.assign({}, ...objs) : {}
const stringEnum = (arr) => arr

const Any = null

export const Schema = {
  get allOf () { return this },
  get oneOf () { return this },
  get anyOf () { return this },
  get not () { return this },
  get items () { return this },
  get properties () {
    return {
      ".": this,
    }
  },
  get additionalProperties () { return this },
  "x-semanticAnnotation": vocabulary,
}

export const MediaType = {
  schema: Schema,
}

export const Parameter = {
  schema: Schema
}

export const Header = {
  schema: Schema,
}

export const RequestBody = {
  content: {
    ".": MediaType,
  },
}

export const Response = {
  headers: {
    ".": Header,
  },
  content: {
    ".": MediaType,
  },
}

export const Responses = {
  default: Response,
  "\\d\\d\\d|\\d\\dX|\\dXX": Response,
}

const ComponentFixedFieldRegex = "^[a-zA-Z0-9\.\-_]+$"

export const Components = {
  schemas: {
    [ComponentFixedFieldRegex]: Schema,
  },
  responses: {
    [ComponentFixedFieldRegex]: Response,
  },
  parameters: {
    [ComponentFixedFieldRegex]: Parameter,
  },
  examples: {
    [ComponentFixedFieldRegex]: null,
  },
  requestBodies: {
    [ComponentFixedFieldRegex]: RequestBody,
  },
  headers: {
    [ComponentFixedFieldRegex]: Header,
  },
  securitySchemes: {
    [ComponentFixedFieldRegex]: null,
  },
  links: {
    [ComponentFixedFieldRegex]: null,
  },
  callbacks: {
    get [ComponentFixedFieldRegex]() { return null },
  },
}

export const Operation = {
  parameters: [Parameter],
  requestBody: RequestBody,
  responses: Responses,
}

export const PathItem = anyOf({
  get: Operation,
  put: Operation,
  post: Operation,
  delete: Operation,
  options: Operation,
  head: Operation,
  patch: Operation,
  trace: Operation,
  parameters: Parameter,
})

export const Paths = {
  "/.": PathItem,
}
