import { makeObservable, observable } from "mobx";
import {makePersistable,clearPersistedStore} from "mobx-persist-store";
class UserStore {
    userinfo = null;
    constructor(value){
        makeObservable(this,{
            userinfo:observable,
        })
        if (process.browser){
            makePersistable(this,{
                name:"UserStore",
                properties:["userinfo"],
                storage: window.localStorage
            });
        
            }
    }
    async clearPersistedData() {
        await clearPersistedStore(this);
      }
}
const UserStores = new UserStore;
export default UserStores;
