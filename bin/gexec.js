#!/usr/bin/env node

const arg = process.argv.slice(2)
const command =  process.argv[2] || null;
const nameSpace = "info.gourav.local.redis";
const keySeperator = "_";
const redis = require("redis");

function setUpRedis(){
    const client = redis.createClient();
    client.on("error", function(error) {
        console.error(error);
    });
    process.nextTick(_=>client.quit());
    return client;
}

function set(args){
    const client = setUpRedis();
    let key = [nameSpace,args[0]].join(keySeperator);
    let val = args.slice(1).join(" ");
    client.set(key, val, redis.print);
}

function get(args){
    const client = setUpRedis();
    let key = [nameSpace,args[0]].join(keySeperator);
    client.get(key, (e,r)=>{
        if (e){
            return console.error(e)
        }
        console.log("\n\n")
        console.log(r)
        console.log("\n\n")
    });
}

function ls(){
    const client = setUpRedis();
    client.keys(nameSpace+"_*", (err,res)=>{
        console.log("Total : ", res.length);
        res.forEach((r,i)=>{
            const key = r.split("_").splice(1).join("_");
            console.log(`\t${i+1}) ${key}`);
        });

    });
}

let handlers = {
    set,
    get,
    ls
}


if(handlers[command]){
    handlers[command](arg.splice(1))
}else{
    console.log("invalid")
}


