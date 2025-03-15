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
    word = random.choice(WORDS)
    
    # Apply random capitalization to the word
    word = ''.join(c.upper() if random.choice([True, False]) else c for c in word)
    
    # Get additional word
    second_word = random.choice(WORDS)
    second_word = second_word.capitalize() if random.choice([True, False]) else second_word
    
    # Get numbers
    numbers = ''.join(random.choices(string.digits, k=random.randint(1, 2)))
    
    # Get special characters (limited to child-friendly ones)
    special_chars = '!@#$%^&*'
    special = random.choice(special_chars)
    
    # Decide where to place the special character
    special_pos = random.randint(0, 3)
    
    # Create password with full second word instead of truncated version
    if special_pos == 0:
        return f"{special}{word}{numbers}{second_word}"
    elif special_pos == 1:
        return f"{word}{special}{numbers}{second_word}"
    elif special_pos == 2:
        return f"{word}{numbers}{special}{second_word}"
    else:
        return f"{word}{numbers}{second_word}{special}"

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