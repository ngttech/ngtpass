document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const passwordResult = document.getElementById('password-result');
    const copyButton = document.getElementById('copy-button');
    const strongBtn = document.getElementById('strong-btn');
    const passphraseBtn = document.getElementById('passphrase-btn');
    const manualEvaluateBtn = document.getElementById('manual-evaluate');
    const testStrengthBarBtn = document.getElementById('test-strength-bar');
    
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
                
                // Force immediate evaluation with delay to ensure DOM updates
                setTimeout(() => {
                    console.log('Forcing evaluation of password:', data.password);
                    evaluatePasswordStrength(data.password);
                    
                    // Double-check if the strength bar is visible
                    console.log('Strength bar after evaluation:', {
                        width: strengthBar.style.width,
                        className: strengthBar.className,
                        visible: strengthBar.offsetWidth > 0
                    });
                }, 100);
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
                
                // Force immediate evaluation with delay to ensure DOM updates
                setTimeout(() => {
                    console.log('Forcing evaluation of passphrase:', data.passphrase);
                    evaluatePasswordStrength(data.passphrase);
                    
                    // Double-check if the strength bar is visible
                    console.log('Strength bar after evaluation:', {
                        width: strengthBar.style.width,
                        className: strengthBar.className,
                        visible: strengthBar.offsetWidth > 0
                    });
                }, 100);
            })
            .catch(error => {
                console.error('Error:', error);
                passwordResult.textContent = 'Oops! Something went wrong.';
                resetStrengthMeter();
            });
    });
    
    // Password Strength Evaluation
    function evaluatePasswordStrength(password) {
        console.log('Starting strength evaluation for:', password);
        
        // Check if elements exist
        if (!strengthBar || !strengthText) {
            console.error('Strength meter elements not found:', {
                strengthBar: !!strengthBar,
                strengthText: !!strengthText
            });
            return;
        }
        
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
        
        console.log('Password score calculation:', {
            lengthFactor,
            varietyScore,
            wordCountScore,
            substitutionScore,
            totalScore: score
        });
        
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
        
        // Update the strength meter - explicitly set width as inline style
        strengthBar.className = `strength-bar ${strengthClass}`;
        
        // Force the width to be set directly as a style
        if (strengthClass === 'strength-very-weak') {
            strengthBar.style.width = '20%';
        } else if (strengthClass === 'strength-weak') {
            strengthBar.style.width = '40%';
        } else if (strengthClass === 'strength-medium') {
            strengthBar.style.width = '60%';
        } else if (strengthClass === 'strength-strong') {
            strengthBar.style.width = '80%';
        } else if (strengthClass === 'strength-very-strong') {
            strengthBar.style.width = '100%';
        }
        
        strengthText.textContent = `${strengthDescription} (Score: ${score}/100)`;
        
        // Log for debugging
        console.log('Password evaluation complete:', {
            score,
            strengthClass,
            width: strengthBar.style.width,
            barElement: strengthBar
        });
        
        // Force a repaint of the strength bar
        strengthBar.style.display = 'none';
        void strengthBar.offsetHeight; // Trigger reflow
        strengthBar.style.display = 'block';
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
        console.log('Auto-generating password...');
        try {
            // Try to generate a new password
            strongBtn.click();
            
            // If there's already a password displayed (e.g., from a previous session),
            // evaluate it directly
            const currentPassword = passwordResult.textContent;
            if (currentPassword && currentPassword !== 'Click a button to generate a password!') {
                console.log('Evaluating existing password:', currentPassword);
                evaluatePasswordStrength(currentPassword);
            }
        } catch (error) {
            console.error('Error auto-generating password:', error);
        }
    }, 1000);
    
    // Add a direct test function to manually set the strength bar
    function testStrengthBar() {
        if (!strengthBar || !strengthText) {
            alert('Strength meter elements not found!');
            return;
        }
        
        // Test each strength level
        const levels = [
            { class: 'strength-very-weak', width: '20%', text: 'Very Weak (Test)', textClass: 'text-very-weak' },
            { class: 'strength-weak', width: '40%', text: 'Weak (Test)', textClass: 'text-weak' },
            { class: 'strength-medium', width: '60%', text: 'Medium (Test)', textClass: 'text-medium' },
            { class: 'strength-strong', width: '80%', text: 'Strong (Test)', textClass: 'text-strong' },
            { class: 'strength-very-strong', width: '100%', text: 'Very Strong (Test)', textClass: 'text-very-strong' }
        ];
        
        let currentLevel = 0;
        
        function showNextLevel() {
            if (currentLevel >= levels.length) {
                currentLevel = 0;
            }
            
            const level = levels[currentLevel];
            
            // Reset classes
            strengthBar.className = 'strength-bar';
            strengthText.className = 'strength-text';
            
            // Set new classes and styles
            strengthBar.className = `strength-bar ${level.class}`;
            strengthBar.style.width = level.width;
            strengthText.className = `strength-text ${level.textClass}`;
            strengthText.textContent = level.text;
            
            // Force a repaint
            strengthBar.style.display = 'none';
            void strengthBar.offsetHeight;
            strengthBar.style.display = 'block';
            
            currentLevel++;
        }
        
        // Show first level immediately
        showNextLevel();
        
        // Show remaining levels with a delay
        const intervalId = setInterval(() => {
            showNextLevel();
            
            // Stop after showing all levels
            if (currentLevel >= levels.length) {
                clearInterval(intervalId);
                
                // Reset to original state
                setTimeout(() => {
                    strengthBar.className = 'strength-bar';
                    strengthBar.style.width = '0';
                    strengthText.className = 'strength-text';
                    strengthText.textContent = 'Not evaluated';
                }, 1000);
            }
        }, 1000);
    }
    
    // Add event listener for manual evaluation button
    if (manualEvaluateBtn) {
        manualEvaluateBtn.addEventListener('click', function() {
            const currentPassword = passwordResult.textContent;
            
            // Add an alert to confirm the button click is working
            alert(`Attempting to evaluate: "${currentPassword}"\n\nCheck the browser console for detailed logs.`);
            
            console.log('Manual evaluation triggered for:', currentPassword);
            
            // Check if strength meter elements exist
            if (!strengthBar) {
                alert('ERROR: Strength bar element not found in the DOM!');
                console.error('Strength bar element not found');
            }
            
            if (!strengthText) {
                alert('ERROR: Strength text element not found in the DOM!');
                console.error('Strength text element not found');
            }
            
            if (currentPassword && currentPassword !== 'Click a button to generate a password!') {
                // Call the evaluation function
                evaluatePasswordStrength(currentPassword);
                
                // Check if the strength bar has a width after evaluation
                setTimeout(() => {
                    const barWidth = strengthBar.style.width;
                    const barClass = strengthBar.className;
                    alert(`Evaluation complete!\n\nStrength bar width: ${barWidth}\nStrength bar class: ${barClass}\n\nIf width is "0" or empty, this is a display issue.`);
                    
                    // If evaluation didn't work, try the direct test
                    if (!barWidth || barWidth === '0' || barWidth === '0px') {
                        if (confirm('Strength bar not displaying. Run visual test?')) {
                            testStrengthBar();
                        }
                    }
                }, 200);
            } else {
                alert('Please generate a password first');
            }
        });
    }
    
    // Add event listener for test button
    if (testStrengthBarBtn) {
        testStrengthBarBtn.addEventListener('click', function() {
            alert('Running visual test of the strength meter...');
            testStrengthBar();
        });
    }
}); 