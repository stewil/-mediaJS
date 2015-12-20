# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
- Breakpoints must be passed into the library as a setting parameter and do not auto-magically work out breakpint names from parsed CSS.

## [0.1.0] - 2015-12-20
### Added
- Added initialize and remove methods for creating and destroying library.
- Implemented changeQueue for managing multiple event listeners.
- Implemented debounce for performance and added debounce timeout as a setting parameter.
- Library expects a breakpoint element to base it's measurements from and when not supplied with one appends a new breakpoint element to the DOM.
- Added 'onChange()' method to notify subscribers when a new breakpoint becomes active
- Added 'closestInRange()' method for checking with breakpoint in a range would be active.
- Added 'currentLargerThan()' method for comparing known breakpoint names against the active one.
- Added 'current' value which represents the current active breakpoint.