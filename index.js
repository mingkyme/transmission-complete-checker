const mqtt = require('mqtt');
const mqttOption = require('./secret/mqtt.json');
const transmissionOption = require('./secret/transmission.json');

let client = mqtt.connect(mqttOption);
client.on("connect", () => {});

let Transmission = require('transmission');
let transmission = new Transmission(transmissionOption);

let oldList = [];

function getTorrentState(){
    transmission.active(function(err, result){
        if (err){
            console.log(err);
        }
        else {
            for (let i=0; i< result.torrents.length; i++){
                if(result.torrents[i].status == 6){
                    if(oldList.findIndex((ele) => ele == result.torrents[i].id) == -1){
                        oldList.push(result.torrents[i].id);
                        publish(result.torrents[i].name);
                        transmission.remove(result.torrents[i].id,function(){});
                    }
                }
            }
        }
    });
}

function publish(msg){
    client.publish("iot/speaker",msg+"가 다운로드 완료됐습니다.");
}
setInterval(getTorrentState,30 * 1000);