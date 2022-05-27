import * as z from 'zod'
import * as dFns from 'date-fns'

/*
* Building blocks of taking what might be specified in the table UI Greg designed, to create a zod parser which will
* perform schema validation and adaption.
*
* Sentinel is a special value that has a special meaning, for example -9 is empty or null.
* */

/*
* A simple string that allows -9 to be specified to allow for an empty value.
*
* This also provides a default value of an empty string, if the value is not present.
* */
const stringWithSentinels = z.union([
  z.literal('-9').transform(() => ''),
  z.string(),
]).default('')

/*
* Example of a numeric field (stored as a string) being mapped to a number of values according to a business provided map
* */
const sex = z.union([
  z.literal('1').transform(() => 'Female'),
  z.literal('2').transform(() => 'Male'),
])

/*
* An example of parsing dates, the format string might be provided directly by the user (at which point we might want to
* provide some documentation for it) or out of a number of options.
* */
const dateFormattedWithSentinels = z.union([
  z.literal('-9').transform(() => null),
  z.string()
    // Parsing will return an invalid date NOT throw if it does not meet the requirements (not throwing is a requirement
    // for zod transforms)
    .transform(string => dFns.parse(string, 'yyyy-MM-dd', new Date()))
    .refine(date => dFns.isValid(date)),
])

const complexObject = z.object({
  sex,
  date: dateFormattedWithSentinels,
  str: stringWithSentinels
})

console.log(stringWithSentinels.safeParse('-9'))
console.log(dateFormattedWithSentinels.safeParse('-9'))
console.log(complexObject.safeParse({
  sex: '1',
  date: '2022-10-10',
  str: undefined
}))
