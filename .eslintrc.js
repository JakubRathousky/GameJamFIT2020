module.exports = {
    "env": {
        "browser": true,
        "node": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "@typescript-eslint/eslint-plugin"
    ],
    "rules": {
        "@typescript-eslint/class-name-casing": "error",
        "indent": "off",
        "semi": [2, "always"],
        "@typescript-eslint/indent": [
            "error",
            4,
            {
                "SwitchCase": 1,
                "CallExpression": {
                    "arguments": "off"
                },
                "FunctionDeclaration": {
                    "parameters": "off"
                },
                "FunctionExpression": {
                    "parameters": "off"
                }
            }
        ],
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/member-ordering": "error",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-require-imports": "error",
        "@typescript-eslint/no-use-before-define": "error",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/quotes": [
            "error",
            "single"
        ],
        "@typescript-eslint/type-annotation-spacing": "error",
        "camelcase": "error",
        "capitalized-comments": [
            "off",
            "never"
        ],
        "curly": "error",
        "dot-notation": "off",
        "eol-last": "off",
        "eqeqeq": [
            "error",
            "smart"
        ],
        "guard-for-in": "error",
        "id-blacklist": "error",
        "id-match": "error",
        "max-len": [
            "off",
            {
                "code": 140
            }
        ],
        "no-caller": "error",
        "no-console": [
            "off",
            {
                "allow": [
                    "log",
                    "dirxml",
                    "warn",
                    "error",
                    "dir",
                    "timeLog",
                    "assert",
                    "clear",
                    "count",
                    "countReset",
                    "group",
                    "groupCollapsed",
                    "groupEnd",
                    "table",
                    "Console",
                    "markTimeline",
                    "profile",
                    "profileEnd",
                    "timeline",
                    "timelineEnd",
                    "timeStamp",
                    "context"
                ]
            }
        ],
        "no-debugger": "off",
        "no-empty": "off",
        "no-eval": "error",
        "no-fallthrough": "off",
        "no-new-wrappers": "error",
        "no-redeclare": "error",
        "no-shadow": [
            "off",
            {
                "hoist": "all"
            }
        ],
        "no-trailing-spaces": "error",
        "no-unused-expressions": "off",
        "no-unused-labels": "error",
        "no-var": "error",
        "no-unreachable": "error",
        "radix": "off",
        "spaced-comment": "off"
    }
};
