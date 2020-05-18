//ok
basic.forever(function () {
    if (ps2controller.button_pressed(ps2controller.PS2Button.Cross) > 0) {
        basic.showLeds(`
            # . . . #
            . # . # .
            . . # . .
            . # . # .
            # . . . #
            `)
    }
    if (ps2controller.button_pressed(ps2controller.PS2Button.Square) > 0) {
        basic.showLeds(`
            # # # # #
            # . . . #
            # . . . #
            # . . . #
            # # # # #
            `)
    }
    if (ps2controller.button_pressed(ps2controller.PS2Button.Circle) > 0) {
        basic.showLeds(`
            . # # # .
            # # . # #
            # . . . #
            # # . # #
            . # # # .
            `)
    }
    if (ps2controller.button_pressed(ps2controller.PS2Button.Triangle) > 0) {
        basic.showLeds(`
            . . # . .
            . # . # .
            . # . # .
            # . . . #
            # # # # #
            `)
    }
})
