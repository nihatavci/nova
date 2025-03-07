# Changelog

All notable changes to the Nova project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Monthly investment options with four choices (€100-€300, €300-€500, €500-€1000, €1000+)
- Residence status options with descriptions
- Tax class options with descriptions
- Marital status options with descriptions
- Children options with descriptions
- Investment experience options with descriptions
- Risk tolerance options with descriptions
- Retirement goal options with descriptions
- Slider for monthly investment input
- Dashboard navigation from homepage and calculator results
- Added missing dependencies: drizzle-orm and pg for database functionality
- Added TypeScript type definitions for pg (@types/pg)
- Added dynamic export configuration for calculator page

### Changed
- Enhanced the price range slider with a larger size and silver dot
- Improved slider styling with custom CSS for better user experience
- Updated handleSliderChange function to handle multiple slider fields
- Reordered form steps to make annual salary step 4 instead of 3
- Enabled skip button to always be clickable regardless of selection
- Reduced loading time from 15 seconds to 5 seconds for better user experience
- Updated homepage button to navigate to dashboard
- Changed results button to navigate to dashboard
- Improved homepage button styling and positioning (larger size, better centered)
- Modified tax class display to use a 3-column grid for better visibility of all options
- Changed calculator container from fixed height to auto height with minimum height
- Reduced option button sizes for better fit in the container
- Improved spacing and padding in the calculator layout

### Fixed
- Fixed missing options in the multi-step form
- Fixed slider appearance for better visibility and interaction
- Fixed navigation between steps with proper back and skip functionality
- Fixed Tax Class 5 visibility issue by adjusting the grid layout
- Fixed content cropping issues in the calculator by adjusting container overflow settings
- Fixed navigation buttons styling to match the design in the screenshots
- Fixed footer positioning with proper margin
- Fixed TypeScript error in calculator page for Vercel deployment by safely accessing searchParams
- Fixed build error by adding missing database dependencies
- Fixed TypeScript type error for pg module
- Fixed prerendering error for calculator page by setting dynamic export
