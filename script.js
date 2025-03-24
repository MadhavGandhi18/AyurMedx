// Three.js setup for hero section
const heroScene = new THREE.Scene();
const heroCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const heroRenderer = new THREE.WebGLRenderer({ 
    alpha: true,
    antialias: true 
});
const heroContainer = document.getElementById('hero-3d');

if (heroContainer) {
    heroRenderer.setSize(600, 600);
    heroRenderer.setPixelRatio(window.devicePixelRatio);
    heroContainer.appendChild(heroRenderer.domElement);

    // Create report group
    const reportGroup = new THREE.Group();

    // Create a medical report card with enhanced gradient texture
    const reportGeometry = new THREE.PlaneGeometry(3, 4);
    
    // Create gradient texture with medical theme colors
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e40af');    // Deep blue
    gradient.addColorStop(0.5, '#1e3a8a');  // Royal blue
    gradient.addColorStop(1, '#172554');    // Dark blue
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add medical symbols pattern
    context.globalCompositeOperation = 'overlay';
    context.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < canvas.width; i += 40) {
        for (let j = 0; j < canvas.height; j += 40) {
            context.beginPath();
            context.arc(i, j, 2, 0, Math.PI * 2);
            context.fill();
        }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    const reportMaterial = new THREE.MeshPhysicalMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        metalness: 0.2,
        roughness: 0.3,
        envMapIntensity: 1.5
    });
    
    const report = new THREE.Mesh(reportGeometry, reportMaterial);
    reportGroup.add(report);

    // Create DNA double helix
    const dnaGroup = new THREE.Group();
    const helixRadius = 0.4;
    const helixHeight = 2;
    const helixTurns = 3;
    const pointsPerTurn = 20;

    // Create the strands
    for (let strand = 0; strand < 2; strand++) {
        const points = [];
        const totalPoints = helixTurns * pointsPerTurn;
        
        for (let i = 0; i <= totalPoints; i++) {
            const angle = (i / pointsPerTurn) * Math.PI * 2;
            const height = (i / totalPoints) * helixHeight - helixHeight/2;
            const x = Math.cos(angle + strand * Math.PI) * helixRadius;
            const z = Math.sin(angle + strand * Math.PI) * helixRadius;
            points.push(new THREE.Vector3(x, height, z));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(curve, totalPoints, 0.04, 8, false);
        const material = new THREE.MeshPhongMaterial({
            color: strand === 0 ? 0x4ade80 : 0x60a5fa,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });
        
        const strand3D = new THREE.Mesh(geometry, material);
        dnaGroup.add(strand3D);

        // Add connecting segments
        for (let i = 0; i < totalPoints; i += 4) {
            const angle = (i / pointsPerTurn) * Math.PI * 2;
            const height = (i / totalPoints) * helixHeight - helixHeight/2;
            const x1 = Math.cos(angle) * helixRadius;
            const x2 = Math.cos(angle + Math.PI) * helixRadius;
            const z1 = Math.sin(angle) * helixRadius;
            const z2 = Math.sin(angle + Math.PI) * helixRadius;

            const connectorGeometry = new THREE.CylinderGeometry(0.02, 0.02, helixRadius * 2, 8);
            const connectorMaterial = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.6
            });
            
            const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
            connector.position.set((x1 + x2)/2, height, (z1 + z2)/2);
            connector.lookAt(new THREE.Vector3(x2, height, z2));
            dnaGroup.add(connector);
        }
    }

    dnaGroup.position.set(1.8, 0, 0.5);
    dnaGroup.scale.set(0.5, 0.5, 0.5);
    reportGroup.add(dnaGroup);

    // Add medical symbols
    const symbolsGroup = new THREE.Group();
    
    // Create heart rate line
    const heartLinePoints = [];
    for (let i = 0; i < 20; i++) {
        const x = (i - 10) * 0.1;
        let y = 0;
        if (i === 8) y = 0.2;
        if (i === 9) y = -0.3;
        if (i === 10) y = 0.4;
        if (i === 11) y = -0.2;
        if (i === 12) y = 0;
        heartLinePoints.push(new THREE.Vector3(x, y, 0));
    }

    const heartLineCurve = new THREE.CatmullRomCurve3(heartLinePoints);
    const heartLineGeometry = new THREE.TubeGeometry(heartLineCurve, 50, 0.02, 8, false);
    const heartLineMaterial = new THREE.MeshPhongMaterial({
        color: 0xff4444,
        transparent: true,
        opacity: 0.8
    });
    const heartLine = new THREE.Mesh(heartLineGeometry, heartLineMaterial);
    heartLine.position.set(-0.8, -0.5, 0.1);
    symbolsGroup.add(heartLine);

    reportGroup.add(symbolsGroup);

    // Add the report group to the scene
    heroScene.add(reportGroup);

    // Enhanced lighting setup
    const frontLight = new THREE.DirectionalLight(0x4ade80, 1.5);
    frontLight.position.set(2, 2, 4);
    heroScene.add(frontLight);
    
    const backLight = new THREE.DirectionalLight(0x60a5fa, 1);
    backLight.position.set(-2, -2, -4);
    heroScene.add(backLight);
    
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    heroScene.add(ambientLight);

    // Add point lights for glow effect
    const pointLight1 = new THREE.PointLight(0x4ade80, 1, 10);
    pointLight1.position.set(2, 2, 2);
    heroScene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x60a5fa, 1, 10);
    pointLight2.position.set(-2, -2, 2);
    heroScene.add(pointLight2);

    heroCamera.position.z = 6;

    // Enhanced animation
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;
        
        // Smooth floating motion with multiple sine waves
        reportGroup.position.y = Math.sin(time) * 0.15 + Math.sin(time * 0.5) * 0.05;
        reportGroup.position.x = Math.cos(time * 0.5) * 0.05;
        
        // Dynamic rotation
        reportGroup.rotation.y = Math.sin(time * 0.5) * 0.2;
        
        // Animate DNA
        dnaGroup.rotation.y += 0.02;
        
        // Animate heart line
        heartLine.material.opacity = 0.5 + Math.sin(time * 4) * 0.3;
        
        // Animate lights
        pointLight1.intensity = 1 + Math.sin(time * 2) * 0.2;
        pointLight2.intensity = 1 + Math.sin(time * 2 + Math.PI) * 0.2;
        
        heroRenderer.render(heroScene, heroCamera);
    }
    animate();
}

// Three.js setup for about section
const aboutScene = new THREE.Scene();
const aboutCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const aboutRenderer = new THREE.WebGLRenderer({ 
    alpha: true,
    antialias: true 
});
const aboutContainer = document.getElementById('about-3d');

if (aboutContainer) {
    aboutRenderer.setSize(400, 400);
    aboutRenderer.setPixelRatio(window.devicePixelRatio);
    aboutContainer.appendChild(aboutRenderer.domElement);

    // Create mortar and pestle group
    const mortarGroup = new THREE.Group();

    // Create mortar (bowl)
    const mortarGeometry = new THREE.CylinderGeometry(1.2, 0.8, 1, 32);
    const mortarMaterial = new THREE.MeshPhongMaterial({
        color: 0x6b7280,
        metalness: 0.5,
        roughness: 0.5,
        transparent: true,
        opacity: 0.9
    });
    const mortar = new THREE.Mesh(mortarGeometry, mortarMaterial);
    mortarGroup.add(mortar);

    // Create inner bowl
    const innerBowlGeometry = new THREE.CylinderGeometry(1, 0.6, 0.9, 32);
    const innerBowlMaterial = new THREE.MeshPhongMaterial({
        color: 0x4b5563,
        metalness: 0.3,
        roughness: 0.7
    });
    const innerBowl = new THREE.Mesh(innerBowlGeometry, innerBowlMaterial);
    innerBowl.position.y = 0.05;
    mortarGroup.add(innerBowl);

    // Create pestle
    const pestleGroup = new THREE.Group();
    
    // Pestle handle
    const handleGeometry = new THREE.CylinderGeometry(0.15, 0.2, 2, 16);
    const handleMaterial = new THREE.MeshPhongMaterial({
        color: 0x6b7280,
        metalness: 0.5,
        roughness: 0.5
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    pestleGroup.add(handle);

    // Pestle head
    const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const head = new THREE.Mesh(headGeometry, handleMaterial);
    head.position.y = -0.8;
    pestleGroup.add(head);

    pestleGroup.position.set(0.5, 1.5, 0.5);
    pestleGroup.rotation.x = Math.PI / 6;
    pestleGroup.rotation.z = Math.PI / 4;
    mortarGroup.add(pestleGroup);

    // Create floating herbs
    const createHerb = (color) => {
        const herbGroup = new THREE.Group();
        
        // Leaf shape
        const leafShape = new THREE.Shape();
        leafShape.moveTo(0, 0);
        leafShape.bezierCurveTo(0.2, 0.1, 0.3, 0.4, 0, 0.8);
        leafShape.bezierCurveTo(-0.3, 0.4, -0.2, 0.1, 0, 0);
        
        const leafGeometry = new THREE.ShapeGeometry(leafShape);
        const leafMaterial = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });
        
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.scale.set(0.3, 0.3, 0.3);
        herbGroup.add(leaf);
        
        return herbGroup;
    };

    // Add multiple herbs with different colors
    const herbColors = [0x4ade80, 0x34d399, 0x22c55e];
    const herbs = [];
    
    for (let i = 0; i < 12; i++) {
        const herb = createHerb(herbColors[i % herbColors.length]);
        herb.position.set(
            (Math.random() - 0.5) * 1.5,
            Math.random() * 0.5 + 0.5,
            (Math.random() - 0.5) * 1.5
        );
        herb.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        herbs.push(herb);
        mortarGroup.add(herb);
    }

    // Add the mortar group to the scene
    mortarGroup.position.y = -0.5;
    aboutScene.add(mortarGroup);

    // Enhanced lighting
    const frontLight = new THREE.DirectionalLight(0xffffff, 1.5);
    frontLight.position.set(2, 2, 2);
    aboutScene.add(frontLight);
    
    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-2, -2, -2);
    aboutScene.add(backLight);
    
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    aboutScene.add(ambientLight);

    aboutCamera.position.z = 5;

    // Animation
    let time = 0;
    function animateAbout() {
        requestAnimationFrame(animateAbout);
        time += 0.01;

        // Rotate mortar slightly
        mortarGroup.rotation.y = Math.sin(time * 0.5) * 0.1;

        // Animate pestle
        pestleGroup.position.y = 1.5 + Math.sin(time * 2) * 0.1;
        pestleGroup.rotation.z = Math.PI / 4 + Math.sin(time * 2) * 0.1;

        // Animate herbs
        herbs.forEach((herb, index) => {
            herb.position.y = 0.5 + Math.sin(time * 2 + index) * 0.1;
            herb.rotation.z = Math.sin(time + index) * 0.2;
            herb.rotation.x = Math.cos(time + index) * 0.2;
        });

        aboutRenderer.render(aboutScene, aboutCamera);
    }
    animateAbout();
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking a link
            navLinks.classList.remove('active');
        }
    });
});

// Mobile menu toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove sticky class
    if (currentScroll > 50) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
});

// Handle image uploads
const tongueUpload = document.getElementById('tongue-upload');
const eyeUpload = document.getElementById('eye-upload');
const analysisProgress = document.querySelector('.analysis-progress');
const progressBar = document.querySelector('.progress');
const symptomsForm = document.querySelector('.symptoms-form');
const results = document.querySelector('.results');

function handleImageUpload(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Create or get preview container
            let previewContainer = document.querySelector('.image-preview');
            if (!previewContainer) {
                previewContainer = document.createElement('div');
                previewContainer.className = 'image-preview';
                input.parentElement.appendChild(previewContainer);
            }

            // Create or update preview image
            let previewImage = previewContainer.querySelector('img');
            if (!previewImage) {
                previewImage = document.createElement('img');
                previewContainer.appendChild(previewImage);
            }
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';

            // Show analysis progress
            simulateAnalysis();
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function simulateAnalysis() {
    analysisProgress.style.display = 'block';
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += 5;
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                analysisProgress.style.display = 'none';
                symptomsForm.style.display = 'block';
            }, 500);
        }
    }, 100);
}

tongueUpload.addEventListener('change', () => handleImageUpload(tongueUpload));
eyeUpload.addEventListener('change', () => handleImageUpload(eyeUpload));

// Handle symptoms form submission
const symptomItems = document.querySelectorAll('.symptom-item select');
symptomItems.forEach(select => {
    select.addEventListener('change', () => {
        // Check if all symptoms are answered
        const allAnswered = Array.from(symptomItems).every(item => item.value !== '');
        if (allAnswered) {
            setTimeout(() => {
                results.style.display = 'block';
            }, 500);
        }
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.step-card, .about-content, .hero-content');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initial animation setup
document.querySelectorAll('.step-card, .about-content, .hero-content').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// Add scroll event listener for animations
window.addEventListener('scroll', animateOnScroll);
// Trigger initial animation check
animateOnScroll();

// Add parallax effect to abstract shapes
const abstractShapes = document.querySelectorAll('.abstract-shape, .abstract-shape-2');

window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    abstractShapes.forEach(shape => {
        const speed = shape.classList.contains('abstract-shape') ? 20 : 10;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        
        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Animate diagnosis options
function initDiagnosisAnimations() {
    const diagnosisSteps = document.querySelectorAll('.diagnosis-step');
    
    // Create floating effect for each step
    diagnosisSteps.forEach((step, index) => {
        // Add hover effect class
        step.classList.add('diagnosis-step-animated');
        
        // Set initial state with delay based on index
        step.style.opacity = '0';
        step.style.transform = 'translateY(30px)';
        step.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        step.style.transitionDelay = `${index * 0.2}s`;
        
        // Create pulsing glow effect
        const glowOverlay = document.createElement('div');
        glowOverlay.className = 'diagnosis-step-glow';
        glowOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 15px;
            background: linear-gradient(45deg, rgba(124, 58, 237, 0.1), rgba(99, 102, 241, 0.1));
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        step.style.position = 'relative';
        step.appendChild(glowOverlay);
        
        // Add icon animation
        const icon = step.querySelector('.step-icon');
        if (icon) {
            icon.style.transition = 'transform 0.3s ease';
        }
        
        // Add hover animations
        step.addEventListener('mouseenter', () => {
            glowOverlay.style.opacity = '1';
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        step.addEventListener('mouseleave', () => {
            glowOverlay.style.opacity = '0';
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Animate steps when they come into view
    const animateDiagnosisSteps = () => {
        diagnosisSteps.forEach(step => {
            const rect = step.getBoundingClientRect();
            const isVisible = (rect.top <= window.innerHeight * 0.85);
            
            if (isVisible) {
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial check and scroll listener
    animateDiagnosisSteps();
    window.addEventListener('scroll', animateDiagnosisSteps);
}

// Add floating particles background to diagnosis section
function createDiagnosisParticles() {
    const diagnosisSection = document.querySelector('.diagnosis-section');
    if (!diagnosisSection) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-background';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
    `;
    diagnosisSection.insertBefore(particlesContainer, diagnosisSection.firstChild);

    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: linear-gradient(45deg, rgba(124, 58, 237, 0.2), rgba(99, 102, 241, 0.2));
            border-radius: 50%;
            pointer-events: none;
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
        `;
        
        // Random starting position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        particlesContainer.appendChild(particle);
    }
}

// Add progress indicator animation
function initProgressIndicator() {
    const steps = document.querySelectorAll('.diagnosis-step');
    let currentStep = 0;

    const updateProgress = () => {
        steps.forEach((step, index) => {
            const progressIndicator = step.querySelector('.progress-indicator');
            if (progressIndicator) {
                progressIndicator.style.width = index <= currentStep ? '100%' : '0%';
            }
        });
    };

    // Add progress indicators to each step
    steps.forEach(step => {
        const indicator = document.createElement('div');
        indicator.className = 'progress-indicator';
        indicator.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            width: 0;
            background: linear-gradient(90deg, #7c3aed, #3b82f6);
            transition: width 0.6s ease;
        `;
        step.appendChild(indicator);
    });

    // Update progress when steps are completed
    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            currentStep = index;
            updateProgress();
        });
    });
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initDiagnosisAnimations();
    createDiagnosisParticles();
    initProgressIndicator();
});

// Add necessary CSS animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-1000%) rotate(360deg);
            opacity: 0;
        }
    }

    .diagnosis-step-animated {
        cursor: pointer;
        transform-origin: center;
    }

    .diagnosis-step-animated:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
`;
document.head.appendChild(style);

// Enhanced image upload handling with animations
function initImageUploadAnimations() {
    const uploadSections = document.querySelectorAll('.upload-section');
    const previewContainers = document.querySelectorAll('.image-preview');
    
    uploadSections.forEach((section, index) => {
        const input = section.querySelector('input[type="file"]');
        const dropZone = section.querySelector('.drop-zone');
        const preview = previewContainers[index];
        const uploadIcon = section.querySelector('.upload-icon');
        
        // Add hover animation
        dropZone.style.cssText = `
            transition: all 0.3s ease;
            border: 2px dashed rgba(124, 58, 237, 0.5);
            background: rgba(124, 58, 237, 0.05);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        `;

        // Create ripple effect
        function createRipple(e) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            const rect = dropZone.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(124, 58, 237, 0.2);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                top: ${y}px;
                left: ${x}px;
            `;
            
            dropZone.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        }

        // Add upload animation
        function animateUpload() {
            uploadIcon.style.animation = 'uploadBounce 0.5s ease';
            setTimeout(() => {
                uploadIcon.style.animation = '';
            }, 500);
        }

        // Handle drag and drop events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        dropZone.addEventListener('dragenter', () => {
            dropZone.style.transform = 'scale(1.02)';
            dropZone.style.borderColor = '#7c3aed';
            dropZone.style.background = 'rgba(124, 58, 237, 0.1)';
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.style.transform = 'scale(1)';
            dropZone.style.borderColor = 'rgba(124, 58, 237, 0.5)';
            dropZone.style.background = 'rgba(124, 58, 237, 0.05)';
        });

        dropZone.addEventListener('drop', (e) => {
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                input.files = e.dataTransfer.files;
                handleImageUpload(input);
                createRipple(e);
                animateUpload();
            }
            dropZone.style.transform = 'scale(1)';
            dropZone.style.borderColor = 'rgba(124, 58, 237, 0.5)';
            dropZone.style.background = 'rgba(124, 58, 237, 0.05)';
        });

        // Click animation
        dropZone.addEventListener('click', (e) => {
            createRipple(e);
            input.click();
        });

        // Handle file selection
        input.addEventListener('change', () => {
            if (input.files && input.files[0]) {
                animateUpload();
                handleImageUpload(input);
            }
        });
    });
}

// Enhanced analysis progress animation
function simulateAnalysis() {
    const analysisProgress = document.querySelector('.analysis-progress');
    const progressBar = document.querySelector('.progress');
    const progressText = document.querySelector('.progress-text');
    const analysisSteps = [
        'Initializing analysis...',
        'Processing image...',
        'Detecting features...',
        'Analyzing patterns...',
        'Generating results...'
    ];
    
    let progress = 0;
    let currentStep = 0;
    
    analysisProgress.style.display = 'block';
    analysisProgress.style.opacity = '0';
    analysisProgress.style.transform = 'translateY(20px)';
    
    // Fade in animation
    setTimeout(() => {
        analysisProgress.style.transition = 'all 0.5s ease';
        analysisProgress.style.opacity = '1';
        analysisProgress.style.transform = 'translateY(0)';
    }, 100);

    const interval = setInterval(() => {
        progress += 1;
        progressBar.style.width = `${progress}%`;
        
        // Update step text with fade effect
        if (progress % 20 === 0 && currentStep < analysisSteps.length) {
            progressText.style.opacity = '0';
            setTimeout(() => {
                progressText.textContent = analysisSteps[currentStep];
                progressText.style.opacity = '1';
                currentStep++;
            }, 200);
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                // Fade out animation
                analysisProgress.style.opacity = '0';
                analysisProgress.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    analysisProgress.style.display = 'none';
                    showSymptomsForm();
                }, 500);
            }, 500);
        }
    }, 50);
}

// Animate symptoms form appearance
function showSymptomsForm() {
    const symptomsForm = document.querySelector('.symptoms-form');
    const symptoms = symptomsForm.querySelectorAll('.symptom-item');
    
    symptomsForm.style.display = 'block';
    symptomsForm.style.opacity = '0';
    
    // Stagger animation for each symptom item
    symptoms.forEach((symptom, index) => {
        symptom.style.opacity = '0';
        symptom.style.transform = 'translateX(-20px)';
        symptom.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            symptom.style.opacity = '1';
            symptom.style.transform = 'translateX(0)';
        }, 100 + index * 100);
    });
    
    // Fade in form
    setTimeout(() => {
        symptomsForm.style.transition = 'opacity 0.5s ease';
        symptomsForm.style.opacity = '1';
    }, 100);
}

// Add necessary CSS animation keyframes
const uploadAnimations = document.createElement('style');
uploadAnimations.textContent = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes uploadBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
    }
    
    .progress-text {
        transition: opacity 0.3s ease;
    }
    
    .upload-icon {
        transition: transform 0.3s ease;
    }
    
    .upload-icon:hover {
        transform: scale(1.1);
    }
    
    .symptom-item {
        transition: all 0.3s ease;
    }
    
    .symptom-item:hover {
        transform: translateX(5px);
    }
`;
document.head.appendChild(uploadAnimations);

// Initialize upload animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initImageUploadAnimations();
    // ... existing initialization code ...
});

// Handle login form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.querySelector('input[name="remember"]').checked;

        // Here you would typically send this data to your backend
        console.log('Login attempt:', { email, password, remember });
        
        // For demo purposes, show success message and redirect
        alert('Login successful!');
        window.location.href = 'index.html';
    });
}

// Handle social login buttons
const googleBtn = document.querySelector('.social-btn.google');
const facebookBtn = document.querySelector('.social-btn.facebook');

if (googleBtn) {
    googleBtn.addEventListener('click', function() {
        console.log('Google login clicked');
        // Implement Google login
    });
}

if (facebookBtn) {
    facebookBtn.addEventListener('click', function() {
        console.log('Facebook login clicked');
        // Implement Facebook login
    });
}

// Handle register link
function showRegisterForm() {
    // Here you would typically show a registration form
    alert('Registration form will be implemented here');
}

// Initialize animations for How It Works section
function initHowItWorksAnimations() {
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineSteps = document.querySelectorAll('.timeline-step');
    
    // Create Intersection Observer for the timeline container
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                timelineContainer.style.opacity = '1';
                timelineContainer.style.transform = 'translateY(0)';
                
                // Animate each step with delay
                timelineSteps.forEach((step, index) => {
                    setTimeout(() => {
                        step.style.opacity = '1';
                        step.style.transform = 'translateX(0)';
                    }, 300 * (index + 1));
                });
                
                timelineObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    // Start observing the timeline container
    if (timelineContainer) {
        timelineObserver.observe(timelineContainer);
    }
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initHowItWorksAnimations();
}); 