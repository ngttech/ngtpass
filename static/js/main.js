document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const passwordResult = document.getElementById('password-result');
    const copyButton = document.getElementById('copy-button');
    const strongBtn = document.getElementById('strong-btn');
    const passphraseBtn = document.getElementById('passphrase-btn');
    
    // Strength meter elements
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    
    // Configuration elements
    const strongMinLength = document.getElementById('strong-min-length');
    const strongMinLengthValue = document.getElementById('strong-min-length-value');
    const passphraseWords = document.getElementById('passphrase-words');
    const passphraseWordsValue = document.getElementById('passphrase-words-value');
    const separatorRadios = document.querySelectorAll('input[name="separator"]');
    
    // Update display values when sliders change
    strongMinLength.addEventListener('input', function() {
        strongMinLengthValue.textContent = this.value;
    });
    
    passphraseWords.addEventListener('input', function() {
        passphraseWordsValue.textContent = this.value;
    });
    
    // Generate Strong Password
    strongBtn.addEventListener('click', function() {
        const minLength = strongMinLength.value;
        
        fetch(`/strong_password?min_length=${minLength}`)
            .then(response => response.json())
            .then(data => {
                passwordResult.textContent = data.password;
                animatePasswordDisplay();
                evaluatePasswordStrength(data.password);
            })
            .catch(error => {
                console.error('Error:', error);
                passwordResult.textContent = 'Oops! Something went wrong.';
                resetStrengthMeter();
            });
    });
    
    // Generate Passphrase
    passphraseBtn.addEventListener('click', function() {
        const numWords = passphraseWords.value;
        let separator = '-'; // Default
        
        // Get selected separator
        for (const radio of separatorRadios) {
            if (radio.checked) {
                separator = radio.value;
                break;
            }
        }
        
        fetch(`/passphrase?num_words=${numWords}&separator=${separator}`)
            .then(response => response.json())
            .then(data => {
                passwordResult.textContent = data.passphrase;
                animatePasswordDisplay();
                evaluatePasswordStrength(data.passphrase);
            })
            .catch(error => {
                console.error('Error:', error);
                passwordResult.textContent = 'Oops! Something went wrong.';
                resetStrengthMeter();
            });
    });
    
    // Password Strength Evaluation
    function evaluatePasswordStrength(password) {
        // Reset classes
        strengthBar.className = 'strength-bar';
        strengthText.className = 'strength-text';
        
        if (!password || password === 'Click a button to generate a password!') {
            resetStrengthMeter();
            return;
        }
        
        // Calculate score based on various factors
        let score = 0;
        
        // Length factor (0-25 points)
        const lengthFactor = Math.min(25, Math.floor(password.length * 2));
        score += lengthFactor;
        
        // Character variety (0-25 points)
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasDigits = /\d/.test(password);
        const hasSpecialChars = /[^a-zA-Z0-9]/.test(password);
        
        const varietyScore = (hasLowercase ? 6 : 0) + 
                            (hasUppercase ? 6 : 0) + 
                            (hasDigits ? 6 : 0) + 
                            (hasSpecialChars ? 7 : 0);
        score += varietyScore;
        
        // Word count for passphrases (0-25 points)
        const wordCount = password.split(/[-._]/).length;
        const wordCountScore = Math.min(25, wordCount * 8);
        score += wordCountScore;
        
        // Substitutions (0-25 points)
        const substitutionCount = (password.match(/[@3!0$71]/g) || []).length;
        const substitutionScore = Math.min(25, substitutionCount * 5);
        score += substitutionScore;
        
        // Determine strength level based on score
        let strengthClass = '';
        let strengthDescription = '';
        
        if (score < 40) {
            strengthClass = 'strength-very-weak';
            strengthDescription = 'Very Weak';
            strengthText.className = 'strength-text text-very-weak';
        } else if (score < 60) {
            strengthClass = 'strength-weak';
            strengthDescription = 'Weak';
            strengthText.className = 'strength-text text-weak';
        } else if (score < 80) {
            strengthClass = 'strength-medium';
            strengthDescription = 'Medium';
            strengthText.className = 'strength-text text-medium';
        } else if (score < 90) {
            strengthClass = 'strength-strong';
            strengthDescription = 'Strong';
            strengthText.className = 'strength-text text-strong';
        } else {
            strengthClass = 'strength-very-strong';
            strengthDescription = 'Very Strong';
            strengthText.className = 'strength-text text-very-strong';
        }
        
        // Update the strength meter
        strengthBar.className = `strength-bar ${strengthClass}`;
        strengthText.textContent = `${strengthDescription} (Score: ${score}/100)`;
    }
    
    function resetStrengthMeter() {
        strengthBar.className = 'strength-bar';
        strengthBar.style.width = '0';
        strengthText.className = 'strength-text';
        strengthText.textContent = 'Not evaluated';
    }
    
    // Copy to clipboard functionality
    copyButton.addEventListener('click', function() {
        const textToCopy = passwordResult.textContent;
        
        // Don't copy the default message
        if (textToCopy === 'Click a button to generate a password!') {
            return;
        }
        
        // Fallback for older browsers
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(textToCopy);
            return;
        }
        
        // Use the Clipboard API
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                showCopiedFeedback();
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                fallbackCopyTextToClipboard(textToCopy);
            });
    });
    
    // Fallback copy method for browsers that don't support clipboard API
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        // Make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopiedFeedback();
            } else {
                alert('Unable to copy to clipboard');
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            alert('Unable to copy to clipboard: ' + err);
        }
        
        document.body.removeChild(textArea);
    }
    
    // Show visual feedback when copied
    function showCopiedFeedback() {
        const originalText = copyButton.querySelector('.copy-text').textContent;
        copyButton.querySelector('.copy-text').textContent = 'Copied!';
        copyButton.classList.add('copied');
        
        // Reset after 2 seconds
        setTimeout(() => {
            copyButton.querySelector('.copy-text').textContent = originalText;
            copyButton.classList.remove('copied');
        }, 2000);
    }
    
    // Animation for password display
    function animatePasswordDisplay() {
        passwordResult.style.animation = 'none';
        // Trigger reflow
        void passwordResult.offsetWidth;
        passwordResult.style.animation = 'pulse 0.5s';
    }
    
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