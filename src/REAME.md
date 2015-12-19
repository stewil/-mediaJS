#Build instructions

##Prerequisites
 1. Ensure that you have node package manager and bower installed.
 2. Open up your command prompt/terminal in the root of this directory.
 3. Run 'npm install' to install all node dependencies.
 4. Run 'bower install' to install all your vendor dependencies.
 5. See below for gulp commands to run.
 
##Gulp Tasks
| Name        | arguments        | Description           | Example  |
| ------------- | ------------- | ------------- | ----- |
| watch |  | Compiles files into a temp /debug directory and serves up and instance of browser sync for development |  |
| build | --patch, --minor --major | Compiles library components and bumps the library version by the supplied argument |  |