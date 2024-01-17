#!/usr/bin/env bun

import { getArgs } from "./args";
import { translate } from "./fetch";

const args = getArgs();
const file = Bun.file(args.file);

const content = await file.json();

const values = Object.values<string>(content);

console.log("translating...");

const translatedValues = await translate({
  from: args.from,
  to: args.to,
  text: values,
});

const translatedContent = Object.keys(content).reduce(
  (accumulator, key, index) => ({
    ...accumulator,
    [key]: translatedValues[index],
  }),
  {},
);

Bun.write("output.json", JSON.stringify(translatedContent, null, 2));

console.log(
  `input file ${args.file}, output output.json: translated ${
    Object.keys(translatedContent).length
  } props from ${args.from} to ${args.to}!`,
);
