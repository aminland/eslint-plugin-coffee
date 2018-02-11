import path from 'path';

import test from 'ava';
import coffeePlugin from '../src';
import { CLIEngine } from 'eslint';

var cli = new CLIEngine({
	configFile: path.resolve(__dirname, '.eslintrc')
});
cli.addPlugin("eslint-plugin-coffeelint", coffeePlugin);

var lintFile = (file) => {
	return cli.executeOnFiles([path.resolve(__dirname, file)])
}


test('No Errors', t => {
	var {results} = lintFile('correct.coffee')
	t.deepEqual(results[0].messages.length, 0);
});

test('Errors found', t => {
	var {results} = lintFile('incorrect.coffee')
	t.deepEqual(results[0].messages.map((x)=>x.message), ["'unused' is assigned a value but never used."])
});

test('Parser Error', t => {
	t.throws(()=>lintFile('parseerror.coffee'))
});
