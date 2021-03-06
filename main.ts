 namespace ps2controller {

    let chipSelect = DigitalPin.P12
    //pins.digitalWritePin(chipSelect, 1)

    let pad = pins.createBuffer(6)
    let connected = false

    /*
    // Unused at the moment
    const config_cmd_enter = hex
        `014300010000000000`
    const config_cmd_exit = hex
        `014300005a5a5a5a5a`
    const config_enable_analog = hex
        `014400010300000000`
    const config_enable_vibration = hex
        `014d000001ffffffff`
    */
    const poll_cmd = hex
        `014200000000000000`

    function send_command(transmit: Buffer): Buffer {
        // deal with bit-order
        transmit = reverse.rbuffer(transmit)

        let receive = pins.createBuffer(transmit.length);

        pins.digitalWritePin(chipSelect, 0);
        // send actual command
        for (let i = 0; i < transmit.length; i++) {
            receive[i] = pins.spiWrite(transmit[i]);
        }
        pins.digitalWritePin(chipSelect, 1)

        // deal with bit-order
        receive = reverse.rbuffer(receive)

        return receive
     }
  
    export enum PS2Button {
        //% block="左"
        //% block.loc.de="links"
        Left,
        //% block="下"
        Down,
        //% block="右"
        Right,
        //% block="上"
        Up,
        //% block="开始"
        Start,
        Analog_Left,
        Analog_Right,
        //% block="选择"
        Select,
        //% block="方形"
        Square,
        //% block="交叉"
        Cross,
        //% block="圆形"
        Circle,
        //% block="三角"
        Triangle,
        R1,
        L1,
        R2,
        L2,
        Buttons,
        RX,
        RY,
        LX,
        LY,
     };
    //% block="初始化spi引脚 cs$cs mosi%mosi miso%miso sck%sck"
    //% cs.defl=DigitalPin.P12
    //% mosi.defl=DigitalPin.P8
    //% miso.defl=DigitalPin.P14
    //% sck.defl=DigitalPin.P13
    export function SPI_init(cs:DigitalPin,mosi:DigitalPin,miso:DigitalPin,sck:DigitalPin) {
     //ps2controller.SPI_init(DigitalPin.P12,DigitalPin.P8, DigitalPin.P14, DigitalPin.P13)
        //spi的用法参考https://makecode.microbit.org/reference/pins/spi-pins
        //function spiPins(mosi: DigitalPin, miso: DigitalPin, sck: DigitalPin): void;
        //MOSI, micro:bit SPI data output pin MISO, micro:bit SPI data input pin
        //所以mosi的参数应该对应着接控制器的cmd接口 MISO参数对应着dat接口
        //cmd dat sck
        //pins.spiPins(DigitalPin.P8, DigitalPin.P14, DigitalPin.P13)
        //pins.spiFormat(8, 3)
        //pins.spiFrequency(250000)
        chipSelect = cs;
        pins.digitalWritePin(chipSelect, 1)
        pins.spiPins(mosi, miso, sck);
        pins.spiFormat(8, 3);
        pins.spiFrequency(250000);
    }
     //% block="按键$b被按下"
     //% block.loc.de="wenn Taste $b gedrückt"
     export function button_pressed(b: PS2Button): number {
        if(!connected) return 0x00

        switch (b) {
            case PS2Button.Left:
                return pad[0] & 0x80 ? 0 : 1;
            case PS2Button.Down:
                return pad[0] & 0x40 ? 0 : 1;
            case PS2Button.Right:
                return pad[0] & 0x20 ? 0 : 1;
            case PS2Button.Up:
                return pad[0] & 0x10 ? 0 : 1;
            case PS2Button.Start:
                return pad[0] & 0x08 ? 0 : 1;
            case PS2Button.Analog_Left:
                return pad[0] & 0x04 ? 0 : 1;
            case PS2Button.Analog_Right:
                return pad[0] & 0x02 ? 0 : 1;
            case PS2Button.Select:
                return pad[0] & 0x01 ? 0 : 1;
            case PS2Button.Square:
                return pad[1] & 0x80 ? 0 : 1;
            case PS2Button.Cross:
                return pad[1] & 0x40 ? 0 : 1;
            case PS2Button.Circle:
                return pad[1] & 0x20 ? 0 : 1;
            case PS2Button.Triangle:
                return pad[1] & 0x10 ? 0 : 1;
            case PS2Button.R1:
                return pad[1] & 0x08 ? 0 : 1;
            case PS2Button.L1:
                return pad[1] & 0x04 ? 0 : 1;
            case PS2Button.R2:
                return pad[1] & 0x02 ? 0 : 1;
            case PS2Button.L2:
                return pad[1] & 0x01 ? 0 : 1;
            case PS2Button.Buttons:
                return ~((pad[1] << 8) | pad[0]) & 0xffff;
            case PS2Button.RX:
                return pad[2] - 0x80;
            case PS2Button.RY:
                return pad[3] - 0x80;
            case PS2Button.LX:
                return pad[4] - 0x80;
            case PS2Button.LY:
                return pad[5] - 0x80;
        }
        return 0;
    }
    //% block="收取遥控器信息"
    //% block.loc.de="Informationen zur Fernbedienung abrufen"
    export function poll(): boolean {
        let buf = send_command(poll_cmd)
        if (buf[2] != 0x5a) {
            return false;
        }

        for (let i = 0; i < 6; i++) {
            pad[i] = buf[3 + i];
        }

        connected = true

        return true
    }
  /*
    basic.forever(function () {
        poll();
    })
    */
 }
