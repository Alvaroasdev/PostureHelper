# Posture Helper Astro Project

A minimal posture reminder app built with Astro, JavaScript, and CSS.

## Overview

This project is a simple web application designed to help users maintain better posture through timed reminders. The application features a timer that allows users to set focus sessions, quick breaks, and deep work periods.

## Project Structure

```
posture-helper-astro
├── public
│   └── postura.png
├── src
│   ├── components
│   ├── layouts
│   ├── pages
│   │   └── index.astro
│   ├── scripts
│   │   └── timer.js
│   └── styles
│       └── main.css
├── astro.config.mjs
├── package.json
└── README.md
```

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```
   cd posture-helper-astro
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the development server, run:

```
npm run dev
```

Open your browser and go to `http://localhost:3000` to view the application.

## Features

## Features

- **Timer Functionality**: Start, pause, and reset the timer for different session types.
- **Session Tracking**: Track the number of completed sessions for Focus, Quick, and Deep work modes.
- **Notifications**: Visual and audio reminders to correct posture at the end of each session.
- **Focus History**: Log of activities the user focused on during each session.
- **Persistent Notification**: Notifications remain visible until the user closes them manually.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
