import random
import string

# Word list for kid-friendly passwords
WORDS = [
    "apple", "banana", "orange", "grape", "pear", "kiwi", "lemon", "melon",
    "dog", "cat", "bird", "fish", "mouse", "rabbit", "turtle", "horse",
    "happy", "funny", "silly", "blue", "green", "red", "purple", "yellow",
    "star", "moon", "sun", "cloud", "rain", "snow", "wind", "tree",
    "book", "pencil", "school", "game", "soccer", "music", "dance", "song",
    "robot", "rocket", "planet", "space", "ocean", "river", "mountain", "forest",
    "dino", "dragon", "pirate", "ninja", "wizard", "fairy", "unicorn", "mermaid"
]

def generate_strong_password(min_length=8):
    """Generate a stronger password with words, numbers, and special characters"""
    # Keep generating until we meet the minimum length
    password = ""
    while len(password) < min_length:
        # Choose longer words when a longer password is requested
        word_pool = [w for w in WORDS if len(w) >= min(5, min_length // 3)]
        if not word_pool:  # Fallback if no words meet criteria
            word_pool = WORDS
            
        word = random.choice(word_pool)
        
        # Apply random capitalization to the word
        word = ''.join(c.upper() if random.choice([True, False]) else c for c in word)
        
        # Get additional word
        second_word_pool = [w for w in WORDS if len(w) >= min(5, min_length // 3)]
        if not second_word_pool:
            second_word_pool = WORDS
            
        second_word = random.choice(second_word_pool)
        second_word = second_word.capitalize() if random.choice([True, False]) else second_word
        
        # Get numbers - more digits for longer passwords
        num_digits = random.randint(1, min(3, min_length // 5))
        numbers = ''.join(random.choices(string.digits, k=num_digits))
        
        # Get special characters (limited to child-friendly ones)
        special_chars = '!@#$%^&*'
        special = random.choice(special_chars)
        
        # Decide where to place the special character
        special_pos = random.randint(0, 3)
        
        # Create password with full second word instead of truncated version
        if special_pos == 0:
            password = f"{special}{word}{numbers}{second_word}"
        elif special_pos == 1:
            password = f"{word}{special}{numbers}{second_word}"
        elif special_pos == 2:
            password = f"{word}{numbers}{special}{second_word}"
        else:
            password = f"{word}{numbers}{second_word}{special}"
    
    return password

def generate_passphrase(num_words=3, separator="-"):
    """Generate a memorable passphrase with multiple random words and a number
    
    Args:
        num_words (int): Number of words to include (default: 3)
        separator (str): Character to separate words ("-", ".", or "_")
    """
    # Select the specified number of words
    words = random.sample(WORDS, num_words)
    
    # Capitalize the first letter of each word
    words = [word.capitalize() for word in words]
    
    # Add a random number between 1-100
    number = random.randint(1, 100)
    
    # Join the words with the specified separator and add the number at the end
    return f"{separator.join(words)}{number}" 