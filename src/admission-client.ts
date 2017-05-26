import request = require('request');
import Swagger = require('./api');
import q = require('q');

let BasicAuth = Swagger.HttpBasicAuth;
let OAuth = Swagger.OAuth;
let basicAuth = new BasicAuth();
let oAuth = new OAuth();

export class AdmissionClient {
    
    protected basePath:string;
    protected accessToken:string;
    protected api:Swagger.DefaultApi;

    constructor(basePath: string, accessToken: string) {
        this.basePath = basePath;
        this.accessToken = accessToken;

        this.api = new Swagger.DefaultApi(this.basePath);
        this.api.accessToken = this.accessToken;
    }

    public init() : q.Promise<void>{
        return q()
    }

    public findDeployments(urn?: string, owner?: string, show?: string) :q.Promise<{[key: string]:any}>{
        let deferred = q.defer<{[key: string]:any}>();
        this.api.findDeployments(urn, owner, show)
        .then( value => {
            if (value.body.success){
                let result = value.body.data;
                deferred.resolve(result);
            } else {
                deferred.reject(new Error(value.body.message));
            }
        })
        .catch( reason=> {
            deferred.reject(reason);
        })
        return deferred.promise;
    }

    public findStorage():q.Promise<Array<String>>{
        let deferred = q.defer<Array<String>>();
        this.api.registriesGet()
        .then( value => {
            if (value.body.success){
                let result:Array<String> = value.body.data;
                deferred.resolve(result);
            } else {
                deferred.reject(new Error(value.body.message));
            }
        })
        .catch( reason=> {
            deferred.reject(reason);
        })
        return deferred.promise;
    }

}

