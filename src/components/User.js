import {extendObservable} from'mobx';

class User{
    constructor(){
        extendObservable(this,{
            loading: true,
            isLoggedIn:true,
            username:''
        })
    }
}
export default new User();