({
    preserveLicenseComments:            false,
    removeCombined:                     true,

    appDir:                             'rainbowpaypress/js/le_requirejs',
    baseUrl:                            '.',
    dir:                                'rainbowpaypress/js/le_requirejs_min/',
    paths: {
            'backbone':                 'lib/backbone-1.2.1-src--tweaked--2016-03-18--01--require_js_namespaced--96823d9d2ce7d6fa095b5ad66040763fdbefbb20',
            'jquery':                   'lib/jquery-1.11.3--tweaked--2016-03-18--01--require_js_namespaced--086ae49754c1cf947313f980cceb37cf1bb50555',
            'underscore':               'lib/underscore-1.8.3-src--tweaked--2016-03-18--01--require_js_namespaced--dbc6c74d82a3d827ceeab4d8ede133b375197411'
        },
    map: {
            '*': {
                    'backbone': 'backbone-private',
                    'jquery': 'jquery-private',
                    'underscore': 'underscore-private'
                },
            'backbone-private': {
                    'backbone': 'backbone'
                },
            'jquery-private': {
                    'jquery': 'jquery'
                },
            'underscore-private': {
                    'underscore': 'underscore'
                }
        },
    modules: [{name:  'main'}]
})
