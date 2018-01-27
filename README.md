# eslint-plugin-coffeescript

Transpiles .coffee and .cjsx files before with coffeescript, then runs eslint checks on them.
The plugin ignores some rules that are impossible to satisfy from coffeescript (see [this file](lib/index.js#L22))

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-coffeescript`:

```
$ npm install eslint-plugin-coffeescript --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-coffeescript` globally.

## Usage

Add `coffeescript` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```yaml
{
    "plugins": [
        "coffeescript", # ...
    ]
}
```

To have imports resolve properly with the `eslint-plugins-imports` module, you must set this plugin to wrap your default parser:
```yaml
{
  "parser": "eslint-plugin-coffeescript",
  "parserOptions": { 
    "parser": "babel-eslint", # original parser goes here (you must specify one to use this option).
    "sourceType": "module", # any original parser config options you had.
    "ecmaVersion": 6
  }
}
```





