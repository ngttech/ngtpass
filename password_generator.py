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

# Letter to symbol/number substitutions
SUBSTITUTIONS = {
    'a': '@',
    'e': '3',
    'i': '!',
    'o': '0',
    's': '$',
    't': '7',
    'l': '1'
}

def apply_substitutions(word, probability=0.3):
    """Apply letter-to-symbol/number substitutions with a certain probability"""
    result = ""
    for char in word:
        lower_char = char.lower()
        # Only substitute lowercase letters that are in our substitution map
        # and only with a certain probability to keep readability
        if lower_char in SUBSTITUTIONS and random.random() < probability:
            result += SUBSTITUTIONS[lower_char]
        else:
            result += char
    return result

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
        
        # Apply letter substitutions
        word = apply_substitutions(word)
        
        # Get additional word
        second_word_pool = [w for w in WORDS if len(w) >= min(5, min_length // 3)]
        if not second_word_pool:
            second_word_pool = WORDS
            
        second_word = random.choice(second_word_pool)
        second_word = second_word.capitalize() if random.choice([True, False]) else second_word
        
        # Apply letter substitutions to second word
        second_word = apply_substitutions(second_word)
        
        # Get numbers - limit to at most 3 digits as per requirements
        num_digits = random.randint(1, min(3, min_length // 5))
        numbers = ''.join(random.choices(string.digits, k=num_digits))
        
        # Get special characters (limited to child-friendly ones)
        special_chars = '!@#$%^&*'
        special = random.choice(special_chars)
        
        # Decide where to place the special character (never at the start)
        special_pos = random.randint(1, 3)
        
        # Create password with full second word instead of truncated version
        if special_pos == 1:
            password = f"{word}{special}{numbers}{second_word}"
        elif special_pos == 2:
            password = f"{word}{numbers}{special}{second_word}"
        else:  # special_pos == 3
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
    
    # Apply letter substitutions to some words (but not all to maintain readability)
    if num_words > 2:
        # Apply substitutions to a random word
        random_word_index = random.randint(0, num_words - 1)
        words[random_word_index] = apply_substitutions(words[random_word_index], probability=0.4)
    
    # Add a random number between 1-100
    number = random.randint(1, 100)
    
    # Join the words with the specified separator and add the number at the end
    return f"{separator.join(words)}{number}" 