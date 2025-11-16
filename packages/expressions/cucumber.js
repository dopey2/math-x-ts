module.exports = {
    default: [
        `__specs__/features/**/*.feature`,
        `--require-module ts-node/register`,
        `--require __specs__/step_definitions/**/*.ts`,
        `--format-options '{"snippetInterface": "synchronous"}'`,
        `-f @cucumber/pretty-formatter`
    ].join(' '),
};
