module.exports = {
    default: [
        `__tests_specs/features/**/*.feature`,
        `--require-module ts-node/register`,
        `--require __tests_specs/step_definitions/**/*.ts`,
        `--format-options '{"snippetInterface": "synchronous"}'`,
        `-f @cucumber/pretty-formatter`
    ].join(' '),
};
