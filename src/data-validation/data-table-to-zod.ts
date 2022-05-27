import * as z from 'zod'

import { Field, FieldType, hesaDataset, SecondaryDatasetDefinition, emptyValues, ValueMapping } from './data-table-output'
import { ZodAny } from "zod";

/*
* For now I am assuming we get everything out as strings.
* */
type RawRecord = Record<string, string>

/*
* Generate a function which renames properties of an object and add default values according to the schema. Again types for now are
* */
function renameAndDefault(fields: Field[]) {
  return (rawObject: RawRecord): RawRecord => {
    const keyValuePairs = fields.map(field => {
      const value = rawObject[field.rawName] ?? field.defaultValue
      return [field.alias ?? field.rawName, value]
    })

    return Object.fromEntries(keyValuePairs)
  }
}

function generateSecondaryDatasetSchema(datasetDefinition: SecondaryDatasetDefinition): ZodAny {

}
