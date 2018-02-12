# Originally from original coffeelint

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import findRemoveSync from 'find-remove'
import CoffeeScript from 'coffeescript'
import {version as pluginVer} from './../package.json'

csVer = (window?.CoffeeScript or CoffeeScript).VERSION

CACHE_PREFIX = ".eslintcoffee-"

localMem = {}
export default class Cache
    read: (path) -> localMem[path]
    write: (path, value) -> localMem[path] = value
    exists: (path) -> !!Object.getOwnPropertyDescriptor(localMem, path)

    constructor: (@basepath='', {@cacheTimeout=3600*60, config={}}={}) ->
        @setConfig config

        if !!@basepath
            unless fs.existsSync @basepath
                fs.mkdirSync @basepath
            @write = fs.writeFileSync
            @read = fs.readFileSync
            @exists = fs.existsSync

            findRemoveSync @basepath, {age: {seconds: @cacheTimeout}, prefix: CACHE_PREFIX}

    path: (source) ->
        path.join @basepath, "#{CACHE_PREFIX}-#{csVer}-#{pluginVer}-#{@prefix}-#{@hash(source)}"

    get: (source) -> JSON.parse @read @path(source), 'utf8'

    set: (source, result) ->
        @write @path(source), JSON.stringify result

    has: (source) -> @exists @path source

    hash: (data) ->
        crypto.createHash('md5').update('' + data).digest('hex').substring(0, 8)

    # Use user config as a "namespace" so that
    # when he/she changes it the cache becomes invalid
    setConfig: (config) -> @prefix = @hash(JSON.stringify({timeout:@cacheTimeout, basepath:@basepath}) + JSON.stringify(config))
