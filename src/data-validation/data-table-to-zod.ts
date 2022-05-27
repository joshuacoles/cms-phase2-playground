import * as z from 'zod'

import {
  Field,
  FieldType,
  SecondaryDatasetDefinition,
  ValueMapping
} from './data-table-output'
import { ZodTypeAny } from "zod";
import dFns from "date-fns";

/*
* For now I am assuming we get everything out as strings.
* */
type RawRecord = Record<string, string>

/*
* A function which renames properties of an object according to the schema.
*
* Again types for now are very relaxed.
* */
function rename(fields: Field[], rawObject: RawRecord): RawRecord {
  const keyValuePairs = fields.map(field => {
    const value = rawObject[field.rawName] ?? field.defaultValue
    return [field.alias ?? field.rawName, value]
  })

  return Object.fromEntries(keyValuePairs)
}

function ftSch(fieldType: FieldType): ZodTypeAny {
  if (fieldType.type === 'string') return z.string()
  if (fieldType.type === 'primary-key') return z.string()
  if (fieldType.type === 'group-key') return z.string()
  if (fieldType.type === 'integer') return z.string().transform(str => Number.parseInt(str)).refine(number => !Number.isNaN(number))
  if (fieldType.type === 'date') {
    return z.string()
      // Parsing will return an invalid date NOT throw if it does not meet the requirements (not throwing is a requirement
      // for zod transforms)
      .transform(string => dFns.parse(string, fieldType.type, new Date()))
      .refine(date => dFns.isValid(date))
  }

  if (fieldType.type === 'mapping') return z.union(mapSch(fieldType.mapping) as ProgrammaticUnion)

  throw new Error(`Unknown field type ${fieldType}`)
}

/*
* Zod tries to be smart and require at least 3 items!
* */
type ProgrammaticUnion = [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]

function mapSch(additionalMappings: ValueMapping[]): ZodTypeAny[] {
  return additionalMappings.map(mapping => z.literal(mapping.fromValue).transform(() => mapping.mappedTo));
}

function fSch(field: Field): ZodTypeAny {
  const additionalMappings = field.additionalMappings ?? []
  const ams = mapSch(additionalMappings)

  return z.union([
    ftSch(field.fieldType),
    ...ams
  ] as ProgrammaticUnion).default(field.defaultValue)
}

export function generateSecondaryDatasetSchema(datasetDefinition: SecondaryDatasetDefinition): ZodTypeAny {
  const fschsPairs = datasetDefinition.fields.map(field => [field.alias ?? field.rawName, fSch])
  const shape = Object.fromEntries(fschsPairs)

  return z.preprocess(raw => rename(datasetDefinition.fields, raw as RawRecord), z.object(shape))
}
