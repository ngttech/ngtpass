# NGTPass - Kid-Friendly Password Generator

A simple, child-friendly password generator designed to create easy-to-remember yet secure passwords.

![NGTPass](https://via.placeholder.com/800x400?text=NGTPass+Screenshot)

## Features

- **Simple Passwords**: Words + numbers (e.g., "dino1234") that are easy to remember
- **Strong Passwords**: Words + numbers + special characters (e.g., "sh!nyWolf84") for enhanced security
- **Kid-Friendly Interface**: Colorful, intuitive design that's easy for children to understand
- **Educational**: Includes password safety tips for kids
- **Privacy-Focused**: Passwords are generated in the browser and never stored on servers

## Use Cases

- Educational settings where teachers need to create memorable passwords for students
- Parents setting up accounts for their children
- Anyone who wants an easy-to-remember yet secure password

## Quick Start

### Using Docker (Recommended)

1. Make sure you have [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

2. Clone this repository:
   ```
   git clone <repository-url>
   cd ngtpass
   ```

3. Build and start the container:
   ```
   docker-compose up -d
   ```

4. Access the application at: http://localhost:5000

### Manual Setup

1. Make sure you have Python 3.6+ installed.

2. Clone this repository:
   ```
   git clone <repository-url>
   cd ngtpass
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the application:
   ```
   python app.py
   ```

5. Access the application at: http://localhost:5000

## Development

The application structure:

```
ngtpass/
├── app.py                # Flask application
├── password_generator.py # Password generation logic
├── templates/            # HTML templates
│   └── index.html        # Main page template
├── static/               # Static assets
│   ├── css/              # CSS styles
│   │   └── style.css     # Main stylesheet
│   └── js/               # JavaScript files
│       └── main.js       # Main frontend script
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose configuration
└── requirements.txt      # Python dependencies
```

## License

This project is open-source and available under the MIT License.

## Created By

NGT Technology - Making technology fun and accessible for everyone! 