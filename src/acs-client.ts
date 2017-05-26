import q = require('q');
import request = require('request');

export class AcsClient{

    protected basePath:string;

    constructor(basePath: string) {
        this.basePath = basePath;
    }

    public login(username:string, password:string): q.Promise<AcsToken>{
        let deferred = q.defer<AcsToken>();
        let loginOptions: request.Options = {
            url: this.basePath + '/login',
            auth: {username: username, password: password}
        };
        request(loginOptions, (error, response, body)=> {
            if (error != null){
                return deferred.reject(error);
            }
            if (response.statusCode != 200){
                return deferred.reject(new Error('Unauthorized'));
            }
            let token = JSON.parse(body);
            console.log(JSON.stringify(token, null, 2));
            deferred.resolve(token)
        });
        return deferred.promise;
    }
}

export class AcsUser{
    public id:string;
    public name:string;
    public roles:Array<String>;
}

export class AcsToken{
    public access_token:string;
    public token_type:string;
    public expires_in:number;
    public refresh_token:string;
    public user: AcsUser;
}