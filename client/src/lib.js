class Player {
    constructor(x, y, w, h, color, name) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h 
        this.color = color 
        this.name = name

        this.dx = 0
        this.dy = 0
    }

    update() {
        this.x += this.dx
        this.y += this.dy
    }

    draw(ctx) {
        ctx.save()
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.w, this.h)
        ctx.font = "18px Serif"
        ctx.fillText(this.name, this.x, this.y)
        ctx.restore()
    }
}
