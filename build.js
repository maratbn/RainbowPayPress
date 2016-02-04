({
    preserveLicenseComments:            false,
    removeCombined:                     true,

    appDir:                             'plugin/js/le_requirejs',
    baseUrl:                            '.',
    dir:                                'plugin/js/le_requirejs_min/',
    paths: {
            'backbone':                 'lib/backbone-1.2.1-src--tweaked--2015-09-24--01--require_js_namespaced--5decf311fc2fa509f63fda82e4bc2e465aeb5545',
            'jquery':                   'lib/jquery-1.11.3--tweaked--2015-09-24--01--require_js_namespaced--4c456884bd01dd192d549715b5ef4312f4f82b12',
            'underscore':               'lib/underscore-1.8.3-src--tweaked--2015-09-24--01--require_js_namespaced--20b06731438f520e64b47005d5dfafcea43f3bad'
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
    modules: [{name:  'backbone-private'},
              {name:  'jquery-private'},
              {name:  'underscore-private'},
              {name:  'admin/main_admin'},
              {name:  'public/main_public'}]
})
