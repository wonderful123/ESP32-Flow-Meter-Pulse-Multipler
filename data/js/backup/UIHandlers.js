const statusMessage = document.getElementById('statusMessage');

// Helper function to update the status message with dynamic notification types
export function updateStatusMessage(message, type = 'info') {
    // Define the base class for the notification
    const baseClass = 'notification';
    // Object mapping for message types to Bulma notification classes
    const typeClassMap = {
      success: 'is-success',
      error: 'is-danger',
      warning: 'is-warning',
      info: 'is-info',
      primary: 'is-primary', // You can use 'primary' for general information or start messages
      light: 'is-light' // For less prominent messages
    };

    // Remove all potential type classes to prevent class conflicts
    for (const value of Object.values(typeClassMap)) {
      statusMessage.classList.remove(value);
    }

    // Add the base notification class if not already present
    if (!statusMessage.classList.contains(baseClass)) {
      statusMessage.classList.add(baseClass);
    }

    // Add the specific class for the message type
    statusMessage.classList.add(typeClassMap[type]);

    // Set the message text
    statusMessage.innerHTML = `${message}`;
  }