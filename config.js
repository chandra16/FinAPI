const Confidence = require('confidence');

const criteria = {
    env: process.env.NODE_ENV || 'local'
};

const config = {
    $meta: 'This file is configuration of middleware',
    projectName: 'danon-middleware',
    port: {
        api: {
            $filter: 'env',
            dev: 8102,
            preprod: 2213,
            $default: process.env.NODE_PORT || 3000
        }
    },
    routes: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['TRANSACTIONID', 'CHANNELID', 'SUBCHANNELID', 'X-REQUESTED-WITH', 'DANON-WEB-APP-VERSION']
        }
    },
    logging: {
        reporters: {
            myConsoleReporter: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ fatal: '*', error: '*', info: '*', log: '*', debug: '*', response: '*' }]
            }, {
                module: 'good-console'
            }, 'stdout'],
            myFileReporter: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ fatal: '*', error: '*', info: '*', log: '*', debug: '*' }]
            }, {
                module: 'good-squeeze',
                name: 'SafeJson'
            }, {
                module: 'good-file',
                args: [{
                    $filter: 'env',
                    local: './log/web-api-local.log',
                    dev: './log/web-api-dev.log',
                    preprod: './log/web-api-preprod.log',
                    $default: './log/web-api-local.log'
                }]
            }]
        }
    },
    dbConnection: {
        $filter: 'env',
        local: {
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'danon',
            port: 3306,
            connectionLimit: 50,
            thread_handling: 'pool-of-threads',
            thread_pool_size: 32,
            thread_pool_stall_limit: 300,
            thread_pool_oversubscribe: 10
        },
        dev: {
            host: '202.182.55.134',
            user: 'danon',
            password: 'D4non1209',
            database: 'danon',
            port: 8106,
            connectionLimit: 50,
            thread_handling: 'pool-of-threads',
            thread_pool_size: 32,
            thread_pool_stall_limit: 300,
            thread_pool_oversubscribe: 10
        },
        preprod: {
            host: '192.168.31.4',
            user: 'danon',
            password: 'D4non1209',
            database: 'danon',
            port: 2210,
            connectionLimit: 50,
            thread_handling: 'pool-of-threads',
            thread_pool_size: 32,
            thread_pool_stall_limit: 300,
            thread_pool_oversubscribe: 10
        },
        $default: {
            host: '127.0.0.1',
            user: 'root',
            password: ' ',
            database: 'danon',
            port: 3306,
            connectionLimit: 50,
            thread_handling: 'pool-of-threads',
            thread_pool_size: 32,
            thread_pool_stall_limit: 300,
            thread_pool_oversubscribe: 10
        }
    },
    externalConnection: {
        $filter: 'env',
        local: {
            host: '202.182.55.134',
            user: 'danon',
            password: 'D4non1209',
            database: 'danon',
            port: 8106,
            connectionLimit: 50,
            thread_handling: 'pool-of-threads',
            thread_pool_size: 32,
            thread_pool_stall_limit: 300,
            thread_pool_oversubscribe: 10
        },
        dev: {
            host: '202.182.55.134',
            user: 'danon',
            password: 'D4non1209',
            database: 'danon',
            port: 8106,
            connectionLimit: 50,
            thread_handling: 'pool-of-threads',
            thread_pool_size: 32,
            thread_pool_stall_limit: 300,
            thread_pool_oversubscribe: 10
        },
        preprod: {
            host: '202.182.55.134',
            user: 'danon',
            password: 'D4non1209',
            database: 'danon',
            port: 8106,
            connectionLimit: 50,
            thread_handling: 'pool-of-threads',
            thread_pool_size: 32,
            thread_pool_stall_limit: 300,
            thread_pool_oversubscribe: 10
        },
        $default: {
            host: '127.0.0.1',
            user: 'root',
            password: ' ',
            database: 'danon',
            port: 3306,
            connectionLimit: 50,
            thread_handling: 'pool-of-threads',
            thread_pool_size: 32,
            thread_pool_stall_limit: 300,
            thread_pool_oversubscribe: 10
        }
    },
    login: {
        secret: {
            $filter: 'env',
            local: 'DANON_1209_ENCRIPTION',
            dev: 'DANON_1209_ENCRIPTION',
            preprod: 'DANON_1209_ENCRIPTION',
            $default: 'DANON_1209_ENCRIPTION'
        }
    },
    otp: {
        tokenGenerator: {
            $filter: 'env',
            local: 'https://api.mainapi.net/smsnotification/1.0.0/messages',
            dev: 'https://api.mainapi.net/smsnotification/1.0.0/messages',
            preprod: 'https://api.mainapi.net/smsnotification/1.0.0/messages',
            $default: 'https://api.mainapi.net/smsnotification/1.0.0/messages'
        },
        authHeader: {
            $filter: 'env',
            local: 'Bearer 369b496e5da704bfdfdbaaea3655b136',
            dev: 'Bearer 369b496e5da704bfdfdbaaea3655b136',
            preprod: 'Bearer 369b496e5da704bfdfdbaaea3655b136',
            $default: 'Bearer 369b496e5da704bfdfdbaaea3655b136'
        },
        secretKey: {
            $filter: 'env',
            local: 'TQ2q5V2JVQhHxZwHYUxtOhnxPj4a',
            dev: 'TQ2q5V2JVQhHxZwHYUxtOhnxPj4a',
            preprod: 'TQ2q5V2JVQhHxZwHYUxtOhnxPj4a',
            $default: 'TQ2q5V2JVQhHxZwHYUxtOhnxPj4a'
        },
        clientId: {
            $filter: 'env',
            local: 'McHq7uKo3P0mtiAWNUNPhwsjgZ0a',
            dev: 'McHq7uKo3P0mtiAWNUNPhwsjgZ0a',
            preprod: 'McHq7uKo3P0mtiAWNUNPhwsjgZ0a',
            $default: 'McHq7uKo3P0mtiAWNUNPhwsjgZ0a'
        }
    },
    email: {
        apiKey: 'a812608b1cfcefbd6fa9e6b97021b92e-c9270c97-64fda015',
        domain: 'mg.danaonline.id',
        sender: 'DANON <support@danaonline.id>',
        baseUrl: 'https://api.mailgun.net/v3/mg.danaonline.id'
    },
    mailServer: {
        $filter: 'env',
        local: 'http://127.0.0.1:4200',
        dev: 'http://202.182.55.134:8103',
        preprod: 'http://www.danaonline.id',
        $default: 'http://202.182.55.134:8103'
    },
    paymentGateway: {
        server: {
            $filter: 'env',
            local: 'https://api.instamoney.co/',
            dev: 'https://api.instamoney.co/',
            preprod: 'https://api.instamoney.co/',
            $default: 'https://api.instamoney.co/'
        },
        authKey: {
            $filter: 'env',
            local: 'Basic c2tfdGVzdF9OWUNFZkw4a2hMZXFrc0J0S0xBVUdXR1dOOUNpcU5GOXdYVG1SeG5XVFI4YjJnQ3dCanc6',
            dev: 'Basic c2tfdGVzdF9OWUNFZkw4a2hMZXFrc0J0S0xBVUdXR1dOOUNpcU5GOXdYVG1SeG5XVFI4YjJnQ3dCanc6',
            preprod: 'Basic c2tfdGVzdF9OWUNFZkw4a2hMZXFrc0J0S0xBVUdXR1dOOUNpcU5GOXdYVG1SeG5XVFI4YjJnQ3dCanc6',
            $default: 'Basic c2tfdGVzdF9OWUNFZkw4a2hMZXFrc0J0S0xBVUdXR1dOOUNpcU5GOXdYVG1SeG5XVFI4YjJnQ3dCanc6'
        }
    },
    eCollection: {
        server: {
            $filter: 'env',
            local: 'https://apibeta.bni-ecollection.com:443/',
            dev: 'https://apibeta.bni-ecollection.com:443/',
            preprod: 'https://apibeta.bni-ecollection.com:443/',
            $default: 'https://apibeta.bni-ecollection.com:443/'
        },
        secretKey: {
            $filter: 'env',
            local: 'b9d80567be560a0c901f52aea4a79197',
            dev: 'b9d80567be560a0c901f52aea4a79197',
            preprod: 'b9d80567be560a0c901f52aea4a79197',
            $default: 'b9d80567be560a0c901f52aea4a79197'
        },
        clientId: {
            $filter: 'env',
            local: '05151',
            dev: '05151',
            preprod: '05151',
            $default: '05151'
        }
    },
    bniCredential: {
        server: {
            $filter: 'env',
            local: 'https://apidev.bni.co.id:8066/',
            dev: 'https://apidev.bni.co.id:8066/',
            preprod: 'https://apidev.bni.co.id:8066/',
            $default: 'https://apidev.bni.co.id:8066/'
        },
        apiKey: {
            $filter: 'env',
            local: 'a4b77aa2-5c0a-46e0-bdd0-953b2b39e488',
            dev: 'a4b77aa2-5c0a-46e0-bdd0-953b2b39e488',
            preprod: 'a4b77aa2-5c0a-46e0-bdd0-953b2b39e488',
            $default: 'a4b77aa2-5c0a-46e0-bdd0-953b2b39e488'
        },
        secretKey: {
            $filter: 'env',
            local: 'dba393fe-b3f1-4ef7-aace-f6fcb18d0263',
            dev: 'dba393fe-b3f1-4ef7-aace-f6fcb18d0263',
            preprod: 'dba393fe-b3f1-4ef7-aace-f6fcb18d0263',
            $default: 'dba393fe-b3f1-4ef7-aace-f6fcb18d0263'
        },
        clientId: {
            $filter: 'env',
            local: '86265cd2-d42c-406e-a92c-3aa97dc310f4',
            dev: '86265cd2-d42c-406e-a92c-3aa97dc310f4',
            preprod: '86265cd2-d42c-406e-a92c-3aa97dc310f4',
            $default: '86265cd2-d42c-406e-a92c-3aa97dc310f4'
        },
        clientSecret: {
            $filter: 'env',
            local: '8a7118f3-f3ef-40c4-99f4-e83f9257768f',
            dev: '8a7118f3-f3ef-40c4-99f4-e83f9257768f',
            preprod: '8a7118f3-f3ef-40c4-99f4-e83f9257768f',
            $default: '8a7118f3-f3ef-40c4-99f4-e83f9257768f'
        },
        decryptKey: {
            $filter: 'env',
            local: 'a6d882ef9504b8e478c7198284ab870d',
            dev: 'a6d882ef9504b8e478c7198284ab870d',
            preprod: 'a6d882ef9504b8e478c7198284ab870d',
            $default: 'a6d882ef9504b8e478c7198284ab870d'
        },
        p2pId: {
            $filter: 'env',
            local: 'DANON',
            dev: 'DANON',
            preprod: 'DANON',
            $default: 'DANON'
        }
    },
    zahirAccounting: {
        server: {
            $filter: 'env',
            local: 'https://app.zahironline.com',
            dev: 'https://app.zahironline.com',
            preprod: 'https://app.zahironline.com',
            $default: 'https://app.zahironline.com'
        },
        authKey: {
            $filter: 'env',
            local: 'wSuzix1168f6voeUodLiYL8FsXrkLI9UGLAB46dG',
            dev: 'wSuzix1168f6voeUodLiYL8FsXrkLI9UGLAB46dG',
            preprod: 'wSuzix1168f6voeUodLiYL8FsXrkLI9UGLAB46dG',
            $default: 'wSuzix1168f6voeUodLiYL8FsXrkLI9UGLAB46dG'
        },
        slug: {
            $filter: 'env',
            local: 'sampleapi1952284750.zahironline.com',
            dev: 'sampleapi1952284750.zahironline.com',
            preprod: 'sampleapi1952284750.zahironline.com',
            $default: 'sampleapi1952284750.zahironline.com'
        }
    },
    captcha: {
        server: {
            $filter: 'env',
            local: 'https://www.google.com/recaptcha/api/siteverify',
            dev: 'https://www.google.com/recaptcha/api/siteverify',
            preprod: 'https://www.google.com/recaptcha/api/siteverify',
            $default: 'https://www.google.com/recaptcha/api/siteverify'
        },
        secretKey: {
            $filter: 'env',
            local: '6LftzYkUAAAAAKUFCOX5Y_sIcSBKxulYVzyVXE-Y',
            dev: '6LftzYkUAAAAAKUFCOX5Y_sIcSBKxulYVzyVXE-Y',
            preprod: '6LftzYkUAAAAAKUFCOX5Y_sIcSBKxulYVzyVXE-Y',
            $default: '6LftzYkUAAAAAKUFCOX5Y_sIcSBKxulYVzyVXE-Y'
        }
    },
    ilumaKyc: {
        server: {
            $filter: 'env',
            local: 'https://api.iluma.ai',
            dev: 'https://api.iluma.ai',
            preprod: 'https://api.iluma.ai',
            $default: 'https://api.iluma.ai'
        },
        secretKey: {
            $filter: 'env',
            local: 'iluma_development_jvKDvdabeaddKZwTjhDIZawwHLhLpylmxrVyDLo8lZTeaPOE98uSPyeXaAUE6J',
            dev: 'iluma_development_jvKDvdabeaddKZwTjhDIZawwHLhLpylmxrVyDLo8lZTeaPOE98uSPyeXaAUE6J',
            // preprod: 'iluma_production_air8wIBSiiB3G1R5lXeadJ7SeyOulKOU7pgvfKxZmfTS62t7i4yqxL5V0xuaEbL',
            preprod: 'iluma_development_jvKDvdabeaddKZwTjhDIZawwHLhLpylmxrVyDLo8lZTeaPOE98uSPyeXaAUE6J',
            $default: 'iluma_development_jvKDvdabeaddKZwTjhDIZawwHLhLpylmxrVyDLo8lZTeaPOE98uSPyeXaAUE6J'
        },
        callbackToken: {
            $filter: 'env',
            local: '55b0b1444aec73df91a5a8321f361d003b06ff5a93d3b7d95b73377485c07893',
            dev: '55b0b1444aec73df91a5a8321f361d003b06ff5a93d3b7d95b73377485c07893',
            preprod: '55b0b1444aec73df91a5a8321f361d003b06ff5a93d3b7d95b73377485c07893', // testing mode
            // preprod: '78bc27f9b72f1f7938008fe932f28cce38460975e201f5d6026666ae9f69ede6',
            $default: '55b0b1444aec73df91a5a8321f361d003b06ff5a93d3b7d95b73377485c07893'
        }
    },
    digiSign: {
        server: {
            $filter: 'env',
            local: 'https://api.tandatanganku.com/',
            dev: 'https://api.tandatanganku.com/',
            preprod: 'https://api.tandatanganku.com/',
            $default: 'https://api.tandatanganku.com/'
        },
        authToken: {
            $filter: 'env',
            local: 'Bearer dzF3E2Bz7bMxQPl4MCgFSHAnnTvPBAjy7lXaU24OHUetaOBJN1XNwFgVPftZn3',
            dev: 'Bearer dzF3E2Bz7bMxQPl4MCgFSHAnnTvPBAjy7lXaU24OHUetaOBJN1XNwFgVPftZn3',
            preprod: 'Bearer dzF3E2Bz7bMxQPl4MCgFSHAnnTvPBAjy7lXaU24OHUetaOBJN1XNwFgVPftZn3',
            $default: 'Bearer dzF3E2Bz7bMxQPl4MCgFSHAnnTvPBAjy7lXaU24OHUetaOBJN1XNwFgVPftZn3'
        }
    },
    uploadFile: {
        $filter: 'env',
        local: '{home.dir}/Documents/danon/',
        dev: '{home.dir}/danon/',
        preprod: '{home.dir}/danon/',
        $default: '{home.dir}/danon/'
    },
    pathReporting: {
        $filter: 'env',
        local: '{home.dir}/Documents/danon/Reporting/',
        dev: '{home.dir}/danon/Reporting/',
        preprod: '{home.dir}/danon/Reporting/',
        $default: '{home.dir}/danon/Reporting/'
    }
};

var store = new Confidence.Store(config);

exports.get = (key) => {
    return store.get(key, criteria);
};

exports.meta = (key) => {
    return store.meta(key, criteria);
};
