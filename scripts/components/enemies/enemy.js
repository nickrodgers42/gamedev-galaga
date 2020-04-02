class Enemy {
    constructor(sprite, position, screenWidth, screenHeight) {
        this.sprite = sprite
        this.position = position
        this.screenWidth = screenWidth
        this.screenHeight = screenHeight
        this.movingAlongPath = false
        this.passedPathPoints = 0
        this.moveSpeed = 0.1
        this.path = []
        this._rotation = 0
    }

    resetPath = () => {
        this.movingAlongPath = false
        this.passedPathPoints = 0
        this.path = []
    }

    get rotation() {
        let radians = this._rotation + Math.PI / 8
        radians %= 2 * Math.PI
        return Math.floor(radians / (Math.PI / 4)) * Math.PI / 4
    }

    set rotation(rotation) {
        this._rotation = rotation
    }

    moveAlongPath = (pathSlope) => {
        const path = pathSlope.path
        this.slope = pathSlope.slope
        this.slope = this.slope.map(x => {
            x = Math.atan(x)
            if (x < 0) {
                x += 2 * Math.PI
            }
            return x
        })
        this.position = path[0]
        this.passedPathPoints = 0
        this.movingAlongPath = true
        this.path = path
    }

    update = (elapsedTime) => {
        this.sprite.update(elapsedTime)
        if (this.movingAlongPath) {
            const distanceToMove = this.moveSpeed * elapsedTime
            let distanceMoved = 0
            while (distanceMoved < distanceToMove && this.passedPathPoints < this.path.length) {
                const nextPoint = this.path[this.passedPathPoints]
                const distToNextPoint = this.position.distanceTo(nextPoint)
                if (distToNextPoint < distanceToMove - distanceMoved) {
                    this.passedPathPoints += 1
                    this.position = nextPoint.copy()
                    if (this.passedPathPoints == this.path.length) {
                        this.resetPath()
                        break
                    }
                }
                else {
                    const distanceLeft = distanceToMove - distanceMoved
                    const t = distanceLeft / distToNextPoint
                    this.position = this.position.mult(1 - t)
                    this.position = this.position.add(nextPoint.mult(t)) 
                    distanceMoved = distanceToMove
                }
                this.rotation = this.slope[this.passedPathPoints]
            }
        }
        this.sprite.center = this.position
    }

    renderPath = (path, context) => {
        if (!path) {
            return;
        }
        context.save()
        context.strokeStyle='red'
        if (path.length > 0) {
            context.moveTo(path[0].x, path[0].y)
            for (let i = 1; i < path.length; ++i) {
                context.lineTo(...path[i].coords())
            }
        }
        context.stroke()
        context.restore()
    }

    render = (context, drawPath=false) => {
        this.sprite.render(context, 0)
        if (drawPath) {
            this.renderPath(this.path, context)
        }
    }
}
