import { getArgs } from "./args";
import { translate } from "./fetch";

type Json = {
  [key: string]: string | Json;
};

let translatedCounter = 0;

const translateProps = async (
  args: ReturnType<typeof getArgs>,
  input: Json,
  output?: Json,
): Promise<Json> =>
  Object.entries(input).reduce(
    async (accumulatorPromise, [key, value]) => {
      const accumulator = await accumulatorPromise;

      if (typeof value === "object") {
        const nestedOutput = output?.[key];

        value = await translateProps(
          args,
          value,
          typeof nestedOutput === "object" ? nestedOutput : undefined,
        );
      } else if (output && key in output) {
        value = output[key];
      } else if (typeof value === "string") {
        // empty strings return undefined
        value = value && (await translate({ ...args, text: value }));
        translatedCounter++;
      }

      return { ...accumulator, [key]: value };
    },
    Promise.resolve(output ?? {}),
  );

const args = getArgs();
const input = Bun.file(args.input);
const output = args.output || "output.json";

const inputContent = await input.json();

const outputFile = Bun.file(output);

const outputContent =
  args.output && (await outputFile.exists())
    ? await outputFile.json()
    : undefined;

process.stdout.write("Translating...");

const translatedContent = await translateProps(
  args,
  inputContent,
  outputContent,
);

console.log(" DONE");

Bun.write(output, JSON.stringify(translatedContent, null, 2));

console.log(
  `Input file: ${args.input}\nOutput: ${output}\nTranslated ${translatedCounter} props from ${args.from} to ${args.to}!`,
);
