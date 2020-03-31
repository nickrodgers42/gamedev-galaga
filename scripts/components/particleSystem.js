class ParticleSystem {
    constructor(context) {
        this.context = context
        this.particles = []   
        this.landerThrustRate = 0.5
        this.landerCrashRate = 0.5
        this.fireSprite = new SpriteObject(0, 0, './assets/fire.png')
        this.smokeSprite = new SpriteObject(0, 0, './assets/smoke-2.png')
    }

    landerThrust = (elapsedTime, lander) => {
        const particlesToMake = Math.floor(this.landerThrustRate * elapsedTime)
        for (let i = 0; i < particlesToMake; ++i) {
            this.particles.push(new Particle(
                lander.thrustLocation.x,
                lander.thrustLocation.y,
                {
                    image: this.fireSprite,
                    size: {
                        x: Random.randGaussian(10, 3),
                        y: Random.randGaussian(10, 3)
                    },
                    speed: Random.randFloat(0, 0.1),
                    lifetime: Random.randGaussian(250, 250),
                    direction: Random.randCircleVectorInRange(
                        lander.rotation + (5 * Math.PI) / 4,
                        lander.rotation + (7 * Math.PI) / 4
                    )
                }
            ))
        }
    }

    clearParticles = () => {
        this.particles = []
    }

    landerCrash = (lander) => {
        const particlesToMake = 1000
        for (let i = 0; i < particlesToMake; ++i) {
            this.particles.push(new Particle(
                lander.x,
                lander.y,
                {
                    image: Random.randGaussian(0, 1) < 1 ? this.fireSprite : this.smokeSprite,
                    size: {
                        x: Random.randGaussian(10, 3),
                        y: Random.randGaussian(10, 3)
                    },
                    speed: Random.randFloat(0, 0.3),
                    lifetime: Random.randGaussian(500, 250),
                    direction: Random.randCircleVector()
                }
            ))
        }

    }

    update = (elapsedTime) => {
        const aliveParticles = []
        for (let i = 0; i < this.particles.length; ++i) {
            this.particles[i].update(elapsedTime)
            if (this.particles[i].alive) {
                aliveParticles.push(this.particles[i])
            }
        }
        this.particles = aliveParticles
    }

    drawSprite = (particle) => {
        this.context.save()
        this.context.translate(
            particle.center.x,
            particle.center.y
        )
        this.context.rotate(particle.rotation)
        this.context.translate(
            -particle.center.x,
            -particle.center.y
        )
        
        if (particle.image.sprite.ready) {
            this.context.drawImage(
                particle.image.sprite,
                Math.floor(particle.center.x - particle.size.x / 2),
                Math.floor(particle.center.y - particle.size.y / 2),
                Math.floor(particle.size.x),
                Math.floor(particle.size.y)
            )
        }
        this.context.restore()
    }

    render = () => {
        for (let i = 0; i < this.particles.length; ++i) {
            this.drawSprite(this.particles[i])
        }
    }
}
