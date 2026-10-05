# Transcodify - JavaScript Obfuscator Tool

A powerful browser-based JavaScript code obfuscation tool that helps protect your JavaScript source code by transforming it into a form that's difficult to understand, reverse-engineer, or tamper with.

[Try online here](https://transcodify.com/)

![image](https://github.com/user-attachments/assets/a4118cf9-cc5f-4e8e-90ff-31f7477c5f37)

## Features

- **Client-side obfuscation** - All processing happens in your browser; no code is sent to any server
- **Multiple obfuscation levels** - Choose from low, medium, high, or custom obfuscation settings
- **Advanced options** - Fine-tune every aspect of the obfuscation process
- **String protection** - Transform strings into arrays with multiple encoding options
- **Control flow flattening** - Make code harder to follow by flattening the control flow
- **Dead code injection** - Insert meaningless code to confuse reverse engineering attempts
- **Identifier renaming** - Transform variable and function names to obscure code purpose
- **Self-defending code** - Option to prevent beautification and tampering
- **Minification** - Reduce code size while maintaining functionality
- **Prettify/Beautify** - Format code with proper indentation for readability

## Quick Start

1. Open the tool in your browser (simply open the HTML file locally or host it on a web server)
2. Paste your JavaScript code into the left panel
3. Select an obfuscation preset (Default, Low, Medium, or High)
4. Click the "Obfuscate" button
5. The obfuscated code will appear in the right panel
6. Copy or download the obfuscated code

## Obfuscation Presets

- **Default - High Performance**: Basic obfuscation with minimal performance impact
- **Low Obfuscation - High Performance**: Minimal protection with focus on code performance
- **Medium Obfuscation - Optimal Performance**: Balanced protection and performance
- **High Obfuscation - Low Performance**: Maximum protection with potential performance impact
- **Custom**: Manually configure all obfuscation options

## Advanced Options

### Code Structure
- **Compact Code**: Remove whitespace and comments
- **Control Flow Flattening**: Transform code structure into a state machine
- **Dead Code Injection**: Insert random code blocks to confuse analysis
- **Simplify Code**: Optimize and simplify code patterns

### Identifiers
- **Generator Types**: Hexadecimal, Mangled, Mangled Shuffled, or Dictionary
- **Rename Globals**: Option to rename global variables and functions
- **Transform Object Keys**: Obfuscate object properties
- **Identifier Prefix**: Add a custom prefix to all generated identifiers

### String Transformations
- **String Array**: Move strings into a separate array and replace with references
- **String Array Threshold**: Control which strings are moved to the array
- **Split Strings**: Break strings into chunks to hinder analysis
- **Unicode Escape Sequence**: Convert characters to \uXXXX format

### String Array Options
- **Calls Transform**: Transform array access patterns
- **Rotate**: Add rotate operations to make string retrieval more complex
- **Shuffle**: Randomize the string array order
- **Index Shift**: Add shift operations to array indices

### Encoding Options
- **Base64**: Encode the string array using Base64
- **RC4**: Encrypt the string array using RC4 algorithm
- **Wrappers**: Control how string access functions are generated

### Additional Options
- **Numbers to Expressions**: Convert numbers to arithmetic expressions
- **Debug Protection**: Prevent browser debugging tools
- **Disable Console Output**: Remove console.log statements
- **Self Defending**: Prevent beautification or modification
- **Target Environment**: Browser, Browser (No Eval), or Node.js

## Additional Features

- **Load/Save Code**: Upload JavaScript files or download obfuscated results
- **Save/Load Config**: Save your custom configuration for future use
- **Code Statistics**: See character and line counts for input and output
- **Compression Ratio**: Track how obfuscation affects code size

## Usage Tips

1. **Start with Presets**: Begin with one of the built-in presets and adjust as needed
2. **Test Thoroughly**: Always test your obfuscated code to ensure it works correctly
3. **Performance vs Protection**: Higher obfuscation levels may impact code performance
4. **Self-Defending Code**: Enable this option to prevent code beautification
5. **Target Environment**: Select the appropriate environment where your code will run

## Technical Details

This tool uses the [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator) library and runs entirely in your browser.

## Regression tests

Run `node --test tests/beautify.test.cjs` with Node.js 18 or newer. The tests use
the local formatter and actual application handlers with a mocked DOM, and
compile fixtures without executing submitted code. They do not replace real
browser testing. Formatter provenance is recorded in `vendor/README.md`.
