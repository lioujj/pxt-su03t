/**
* SU-03T語音辨識晶片積木
*/

//% weight=0 color=#439409 icon="\uf130" block="SU-03T ASR"
namespace su03t {
    let voice_tx = SerialPin.P1
    let voice_rx = SerialPin.P2
    let receivedBuff=pins.createBuffer(4)
    let sendBuff=pins.createBuffer(7)
    let mySU03Tevent: Action = null
    let firstCommandCode=0
    let secondCommandCode=0
 
    export enum voiceCommand {
        //% block="喚醒詞"
        command00 = 0x00,
        //% block="打開電燈"
        command01 = 0x01,
        //% block="關閉電燈"
        command02 = 0x02,
        //% block="打開繼電器"
        command03 = 0x03,
        //% block="關閉繼電器"
        command04 = 0x04,
        //% block="打開開關"
        command05 = 0x05,
        //% block="關閉開關"
        command06 = 0x06,
        //% block="亮一點"
        command07 = 0x07,
        //% block="暗一點"
        command08 = 0x08,
        //% block="啟動功能"
        command2D = 0x2D,
        //% block="關閉功能"
        command2E = 0x2E,
        //% block="打開"
        command2F = 0x2F,
        //% block="關閉"
        command30 = 0x30,
        //% block="前進"
        command0B = 0x0B,
        //% block="後退"
        command0C = 0x0C,
        //% block="左轉"
        command0D = 0x0D,
        //% block="右轉"
        command0E = 0x0E,
        //% block="停止"
        command0F = 0x0F,
        //% block="開啟鏡頭"
        command10 = 0x10,
        //% block="關閉鏡頭"
        command11 = 0x11,
        //% block="快一點"
        command12 = 0x12,
        //% block="慢一點"
        command13 = 0x13,
        //% block="播放音樂"
        command15 = 0x15,
        //% block="暫停播放"
        command16 = 0x16,
        //% block="停止播放"
        command17 = 0x17,
        //% block="上一首"
        command18 = 0x18,
        //% block="下一首"
        command19 = 0x19,
        //% block="第一首"
        command1A = 0x1A,
        //% block="最後一首"
        command1B = 0x1B,
        //% block="紅色"
        command1F = 0x1F,
        //% block="綠色"
        command20 = 0x20,
        //% block="藍色"
        command21 = 0x21,
        //% block="黃色"
        command22 = 0x22,
        //% block="青色"
        command23 = 0x23,
        //% block="洋紅色"
        command24 = 0x24,
        //% block="紫色"
        command27 = 0x27,
        //% block="白色"
        command25 = 0x25,
        //% block="黑色"
        command26 = 0x26,
        //% block="溫度"
        command29 = 0x29,
        //% block="濕度"
        command2A = 0x2A,
        //% block="亮度"
        command2B = 0x2B,
        //% block="距離"
        command2C = 0x2C,
        //% block="顯示圖片"
        command33 = 0x33,
        //% block="下一張圖"
        command34 = 0x34,
        //% block="上一張圖"
        command35 = 0x35,
        //% block="清除螢幕"
        command36 = 0x36
    }
    export enum numberCommand {
        //% block="溫度"
        command02 = 0x02,
        //% block="濕度"
        command03 = 0x03,
        //% block="亮度"
        command04 = 0x04,
        //% block="距離"
        command05 = 0x05
    }
    export enum floatCommand {
        //% block="integer"
        command06 = 0x06,
        //% block="decimal"
        command07 = 0x07
    }
    export enum systemCommand {
        //% block="喚醒"
        command01 = 1,
        //% block="進入睡眠"
        command14 = 14,
        //% block="靜音"
        command08 = 8,
        //% block="取消靜音"
        command09 = 9,
        //% block="最大音量"
        command10 = 10,
        //% block="最小音量"
        command11 = 11,
        //% block="大聲一點"
        command12 = 12,
        //% block="小聲一點"
        command13 = 13
    }
    export enum preCommand {
        //% block="歡迎光臨"
        command15 = 15,
        //% block="有人入侵"
        command16 = 16,
        //% block="做得太好了，繼續加油"
        command17 = 17,
        //% block="時間到了，該起床了"
        command18 = 18,
        //% block="溫度太高了"
        command19 = 19,
        //% block="溫度太低了"
        command20 = 20,
        //% block="光線太亮了"
        command21 = 21,
        //% block="光線太暗了"
        command22 = 22,
        //% block="我愛你"
        command23 = 23,
        //% block="祝你生日快樂"
        command24 = 24,
        //% block="這個資料不太正常"
        command25 = 25,
        //% block="速度太慢了，請加速"
        command26 = 26,
        //% block="速度太快了，請注意安全"
        command27 = 27,
        //% block="前方有障礙物"
        command28 = 28,
        //% block="魔鏡魔鏡，誰是世界上最美的人"
        command29 = 29,
        //% block="煙霧超標"
        command30 = 30,
        //% block="瓦斯超標"
        command31 = 31,
        //% block="人體感應偵測觸發"
        command32 = 32,
        //% block="請注意安全，走廊上不要跑步"
        command33 = 33
    }
    //% blockId="su03t_setSerial" block="SU-03T initial|B6 connect to %pinTX|B7 connect to %pinRX"
    //% weight=100 blockGap=20 pinTX.defl=SerialPin.P1 pinRX.defl=SerialPin.P2
    export function su03tSetSerial(pinTX: SerialPin, pinRX: SerialPin): void {
        serial.setRxBufferSize(4)
        serial.setTxBufferSize(7)
        voice_tx = pinTX;
        voice_rx = pinRX;
        serial.redirect(
            voice_tx,
            voice_rx,
            BaudRate.BaudRate115200
        )
        basic.pause(100)
    }
    //% weight=90
    //% blockId="su03t_recognize" block="when SU-03T recognizes voice command"
    export function su03tEvent(tempAct: Action) {
        mySU03Tevent=tempAct;
    }
    basic.forever(() => {
        receivedBuff = serial.readBuffer(4)
        firstCommandCode = receivedBuff.getNumber(NumberFormat.UInt8LE, 1)
        secondCommandCode = receivedBuff.getNumber(NumberFormat.UInt8LE, 2)
        if (mySU03Tevent != null) {
          mySU03Tevent();
        }
    })
    //% weight=80
    //% blockId="su03tCommandList" block="recognizes %myCommand ?"
    export function su03tCommandList(myCommand: voiceCommand): boolean {
        let tempA = myCommand;
        return (firstCommandCode==0 && tempA == secondCommandCode )
    }

    //% weight=70
    //% blockId="su03tSpeakSomething" block="SU-03T read aloud %myCommand|integer %myNum"
    export function su03tSpeakSomething(myCommand: numberCommand, myNum: number) {
        sendBuff.setNumber(NumberFormat.UInt8LE,0,0xAA);
        sendBuff.setNumber(NumberFormat.UInt8LE, 1, myCommand);
        sendBuff.setNumber(NumberFormat.Int32LE, 2, myNum);
        sendBuff.setNumber(NumberFormat.UInt8LE, 6, 0xFF);
        serial.writeBuffer(sendBuff)
    }
    //% weight=60
    //% blockId="su03tSpeakFloat" block="SU-03T read aloud %myCommand|number %myNum"
    export function su03tSpeakFloat(myCommand: floatCommand, myNum: number) {
        if (myCommand==0x06){
          sendBuff.setNumber(NumberFormat.UInt8LE, 0, 0xAA);
          sendBuff.setNumber(NumberFormat.UInt8LE, 1, myCommand);
          sendBuff.setNumber(NumberFormat.Int32LE, 2, myNum);
          sendBuff.setNumber(NumberFormat.UInt8LE, 6, 0xFF);
          serial.writeBuffer(sendBuff)
        } else if (myCommand==0x07){
            let tempBuff=pins.createBuffer(11)
            tempBuff.setNumber(NumberFormat.UInt8LE, 0, 0xAA);
            tempBuff.setNumber(NumberFormat.UInt8LE, 1, myCommand);
            tempBuff.setNumber(NumberFormat.Float64LE,2,myNum)
            tempBuff.setNumber(NumberFormat.UInt8LE, 10, 0xFF);
            serial.writeBuffer(tempBuff)
        } 
    }
    //% weight=50
    //% blockId="su03tSystemCommand" block="SU-03T excute system command %myCommand"
    export function su03tSystemCommand(myCommand: systemCommand) {
        sendBuff.setNumber(NumberFormat.UInt8LE, 0, 0xAA);
        sendBuff.setNumber(NumberFormat.UInt8LE, 1, myCommand);
        sendBuff.setNumber(NumberFormat.Int32LE, 2, 0);
        sendBuff.setNumber(NumberFormat.UInt8LE, 6, 0xFF);
        serial.writeBuffer(sendBuff)
    }

    //% weight=40
    //% blockId="su03tPreCommand" block="SU-03T read aloud %myCommand"
    export function su03tPreCommand(myCommand: preCommand) {
        let myTempBuff=pins.createBuffer(3)
        myTempBuff.setNumber(NumberFormat.UInt8LE, 0, 0xAA);
        myTempBuff.setNumber(NumberFormat.UInt8LE, 1, myCommand);
        myTempBuff.setNumber(NumberFormat.UInt8LE, 2, 0xFF);
        serial.writeBuffer(myTempBuff)
    }

}