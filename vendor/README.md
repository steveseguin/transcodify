# Vendored JavaScript formatter

The unmodified Prettier 3.9.9 standalone browser bundle and its Babel/ESTree
plugins are copied from the official npm package, with the MIT license.
These local assets keep formatting offline; submitted code is parsed and
formatted, never executed or sent to a formatting service.

- Upstream: https://github.com/prettier/prettier
- Package: https://www.npmjs.com/package/prettier/v/3.9.9
- Tarball: https://registry.npmjs.org/prettier/-/prettier-3.9.9.tgz
- Verified npm tarball integrity: `sha512-Z/CJHIkdujO/OtN7nXUii0Rf3VT5SRuhjBA82Xvu2XhBUgX3nhP67T0LHceBdQLex7OOFGTox+Q5Yg8Jk2Qivg==`
- License: `prettier-LICENSE`; bundled dependency notices: `prettier-THIRD-PARTY-NOTICES.md`

Original package paths: `standalone.js`, `plugins/babel.js`, `plugins/estree.js`.
SHA-256 hashes:

- `prettier-3.9.9.js`: `07dc0ed97036eb246f66fe47a1234fd0978d0662d1ecb7876b6e57681ed8a57c`
- `prettier-babel-3.9.9.js`: `5249a89653aae718f7a0fb94577a09768f18b865df832cfe68d8158c8207af5c`
- `prettier-estree-3.9.9.js`: `7af7b9e59af8113e22d9b25653a760c372fa8d7c04e9adf67d0037c6ebf862b4`

Prettier parses supported JavaScript with its Babel parser; this does not
promise validation or preservation of every language extension. Formatting
errors retain the original textarea. Edits made while formatting is pending
and newer formatting requests take precedence over an older result.

To upgrade, verify the official package integrity, replace all three matching
assets and license, update provenance/hashes, and run the regression tests.
