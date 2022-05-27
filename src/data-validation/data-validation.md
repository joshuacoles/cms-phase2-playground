# Data Validation

## 1. Making Zod schemas

In `example-zod-schemas.ts` you can see an experiment in making zod schemas which model the different adaption which is
done to the data in the cms.

## 2. Modelling the secondary dataset table

A quick model of what a slightly augmented dataset schema table might output can be seen in `data-table-output.ts`.

## 3. An adaption between them.

## Open Questions

- How do we handle joins?
  - Unless shown otherwise, I feel this is the 80:20, we can do the joins on an as-needed basis in code.
- At the moment I have allowed for the use of a couple simple transformations on strings, how do we want to handle this
  to avoid exploding complexity?
