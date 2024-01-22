# jsontl

Script to translate the values in json files with [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate).

## Usage

The script uses [Bun](https://bun.sh/), and assumes that LibreTranslate is running on host `127.0.0.1` port `5000` by default. Clone the repository and install the dependencies before running:

```console
$ git clone https://github.com/The-Bubble-Company/jsontl.git
$ cd jsontl
$ bun install
```

Alternatively, the script can be installed globally without cloning the repository:

```console
$ bun i git+https://github.com/The-Bubble-Company/jsontl.git --global
```

To translate the values in `input.json` from English to German execute the script with the following parameters inside the cloned repository:

```console
$ ./jsontl --from en --to de --input input.json
```

or if installed globally:

```console
$ jsontl --from en --to de --input input.json
```

An `output.json` file will be generated in the current directory with the same properties and the translated values.

If desired, an output file can be specified with `--output`; only new properties will be added if the specified file exists (existent properties won't be touched):

```console
$ jsontl --from en --to de --input english.json --output german.json
Translating... DONE
Input file: english.json
Output: german.json
Translated 10 props from en to de!
```
