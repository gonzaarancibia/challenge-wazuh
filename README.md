# Todo Plugin for OpenSearch Dashboards
## Overview
This plugin provides a task management system for security professionals using Wazuh. It allows users to create, track, and manage tasks related to security processes and compliance standards like PCI DSS, ISO 27001, and SOX.

## Features
- Create new tasks with title, description, assignee, and tags
- Track task status (planned, completed, error)
- Search tasks by text or tags
- Visualize tasks in tables and charts
- Delete completed tasks

## Screenshots
Here are some screenshots of the application:

![Todo List View](./screenshoots/home.png)
*Todo List View - Main interface showing all tasks*

![Task Analytics Dashboard](./screenshoots/footer.png)
*Task Analytics Dashboard - Visualizing task status and completion metrics*

### Frontend
- Built with ReactJS and OpenSearch Dashboards UI components
- Responsive design with tables and charts for task visualization
- Search functionality with filtering capabilities
- Container/Presentational pattern:
  - Container components handle logic and state management
  - Presentational components focus purely on UI rendering
- State management using Zustand for global state
- Custom hooks for API interactions
- Responsive layout adapting to different screen sizes
### Backend
- REST API built with NodeJS
- Controller-based architecture for better code organization
- OpenSearch for data persistence
- Singleton pattern for service management
## Technical Implementation
### Backend Services
The backend uses a service-based architecture to manage OpenSearch connections:

```typescript
// OpenSearchService - Singleton pattern for managing OpenSearch connections
// Provides centralized client access across the application
 ```
```

### Controllers
Controllers handle the business logic and separate it from the routes:

```typescript
// TodoController - Manages CRUD operations for todos
// Methods: getTodos, createTodo, updateTodoStatus, deleteTodo
 ```
```

### Data Model
Each todo item contains:

- Title (required)
- Status (planned, completed, error)
- Creation date
- Completion date (when applicable)
- Assignee (optional)
- Description (optional)
- Tags (optional)
## Development Challenges
During development, I faced some challenges:

- Had to configure virtual memory on a secondary disk since I couldn't increase it on the primary disk
- Working with the OpenSearch client required understanding the specific query structure
- Implementing proper error handling across the application
## Future Improvements
Some features I'd like to add:

- User authentication and authorization
- Task prioritization
- Due dates and reminders
- Bulk operations for tasks
- Export/import functionality
- More advanced visualizations and analytics
## Running the Application
Instructions for running the application using Docker:

```bash
docker compose up -d
 ```

Access the application at http://localhost:5601

## Testing
Tests are implemented using Jest. To run the tests:

```bash
# Inside the Docker container
npm test
 ```
