# eslint-plugin-coffee

Transpiles .coffee and .cjsx files before with coffeescript, then runs eslint checks on them.
The plugin ignores some rules that are impossible to satisfy from coffeescript (see [this file](lib/index.js#L22))

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

## Manual Usage
Add `@fellow/coffee` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```yaml
{
    "plugins": [
    "@fellow/coffee", # ...
    ]
}
```

To have imports resolve properly with the `eslint-plugins-imports` module, you must set this plugin to wrap your default parser:
```yaml
{
  "parser": "@fellow/eslint-plugin-coffee",
  "parserOptions": { 
    "parser": "babel-eslint", # original parser goes here (you must specify one to use this option).
    "sourceType": "module", # any original parser config options you had.
    "ecmaVersion": 6
  },
  "plugins": [
    "@fellow/eslint-plugin-coffee", # ...
  ],
  "rules": {
    "@fellow/coffee/coffeescript-error": ["error", {}],
    ...
  }

}
```

You can add rules from my modified[coffeelint](https://github.com/aminland/coffeelint2). 


## Easy Usage
The easiest configuration is to just extend the base config provided to get a good set of rules ([see here](src/configs/recommended.coffee)):

```yaml
{	
    "extends": ["plugin:@fellow/coffee/recommended"],
    "plugins": [
        "@fellow/coffee", # ...
    ]
}
```





