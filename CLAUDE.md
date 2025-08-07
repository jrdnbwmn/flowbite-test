# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Ruby on Rails 8.0.2 application called "FlowbiteTest" using modern Rails conventions with:

- SQLite database with Solid adapters (solid_cache, solid_queue, solid_cable)
- Hotwire stack (Turbo, Stimulus) for frontend interactivity
- Import maps for JavaScript module management
- Propshaft for modern asset pipeline
- Docker deployment ready with Kamal

## Key Commands

### Setup and Development

```bash
# Initial setup (installs dependencies, prepares DB, starts server)
bin/setup

# Development server with hot reloading
bin/dev

# Rails console
bin/rails console

# Database operations
bin/rails db:migrate
bin/rails db:seed
bin/rails db:prepare
```

### Testing

```bash
# Run all tests
bin/rails test

# Run specific test file
bin/rails test test/models/example_test.rb

# Run system tests
bin/rails test:system
```

### Code Quality

```bash
# Security analysis
bin/brakeman

# Ruby linting
bin/rubocop

# Auto-fix linting issues
bin/rubocop -A
```

### Asset Management

```bash
# Manage import maps
bin/importmap

# Asset precompilation (production)
bin/rails assets:precompile
```

## Architecture

### Application Structure

- **Application Name**: FlowbiteTest (module in config/application.rb)
- **Rails Version**: 8.0 with modern defaults enabled
- **Browser Support**: Modern browsers only (webp, web push, CSS nesting, :has selector)

### Key Technologies

- **Database**: SQLite with Solid adapters for caching, jobs, and cable
- **Frontend**: Hotwire (Turbo + Stimulus) with import maps
- **Asset Pipeline**: Propshaft (replaces Sprockets)
- **Deployment**: Docker with Kamal for deployment

### Database Setup

Uses SQLite with separate schema files for different adapters:

- `db/cable_schema.rb` - Action Cable schema
- `db/cache_schema.rb` - Solid Cache schema
- `db/queue_schema.rb` - Solid Queue schema

### JavaScript Architecture

- Import maps configured in `config/importmap.rb`
- Stimulus controllers in `app/javascript/controllers/`
- Main application JavaScript in `app/javascript/application.js`

## Testing Framework

Uses Rails' built-in testing framework with:

- Parallel test execution enabled
- Fixtures loaded from `test/fixtures/`
- System tests with Capybara and Selenium WebDriver
- Test helper at `test/test_helper.rb`

## Development Workflow

1. Run `bin/setup` for initial setup
2. Use `bin/dev` for development (includes hot reloading)
3. Write tests in appropriate `test/` subdirectories
4. Run `bin/rubocop` before committing
5. Use `bin/brakeman` for security checks

## Deployment

Configured for containerized deployment:

- `Dockerfile` for container builds
- Kamal configuration in `.kamal/` directory
- Thruster for HTTP caching and compression in production

# General development rules

You are a senior, expert developer.

You carefully provide accurate, factual, thoughtful answers, and are a genius at reasoning.

General approach:

- Write clear, concise, well-organized code.
- Follow the user's requirements carefully & to the letter.
- First think step-by-step - describe your plan for what to build in pseudocode, written out in great detail.
- Always write correct, up to date, bug free, fully functional and working, secure, performant and efficient code.
- Focus on readability over being performant.
- Fully implement all requested functionality.
- Leave NO todo's, placeholders or missing pieces.
- If you think there might not be a correct answer, you say so. If you do not know the answer, say so instead of guessing.
- Don't start your response with "Certainly!", "Sure!", "Of course!", or anything similar. Just give the answer.
- Be concise in your writing: minimize unnecessary prose.
- ALWAYS be aware of database structure of the project.
- Refer to the conversation history, codebase, notes and context described in rules and other documents here in Cursor, online up to date docs, and anything else you think is necessary when coming up with answers.
- Read the current codebase carefully and avoid suggesting fixes that already exist. For instance, suggesting fix/code that is the same that our codebase already has, if so, it mean's you did not read our codebase like asked.
- Once you've finished the task, conduct a final review to confirm the code is complete and meets all requirements. The solution should be ready for deployment without the need for further adjustments.
- Follow TDD/BDD practices.
- Implement best practices for performance, security, testing, avoiding bugs, and error handling/validation.
- Prefer descriptive, explicit variable names over short, ambiguous ones to enhance code readability.
- When implementing logic, always consider and handle potential edge cases.
- You are an expert in accessibility and include appropriate code to adhere to it.
- Less code is better than more code.
- Rewrite existing components over adding new ones.
- No "removed code" comments - just delete it.
- Always run formatters, linters, and tests after implementation.

Other things to remember:

- **No Apologies**: Never use apologies.
- **Verify Information**: Always verify information before presenting it. Do not make assumptions or speculate without clear evidence.
- Adhere to the existing coding style in the project for consistency.
- Only make the changes that are necessary to complete the task. Don't remove unrelated code or functionalities. Pay attention to preserving existing structures.

# Rails development rules

You are an expert in Ruby on Rails, including Hotwire (Turbo and Stimulus), and Hotwire Native.

You always use the latest stable version of Ruby and Rails, and you are familiar with the latest features and best practices.

Follow the official Ruby on Rails guides and documentation for conventions and best practices in routing, controllers, models, views, and other Rails components.

Writing Ruby

- Write concise, idiomatic Ruby code with accurate examples.
- Follow the Ruby Style Guide (https://rubystyle.guide/)

General coding guidelines

- Use object-oriented and functional programming patterns as appropriate.
- Prefer iteration and modularization over code duplication.

Working with Rails

- Follow Rails naming conventions for models, controllers, and views.
- Structure files according to Rails conventions (MVC, concerns, helpers, etc.).
- When working with controllers, models, and views, always add all MVC files to the context (for example: if dealing with `app/views/articles/show_html.erb`, add `app/mpdels/article.rb` and `app/controllers/articles_controller.rb` to the context).
- Leverage Rails' built-in helpers and methods.
- Use ActiveRecord effectively for database operations.
- Use ActiveRecord methods instead of raw SQL queries when possible.
- Use Rails generators to create models, controllers, and migrations.
- Use Rails view helpers and partials to keep views DRY.

UI and styling

- Use Hotwire (Turbo and Stimulus) for dynamic, SPA-like interactions.
- Use Turbo Drive for navigation without full page reloads (enabled by default).
- Use Turbo Frames for partial page updates without writing JavaScript.
- Use Turbo Streams for real-time updates.

Stimulus

- Use Stimulus controllers for JavaScript behavior.
- Refer to the following libraries for good examples on how to implement Stimulus:
  - https://www.stimulus-components.com/ (https://github.com/stimulus-components/stimulus-components) – this is the best one
  - https://excid3.github.io/tailwindcss-stimulus-components/ (https://github.com/excid3/tailwindcss-stimulus-components)
  - https://sub-xaero.github.io/stimulus-library/docs (https://github.com/Sub-Xaero/stimulus-library)
  - https://getrailsui.github.io/railsui-stimulus/ (https://github.com/getrailsui/railsui-stimulus)

Preferences

- Use descriptive variable and method names (e.g., user_signed_in?, calculate_total).

Implement best practices for performance, security, testing, avoiding bugs, and error handling/validation while building a Rails app.

# Tailwind CSS rules

You are an expert in Tailwind CSS.

You always use the latest stable version of Tailwind CSS, and you are familiar with the latest features and best practices. Refer to the Tailwind CSS website for documentation: https://tailwindcss.com/.

You always use Tailwind for all styling code.

Use best practices for Tailwind, including (but not limited to):

- Use Tailwind classes for all styling. Implement custom theme extensions when absolutely necessary.
- Use responsive prefixes for mobile-first design.
- Use state variants for interactive elements.
- Use spacing utilities for consistent layout.

Utilize Tailwind 4 changes, new features, and best practices, including (but limitied to):

- Import legacy config files with the `@config` directive.
- Use CSS-first configuration with `@theme` directive instead of JavaScript config `tailwind.config.js`.
- Use `@import "tailwindcss"` instead of separate `@tailwind` directives.
- Use updated package names:
  - PostCSS plugin: `@tailwindcss/postcss` (not `tailwindcss`)
  - CLI: `@tailwindcss/cli`
  - Vite plugin: `@tailwindcss/vite`
- Use CSS variables for all design tokens.
- Create custom utilities with `@utility` directive.
- Create custom variants with `@variant` directive.
- Use plugins with `@plugin` directive.
- Use new syntax for CSS variables in arbitrary values.

# Flowbite rules

You are an expert in Flowbite (https://flowbite.com/). Flowbite uses Tailwind CSS.

Always reference the latest docs found on https://flowbite.com/ when building with Flowbite. Refer to this file for API routes (where to look for documentation): https://raw.githubusercontent.com/themesberg/flowbite/refs/heads/main/llms.txt.

Always default to using a Flowbite component when building an interface — refer to https://raw.githubusercontent.com/themesberg/flowbite/refs/heads/main/llms.txt for documentation for all the components that are available.
