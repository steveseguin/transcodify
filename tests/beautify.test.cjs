const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(process.env.TRANSCODIFY_HTML || path.join(root, 'index.html'), 'utf8');
const assets = ['prettier-3.9.9.js', 'prettier-babel-3.9.9.js', 'prettier-estree-3.9.9.js'];
const formatters = assets.map(name => fs.readFileSync(path.join(root, 'vendor', name), 'utf8'));
const script = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];

function app(mode = 'normal') {
    const elements = {};
    for (const match of html.matchAll(/<(\w+)\b([^>]*\bid="([^"]+)"[^>]*)>/g)) {
        const listeners = {};
        elements[match[3]] = {
            value: '', type: '', tagName: match[1].toUpperCase(),
            classList: { add() {}, remove() {}, toggle() {} },
            addEventListener(name, handler) { listeners[name] = handler; }, listeners
        };
    }
    const context = vm.createContext({
        document: { getElementById: id => elements[id], addEventListener() {} },
        addEventListener() {}, setTimeout() {}, console
    });
    context.window = context;
    // Run only the trusted app and vendored formatter, never input fixture code.
    if (mode !== 'missing') for (const formatter of formatters) vm.runInContext(formatter, context);
    if (mode === 'throwing') context.prettier = { format: async () => { throw new Error('test formatter failure'); } };
    vm.runInContext(script, context);
    return {
        elements, context,
        async format(source, button = 'beautifyBtn') {
            const field = button === 'beautifyBtn' ? 'inputCode' : 'outputCode';
            elements[field].value = source;
            await elements[button].listeners.click();
            return elements[field].value;
        }
    };
}

const cases = [
    ['regular expression character class', 'const re=/[a-z]+/gi;', ['/[a-z]+/gi']],
    ['regex punctuation and escapes', String.raw`const re=/[{};,\]\/]+/g;`, [String.raw`/[{};,\]\/]+/g`]],
    ['division beside regex', 'const ratio=total/count; const matches=/x/.test(text);', ['total / count', '/x/.test(text)']],
    ['line comment semicolon remains commented', '// explanation; globalThis.unexpected = true;\nconst ok=true;', ['// explanation; globalThis.unexpected = true;\n']],
    ['block comment punctuation', '/* [{;,}] */ const value=1;', ['/* [{;,}] */']],
    ['quoted punctuation', 'const text="[{},;]";', ['"[{},;]"']],
    ['template raw content', 'const text=`line one;{[\nline two]}`;', ['`line one;{[\nline two]}`']],
    ['nested template interpolation', 'const text=`outer ${`inner ${x + 1}`} end`;', ['`outer ${`inner ${x + 1}`} end`']],
    ['automatic semicolon insertion after return', 'function example(){return\n{answer:42};}', [/return;\n\s*\{/]],
    ['automatic semicolon insertion before regex', 'function example(){return\n/a;b/.test(text);}', [/return;\n\s*\/a;b\//]],
    ['automatic semicolon insertion before increment', 'let a=1,b=2; a\n++b;', [/a;\n\s*\+\+b;/]],
    ['ordinary object and array', 'const value={a:[1,2]};', ['a: [1, 2]']],
    ['private field and optional chaining', 'class Example{#x=1;get(){return this?.#x;}}', ['#x = 1', 'this?.#x']]
];

for (const [name, source, fragments] of cases) {
    test(name + ' through both buttons', async () => {
        // Compile only, without executing the input or output code.
        new vm.Script(source);
        for (const button of ['beautifyBtn', 'prettifyBtn']) {
            const ui = app();
            const result = await ui.format(source, button);
            new vm.Script(result);
            for (const fragment of fragments) {
                if (fragment instanceof RegExp) assert.match(result, fragment);
                else assert.ok(result.includes(fragment), JSON.stringify({ fragment, result }));
            }
            assert.equal(ui.elements.notification.textContent, 'Code beautified');
            assert.equal(await ui.format(result, button), result, 'formatting is idempotent');
        }
    });
}

for (const mode of ['missing', 'throwing']) {
    test(mode + ' formatter preserves original and reports failure', async () => {
        for (const button of ['beautifyBtn', 'prettifyBtn']) {
            const ui = app(mode);
            const source = '  // keep all whitespace;\nconst x=1;  ';
            assert.equal(await ui.format(source, button), source);
            assert.match(ui.elements.notification.textContent, /^Error beautifying code:/);
        }
    });
}

test('empty input remains unchanged', async () => {
    const ui = app();
    assert.equal(await ui.format('   '), '   ');
    assert.equal(ui.elements.notification.textContent, 'No code to beautify');
});

test('formatting never evaluates submitted code', async () => {
    const ui = app();
    const source = 'throw new Error("input must never run");';
    assert.match(await ui.format(source), /throw new Error/);
    assert.equal(ui.elements.notification.textContent, 'Code beautified');
});

test('pinned offline formatter assets are unchanged', () => {
    const hashes = [
        '07dc0ed97036eb246f66fe47a1234fd0978d0662d1ecb7876b6e57681ed8a57c',
        '5249a89653aae718f7a0fb94577a09768f18b865df832cfe68d8158c8207af5c',
        '7af7b9e59af8113e22d9b25653a760c372fa8d7c04e9adf67d0037c6ebf862b4'
    ];
    assets.forEach((name, i) => {
        assert.ok(html.includes(`<script src="vendor/${name}"></script>`));
        assert.equal(crypto.createHash('sha256').update(formatters[i]).digest('hex'), hashes[i]);
    });
});

test('invalid JavaScript preserves original and reports parse failure', async () => {
    const ui = app();
    const source = 'const broken = ;';
    assert.equal(await ui.format(source), source);
    assert.match(ui.elements.notification.textContent, /^Error beautifying code:/);
});

test('an edit during formatting is never overwritten', async () => {
    const ui = app();
    let resolve;
    ui.context.prettier = { format: () => new Promise(r => { resolve = r; }) };
    const pending = ui.format('const before=1;');
    ui.elements.inputCode.value = 'const after=2;';
    resolve('const before = 1;\n');
    assert.equal(await pending, 'const after=2;');
    assert.match(ui.elements.notification.textContent, /^Code changed while formatting/);
});

test('an older formatting request cannot overwrite the latest result', async () => {
    const ui = app();
    const resolvers = [];
    ui.context.prettier = { format: () => new Promise(r => resolvers.push(r)) };
    const first = ui.format('const first=1;');
    const second = ui.format('const second=2;');
    resolvers[1]('const second = 2;\n');
    await second;
    resolvers[0]('const first = 1;\n');
    await first;
    assert.equal(ui.elements.inputCode.value, 'const second = 2;\n');
});
