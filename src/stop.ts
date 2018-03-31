import {Client, Message, Collection, Member} from "eris";
import Parachute = require("./parachute");

function stop(client: Client, message: Message)
{
    client.disconnect({reconnect: false});    
}

export = {label: "stop", command: stop, permission: Parachute.Permission.OWNER};