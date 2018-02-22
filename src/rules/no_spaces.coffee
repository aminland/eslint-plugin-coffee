indentationRegex = /\S/

module.exports = class NoSpaces
    rule:
        name: 'no_spaces'
        level: 'error'
        message: 'Line contains space indentation'
        description: '''
            This rule forbids spaces in indentation. Enough said. It is disabled by
            default.
            '''

    lintLine: (line, lineApi) ->
        # Only check lines that have compiled tokens. This helps
        # us ignore tabs in the middle of multi line strings, heredocs, etc.
        # since they are all reduced to a single token whose line number
        # is the start of the expression.
        indentation = line.split(indentationRegex)[0]
        if lineApi.lineHasToken() and ' ' in indentation
            {columnNumber: indentation.indexOf(' ')}
        else
            null
