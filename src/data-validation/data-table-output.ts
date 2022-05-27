/*
* A mockup of the possible output from the frontend table from which we could build a zod schema
* */

type FieldStructure =
  | { type: 'date', format: string }
  | { type: 'string' }
  | { type: 'integer' }
  | { type: 'primary-key' }

/*
* This assumes we are always given strings (fromValue) and for now we don't have any types on the mappedTo value.
* */
type Sentinels = { fromValue: string, mappedTo: unknown }[]

const sexSentinels: Sentinels = [
  { fromValue: '1', mappedTo: 'Female' },
  { fromValue: '2', mappedTo: 'Male' },
]

const emptySentinels: Sentinels = [
  { fromValue: '-9', mappedTo: '' },
]
