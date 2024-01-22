import { getArgs } from "./args";
import { translate } from "./fetch";

const args = getArgs();
const input = Bun.file(args.input);
const output = args.output || "output.json";

const inputContent = await input.json();

const inputKeys = Object.keys(inputContent);

let values: string[];
let outputKeys: string[];
let outputContent: Record<string, string> | undefined;

if (args.output && (await Bun.file(args.output).exists())) {
  outputContent = (await Bun.file(args.output).json()) as Record<
    string,
    string
  >;

  const keys = Object.keys(outputContent);

  outputKeys = inputKeys.filter((key) => !keys.includes(key));

  values = outputKeys.map((key) => inputContent[key]);
} else {
  outputKeys = inputKeys;
  values = Object.values<string>(inputContent);
}

process.stdout.write("Translating...");

const translatedValues = await translate({
  ...args,
  text: values,
});

console.log(" DONE");

const translatedContent = outputKeys.reduce(
  (accumulator, key, index) => ({
    ...accumulator,
    [key]: translatedValues[index],
  }),
  outputContent || {},
);

Bun.write(output, JSON.stringify(translatedContent, null, 2));

console.log(
  `Input file: ${args.input}\nOutput: ${output}\nTranslated ${translatedValues.length} props from ${args.from} to ${args.to}!`,
);
