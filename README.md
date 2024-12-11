# Ollama Next.js

Ollama Next.js is a web application built with Next.js that allows users to interact with Ollama servers. This project provides a user-friendly interface for managing chat sessions, configuring server settings, and customizing the appearance of the application.

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Settings Dialog](#settings-dialog)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To get started with the Ollama Next.js project, follow the instructions below.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dustinwloring198/ollama-nextjs.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ollama-nextjs
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

### Usage

To run the application in development mode, use the following command:

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Features

- **User Authentication**: Secure login and user management.
- **Chat Management**: Create, delete, and manage chat sessions.
- **Server Configuration**: Easily configure and manage Ollama servers.
- **Customizable Appearance**: Change themes and font sizes to suit your preferences.
- **Export Chats**: Export chat history for future reference.

## Settings Dialog

The Settings Dialog allows users to manage server configurations, chat history, and appearance settings. Below are the key features of the Settings Dialog:

### Features

- **Server Management**: 
  - Add new servers by providing a name, URL, and port.
  - Remove existing servers from the list.
  - Set a server as active to use for chat sessions.
  - Refresh the list of models available for each server.

- **Chat History Management**:
  - Export all chat history to a JSON file for backup or analysis.
  - Delete all chat history with a confirmation prompt.

- **Appearance Settings**:
  - Choose between different themes: Light, Dark, or System.
  - Adjust font size preferences: Small, Medium, or Large.

### Usage

To access the Settings Dialog, click on the settings icon located in the sidebar. This will open a dialog where you can navigate through different tabs to manage your settings.

### Example

Here’s a brief overview of how to add a new server:

1. Click on the **Add Server** button.
2. Fill in the **Server Name**, **URL**, and **Port** fields.
3. Click **Add Server** to save the new server configuration.

### Important Notes

- Ensure that the server URL and port are unique to avoid conflicts.
- Deleting all chats is irreversible; please use this feature with caution.

## Contributing

We welcome contributions to the Ollama Next.js project! If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your branch to your forked repository.
5. Create a pull request describing your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

For more information, please refer to the [documentation](https://github.com/dustinwloring198/ollama-nextjs) or contact the project maintainers.