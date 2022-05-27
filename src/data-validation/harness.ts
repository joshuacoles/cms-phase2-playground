import { hesaDataset } from "./data-table-output";
import { generateSecondaryDatasetSchema } from "./data-table-to-zod";

const sc = generateSecondaryDatasetSchema(hesaDataset)
console.log(sc.safeParse({
  "ONS_ID": '2',
  "Data_Source": 'HESA',
  "guid": '123',
  "HESA_ID": '123',
  "forename_clean": "First Name SAHIOF   \nheeee",
  "date of birth": "10-10-2022"
}))

console.log(sc.safeParse({
  "ONS_ID": '2',
  "Data_Source": 'HESA',
  "guid": '123',
  "HESA_ID": '123',
  "forename_clean": "First Name SAHIOF   \nheeee",
  "date of birth": "-9"
}))
