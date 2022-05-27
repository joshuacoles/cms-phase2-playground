/*
* A mockup of the possible output from the frontend table from which we could build a zod schema
* */

export type FieldType =
  | { type: 'date', format: string }
  /*
  * There are number of additional transformations which are performed on the data by the application which we may want
  * to allow the user to specify
  * */
  | { type: 'string', additionalTransformations?: ('trim' | 'remove-new-lines')[] }
  | { type: 'integer' }
  | { type: 'mapping', mapping: ValueMapping[] }
  /*
  * A primary key is just a string, but we will ensure it is unique among all records.
  *
  * I would suggest we leave in inside the object, applying any renames as requested, but this property should also be
  * pulled out from the data object at large.
  * */
  | { type: 'primary-key' }
  /*
   * A group key is the onsId or ccId which is used to group records in the frontend. If the group represents a
   * complete matching group where this key is to be used as the matching id isMatchingGroup should be true.
   *
   * For example onsId would be isMatchingGroup = false as we can match the individual rows independently, however for
   * the ccId column in the census data isMatchingGroup = true as all records in a group are matched together.
   * */
  | { type: 'group-key', isMatchingGroup: boolean }

/*
* This assumes we are always given strings (fromValue) and for now we don't have any types on the mappedTo value.
* */
export type ValueMapping = { fromValue: string, mappedTo: unknown }

/*
* An example of sex mapping as it exists in the application.
* */
const sexMappings: ValueMapping[] = [
  { fromValue: '1', mappedTo: 'Female' },
  { fromValue: '2', mappedTo: 'Male' },
]

/*
* -9 is used throughout the data to signify an empty value.
* */
export const emptyValues: ValueMapping[] = [
  { fromValue: '-9', mappedTo: '' },
]

export interface Field {
  /*
  * The input name in the CSV file (or other raw data source). For example ONS_ID
  * */
  rawName: string

  /*
  * The name to be consumed by the frontend. For now this is a json property name, but it could be extended to be some
  * form of more rich field name (with human name, etc). This is important for unifying disparate data sources to have a
  * common name (for example 'forename', 'first_name', and 'first_name_clean' could all map to 'firstName').
  *
  * This is optional unless it is specified the rawName will be used instead
  * */
  alias?: string

  /*
  * This is where we might add "additional" mappings such as -9 to an empty value. These are separate from what might be
  * described as main mappings (the "happy path" where everything is going right) which would be present in the
  * fieldType
  * */
  additionalMappings?: ValueMapping[]

  /*
  * The type of this field. See type for more docs.
  * */
  fieldType: FieldType

  /*
  * If this field should be displayed.
  * */
  shouldDisplay: boolean

  /*
  * Some notes to be displayed about the field in the table.
  * */
  description: string

  /*
  * A default value. Currently PRE adaption
  * */
  defaultValue?: string
}

/*
* So for example we might represent the table shown in Greg's example as:
* */

const hesaFields: Field[] = [
  {
    rawName: 'ONS_ID',
    fieldType: { type: 'group-key', isMatchingGroup: false },
    shouldDisplay: false,
    description: 'Group DI Records'
  },
  {
    rawName: 'Data_Source',
    alias: 'data_source',
    fieldType: { type: 'string' },
    shouldDisplay: true,
    description: 'Always HESA'
  },
  {
    rawName: 'guid',
    fieldType: { type: 'integer' },
    shouldDisplay: false,
    description: 'Unique key for this record - Not used'
  },
  {
    rawName: 'HESA_ID',
    fieldType: { type: 'primary-key' },
    shouldDisplay: false,
    description: 'Unique key for this record'
  },
  {
    rawName: 'forename_clean',
    fieldType: { type: 'string', additionalTransformations: ["trim", "remove-new-lines"] },
    shouldDisplay: true,
    description: 'First name'
  },
  {
    rawName: 'date of birth',
    alias: 'dob',
    // Note I have changed the date format to be aligned with dateFns
    fieldType: { type: 'date', format: 'dd-MM-yyyy' },
    shouldDisplay: true,
    description: ''
  },
]

/*
* For now I have left off the distinction between matching data and search data as I think mirroring between them would
* be the correct direction moving forwards.
* */
export interface SecondaryDatasetDefinition {
  name: string
  fields: Field[]
}

export const hesaDataset: SecondaryDatasetDefinition = {
  name: 'HESA',
  fields: hesaFields
}

