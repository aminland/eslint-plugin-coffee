# eslint-plugin-coffeescript

Transpile coffee files before eslint checks will be run

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

```json
{
    "plugins": [
        "coffeescript"
    ]
}
```





