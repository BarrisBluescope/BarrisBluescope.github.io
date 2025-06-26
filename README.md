# Technology Radar

A beautiful, interactive Technology Radar for tracking and assessing technology adoption across your organization.

## Features

- **Interactive Radar Visualization**: Visual representation of technologies across four quadrants and rings
- **Easy Management**: Simple JSON-based configuration for adding/updating technologies
- **Search & Filter**: Find technologies quickly with search and filtering capabilities  
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Modern UI**: Clean, professional design with smooth animations
- **Git-Friendly**: Easy to host and version control

## Quadrants

1. **Techniques**: Development and delivery techniques
2. **Platforms**: Infrastructure and platforms
3. **Tools**: Development tools and utilities
4. **Languages & Frameworks**: Programming languages and frameworks

## Rings

1. **Adopt**: Technologies we have high confidence in and recommend for use
2. **Trial**: Technologies worth exploring with the goal of understanding their strategic fit
3. **Assess**: Technologies that are promising but require more investigation
4. **Hold**: Technologies we recommend avoiding or moving away from

## Usage

### Adding New Technologies

Edit the `src/data/technologies.json` file to add new technologies:

```json
{
  "id": 13,
  "name": "Technology Name",
  "quadrant": "Tools",
  "ring": "Assess",
  "description": "Brief description of the technology and its use case.",
  "isNew": true,
  "moved": 0
}
```

### Technology Properties

- `id`: Unique identifier for the technology
- `name`: Technology name
- `quadrant`: One of "Techniques", "Platforms", "Tools", "Languages & Frameworks"
- `ring`: One of "Adopt", "Trial", "Assess", "Hold"
- `description`: Brief description of the technology
- `isNew`: Whether this is a new entry (shows red dot)
- `moved`: Movement indicator (-1: moved out, 0: no change, 1: moved in)

### Deployment

This is a static React application that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
-任何支持静态站点的平台

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Customization

The radar configuration can be customized in `src/components/RadarChart.tsx`:

- Colors for quadrants and rings
- Radar dimensions
- Ring sizes
- Animation settings

## Data Structure

The application uses a simple JSON structure that makes it easy to maintain your technology radar:

```json
{
  "technologies": [
    {
      "id": 1,
      "name": "React",
      "quadrant": "Languages & Frameworks",
      "ring": "Adopt",
      "description": "A JavaScript library for building user interfaces.",
      "isNew": false,
      "moved": 0
    }
  ]
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Update the technologies.json file
4. Commit your changes
5. Push to the branch
6. Create a Pull Request

## License

MIT License - feel free to use this for your organization's technology radar.