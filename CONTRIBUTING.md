# Contributing

This document covers development setup, testing, and the release process.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Building and Running](#building-and-running)
- [How to Contribute](#how-to-contribute)
  - [Website content (from contributors with Markdown focus)](#1-website-content-from-contributors-with-markdown-focus)
  - [Web app features (from contributors with TypeScript and Markdown focus)](#2-web-app-features-from-contributors-with-typescript-and-markdown-focus)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: [Download and install](https://nodejs.org/) (Version 18+ recommended).
- **Python**: [Download and install](https://www.python.org/) (Often required for build tools).
- **Antigravity** (Recommended): We recommend using **Antigravity** as your Agentic/AI coding IDE for the best development experience.
- **Visual Studio Build Tools** (Windows Only):
  1. Download and install the [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) installer.
  2. Launch the **Visual Studio Installer** from the Windows start menu.
  3. Proceed to the installation options page.
  4. Switch to the **Individual Components** tab.
  5. Select just the essentials:
     - `MSVC v143 - VS 2022 C++ x64/x86 Build Tools (Latest)`
     - `Windows 11 SDK (10.0.22621.0)`
  6. Click **Modify/Install** to complete the setup.

## Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd website-with-gated-content
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Initialize Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   
   You will need to retrieve the following values:

   **Supabase Configuration** (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`):
   1. Log in to the [Supabase Dashboard](https://supabase.com/dashboard) and click on your project to enter it.
   2. Click the **Connect** button located in the top header bar.
   3. Select the **App Frameworks** tab in the modal that appears.
   4. Choose "Next.js" to see your keys.

   **Tina Cloud Configuration**:
   1. Log in to [Tina Cloud](https://app.tina.io/) and select your project by clicking the **Project Details** button.
   2. **Client ID** (`NEXT_PUBLIC_TINA_CLIENT_ID`): Go to the **Overview** tab and find "Client ID" under the **Application IDs** section.
   3. **Token** (`TINA_TOKEN`): Go to the **Tokens** tab. Use the existing **Content (Readonly)** token if present, or generate a new one.

## Building and Running

- **Run locally**:
  ```bash
  npm run dev
  ```
  Access the app at `http://localhost:3000`. The TinaCMS admin is available at `http://localhost:3000/admin`.

- **Build for production**:
  ```bash
  npm run build
  ```

## How to Contribute

We have two main types of contributions:

### 1. Website content (from contributors with Markdown focus)
**Goal**: Adding new content to existing pages or creating new pages.
*   **Workflow**: You will primarily work with **Markdown sources** and the TinaCMS interface.
*   **Tools**: You can use the local TinaCMS admin interface (`/admin`) to visual edit content, which saves changes to the local filesystem.
*   **Files**: Content is stored in the `content/` directory (e.g., `content/pages`).

### 2. Web app features (from contributors with TypeScript and Markdown focus)
**Goal**: Adding new web app features, components, or layout changes.
*   **Workflow**: You will work on both **TypeScript** (React/Next.js) code and **Markdown** sources.
*   **Files**:
    *   `app/`: Next.js App Router pages and API routes.
    *   `components/`: React components.
    *   `tina/config.ts`: TinaCMS schema configuration.
