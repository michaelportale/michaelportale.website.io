// Main website functionality
console.log("Welcome to my personal website!");

document.addEventListener('DOMContentLoaded', function() {
    // Custom cursor effect
    const cursor = document.querySelector('.cursor');
    const cursorShadow = document.querySelector('.cursor-shadow');
    
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.display = 'block';
            cursorShadow.style.display = 'block';
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorShadow.style.left = e.clientX + 'px';
            cursorShadow.style.top = e.clientY + 'px';
        });
        
        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
            cursorShadow.style.transform = 'translate(-50%, -50%) scale(0.7)';
        });
        
        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorShadow.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            
            // Update active navigation link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Dark/Light theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    let isDarkMode = true;

    themeToggle.addEventListener('click', () => {
        if (isDarkMode) {
            document.documentElement.style.setProperty('--bg-color', '#f0f0f0');
            document.documentElement.style.setProperty('--text-color', '#0f1624');
            document.documentElement.style.setProperty('--card-bg', '#ffffff');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.documentElement.style.setProperty('--bg-color', '#0f1624');
            document.documentElement.style.setProperty('--text-color', '#f0f0f0');
            document.documentElement.style.setProperty('--card-bg', '#171f38');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        isDarkMode = !isDarkMode;
    });

    // Handle scroll for navigation background
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(15, 22, 36, 0.95)';
            nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'rgba(15, 22, 36, 0.7)';
            nav.style.boxShadow = 'none';
        }
        
        // Update active nav link based on scroll position
        const sections = document.querySelectorAll('.section-full');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
});