# LinkTree Clone

A modern, customizable LinkTree clone built with React, Vite, and Tailwind CSS. This application allows users to create their own personalized link-sharing page with a beautiful, responsive design and customizable themes.

## Features

- **Profile Management**
  - Upload and display profile picture
  - Add contact information (vCard)
  - Customize email and bio
  - Dynamic social media links

- **Theme Customization**
  - Multiple pre-built themes
  - Collapsible theme selector
  - Dark gradient background with grid pattern
  - Glass-morphism effects

- **Social Media Integration**
  - Support for major platforms:
    - GitHub
    - X (Twitter)
    - Facebook
    - LinkedIn
    - Instagram
    - Telegram
    - Custom website links
  - Dynamic link management
  - Platform-specific icons

- **QR Code Generation**
  - Generate QR codes for your profile
  - Download QR codes for offline sharing

## Technologies Used

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Routing**: React Router
- **State Management**: React Query

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Navigate to the project directory:
```bash
cd linktree-clone
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/         # Reusable UI components
├── contexts/          # React contexts (theme, etc.)
├── pages/             # Page components
│   ├── Index.tsx      # Main profile page
│   └── Settings.tsx   # Settings page
├── hooks/             # Custom React hooks
└── utils/             # Utility functions
```

## Features in Detail

### Theme System
The application includes a sophisticated theme system that allows users to switch between different visual styles. Themes affect the entire application, including:
- Background colors and patterns
- Card appearances
- Text colors and contrast
- Interactive element styles

### Settings Page
The settings page provides a comprehensive interface for managing your profile:
- Profile information management
- Social media link management
- QR code generation
- Theme customization

### Responsive Design
The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide](https://lucide.dev/) for the icon set
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework