import { z } from "zod";

const endpoint = "http://127.0.0.1:5000/translate";

const options = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
} satisfies Parameters<typeof fetch>[1];

type Props = {
  to: string;
  from: string;
};

// overloading
type Translate = {
  (props: Props & { text: string }): Promise<string>;
  (props: Props & { text: string[] }): Promise<string[]>;
};

export const translate: Translate = async ({ to, from, text }) => {
  const payload = { q: text, source: from, target: to, format: "text" };

  const response = await (
    await fetch(endpoint, {
      ...options,
      body: JSON.stringify(payload),
    })
  ).json();

  if (typeof text === "string") {
    return z.object({ translatedText: z.string() }).parse(response)
      .translatedText as string & string[];
  }

  return z.object({ translatedText: z.array(z.string()) }).parse(response)
    .translatedText as string & string[];
};
