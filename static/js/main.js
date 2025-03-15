document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const passwordResult = document.getElementById('password-result');
    const copyButton = document.getElementById('copy-button');
    const strongBtn = document.getElementById('strong-btn');
    const passphraseBtn = document.getElementById('passphrase-btn');
    
    // Initialize variables
    let currentPassword = '';
    
    // Generate strong password
    strongBtn.addEventListener('click', function() {
        // Show loading state
        passwordResult.textContent = 'Generating...';
        
        // Fetch strong password from API
        fetch('/generate/strong')
            .then(response => response.json())
            .then(data => {
                currentPassword = data.password;
                passwordResult.textContent = currentPassword;
                
                // Add some visual feedback
                passwordResult.style.animation = 'none';
                void passwordResult.offsetWidth; // Trigger reflow
                passwordResult.style.animation = 'pulse 0.5s';
            })
            .catch(error => {
                console.error('Error:', error);
                passwordResult.textContent = 'Oops! Something went wrong.';
            });
    });
    
    // Generate passphrase
    passphraseBtn.addEventListener('click', function() {
        // Show loading state
        passwordResult.textContent = 'Generating...';
        
        // Fetch passphrase from API
        fetch('/generate/passphrase')
            .then(response => response.json())
            .then(data => {
                currentPassword = data.password;
                passwordResult.textContent = currentPassword;
                
                // Add some visual feedback
                passwordResult.style.animation = 'none';
                void passwordResult.offsetWidth; // Trigger reflow
                passwordResult.style.animation = 'pulse 0.5s';
            })
            .catch(error => {
                console.error('Error:', error);
                passwordResult.textContent = 'Oops! Something went wrong.';
            });
    });
    
    // Copy password to clipboard
    copyButton.addEventListener('click', function() {
        if (currentPassword) {
            navigator.clipboard.writeText(currentPassword)
                .then(() => {
                    // Visual feedback for successful copy
                    const originalText = copyButton.querySelector('.copy-text').textContent;
                    copyButton.querySelector('.copy-text').textContent = 'Copied!';
                    copyButton.style.backgroundColor = '#4CAF50';
                    
                    // Reset after 2 seconds
                    setTimeout(() => {
                        copyButton.querySelector('.copy-text').textContent = originalText;
                        copyButton.style.backgroundColor = '#292a27'; // Updated to match the dark gray color
                    }, 2000);
                })
                .catch(err => {
                    console.error('Error copying text: ', err);
                });
        }
    });
    
    // Add a special pulse animation to the CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // Add fancy hover effects to the cards
    const cards = document.querySelectorAll('.option-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate the tilt angle
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltX = (y - centerY) / 20;
            const tiltY = (centerX - x) / 20;
            
            // Apply the transform
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Auto-generate a password when the page loads
    setTimeout(() => {
        strongBtn.click();
    }, 500);
}); 