import "reflect-metadata";
import {createConnection} from "typeorm";
// import {User} from "./entity/User";
// import {Group} from "./entity/Group";

createConnection().then(async connection => {

    // console.log("Inserting a new user into the database...");
    // const user = new User();
    // user.email = "@naver.com";
    // user.oauth = "ksdfksd";
    // user.profile = "png";
    // await connection.manager.save(user);
    // console.log("Saved a new user with id: " + user.id);

    // console.log("Loading users from the database...");
    // const users = await connection.manager.find(User);

    // console.log("Loaded groups: ", users);

    // const group = new Group();
    // group.groupname = "test";
    // group.userId = 1;
    // group.groupcomb_music = 12;
    // group.weathers_id = 1111;

    // await connection.manager.save(user);
    // const groups = await connection.manager.find(Group);

    // console.log("Loaded groups: ", groups);

    // console.log("Here you can setup and run express/koa/any other framework.");
  
}).catch(error => console.log(error));
