# @fellow/eslint-plugin-coffee

Transpiles coffee files first with coffeescript, then runs eslint checks on them. Line / Column reporting is processed through sourcemap data, so they will be accurate for your coffee files.

The plugin ignores some rules that are impossible to satisfy from coffeescript (see [this file](src/processors.coffee#L8))

It additionally runs rules from [coffeelint2](https://www.npmjs.com/package/@fellow/coffeelint2) by creating a fake rule in eslint which wraps and maps the coffeelint2 rules. 

**Special thanks** to [Alexander Mextner](https://github.com/a-x-) for getting this started and providing the base code.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `@fellow/eslint-plugin-coffee`:

```
$ npm install @fellow/eslint-plugin-coffee --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `@fellow/eslint-plugin-coffee` globally.


## Easy Usage
Edit your `.eslintrc` file. and add this plugin. The easiest configuration is to just extend the base config provided to get a good set of rules ([see here](src/configs/recommended.coffee)). You can omit the `eslint-plugin-` prefix when configuring eslint.

**Note:** If you prefer the use of tabs, make sure to extend <code>@fellow/coffee/**recommended-tabs**</code> instead.

```yaml
{ 
    "extends": ["plugin:@fellow/coffee/recommended"],
    "plugins": [
      "@fellow/coffee", 
      # ...
    ]
}
```

## Manual Configuration
For ESLint rules only, add `@fellow/coffee` to the plugins section of your `.eslintrc` configuration file. This will cover many things well if use a good set of base rules. As always, you can omit the `eslint-plugin-` prefix:

```yaml
{
  "plugins": [
    "@fellow/coffee", 
      # ...
  ]
}
```

For better compatibility with other plugins (e.g. `eslint-plugins-imports`), I also provide a "parser" which eslint can hook into. Plugins like the `import` plugin do not run through checks or otherwise require  module, you must set this plugin to wrap your default parser:
```yaml
{
  "parser": "@fellow/eslint-plugin-coffee",
  "parserOptions": { 
    "parser": "babel-eslint", # original parser goes here (you must specify one to use this option).
    "sourceType": "module", # any original parser config options you had.
    "ecmaVersion": 6
  },
  "plugins": [
    "@fellow/eslint-plugin-coffee", 
    # ...
  ],
  "rules": {
    "@fellow/coffee/coffeescript-error": ["error", {}],
    # ...
  }

}
```

To see how to add your own coffeelint-style rules, switch your `.eslintrc` -> `.eslintrc.js` and add:
`require('@fellow/eslint-plugin-coffee').registerCoffeeLintRule('myRuleModule')` at the top. 

Then include it in the `rules` section of your `.eslintrc.js`, passing any config options your rule might expect. 

To learn how to write rules for coffeelint, check their docs.





## Editor compatibility
### VSCode
For linting to work in VS Code, install the `eslint` extension and add the following to your workspace settings:
```
"settings": {
    ...
    "files.associations": {
        "*.cjsx": "coffeescript"
    },
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "coffeescript"
    ],
},
```

