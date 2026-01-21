document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Reveal Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    const glassCards = document.querySelectorAll('.glass-card');
    glassCards.forEach(card => observer.observe(card));

    // 2. Gift Box Interaction
    const giftContainer = document.getElementById('gift-box');

    giftContainer.addEventListener('click', () => {
        if (!giftContainer.classList.contains('open')) {
            giftContainer.classList.add('open');
            fireConfetti();
        }
    });

    // 3. Celebrate Button
    document.getElementById('celebrate-btn').addEventListener('click', () => {
        fireConfetti(true); // Intense blast
        // Scroll to message
        document.getElementById('message').scrollIntoView({ behavior: 'smooth' });
    });

    // 4. Confetti Engine (Canvas)
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor(x, y, speed, color) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * speed;
            this.vy = (Math.random() - 0.5) * speed - 5; // Upward initial velocity
            this.gravity = 0.15;
            this.color = color;
            this.size = Math.random() * 8 + 4;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 10;
        }

        update() {
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;
            this.size *= 0.99; // shrink slightly
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    function fireConfetti(intense = false) {
        const colors = ['#ff00cc', '#333399', '#ffd700', '#00ffff', '#ff3333'];
        const particleCount = intense ? 300 : 100;

        for (let i = 0; i < particleCount; i++) {
            const x = window.innerWidth / 2;
            const y = window.innerHeight / 2; // Start from center-ish
            // Or random spots for celebration
            const startX = intense ? window.innerWidth / 2 : Math.random() * window.innerWidth;
            const startY = intense ? window.innerHeight * 0.8 : window.innerHeight + 10;

            const speed = intense ? 15 : 10;

            particles.push(new Particle(startX, startY, speed, colors[Math.floor(Math.random() * colors.length)]));
        }

        if (!animationId) animateParticles();
    }

    let animationId = null;
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw();

            if (p.y > canvas.height + 100 || p.size < 0.5) {
                particles.splice(i, 1);
            }
        }

        if (particles.length > 0) {
            animationId = requestAnimationFrame(animateParticles);
        } else {
            animationId = null;
        }
    }

    // Initial small pop
    setTimeout(() => fireConfetti(true), 1000);
});
