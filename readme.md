# THIS BRANCH IS OBSOLETE

Version of vulcanjs here won't be updated anymore. Please check the [new](https://github.com/hypedevss/vulcanjs/tree/hebece) version that will support eduVULCAN


# NOTICE

Not every school that uses VULCAN e-register has implemented eduVULCAN and still uses the old app, this will work in these cases.
The new mobile API has almost no differences, the main differences are the login system has been changed and some features will be paid (in the app, if the api would allow it, idk)
This project remains abandoned until someone/or me doesn't figure out how to update the library to work with eduVULCAN.


# vulcanjs
Experimental Vulcan UONET+ client, controllable with the terminal.

# features

- session registering
- student listing
- student selection
- lucky number
- lessons timetable (with option to specify the date and working substitutions)
- more soon

# installation
  - clone this repo
  - run `npm i` to install dependencies
  - run `npm run build` to compile the typescript files
  - Congrats!

# updating
  So, you should have typescript installed, so let's continue
  - run `npm run clean` to remove your current compiled JS files
  - run `npm run build` to compile the typescript files
  - Congrats!
  
# prebuilt 
Please build it yourself, making a prebuilt would be problematic due to frequent updates


# security
Please, if you wan't to share this with someone, send him the GitHub repo link, NEVER send him an archive with all the data especially `auth`, this folder contains data used to authenticate with Vulcan UONET+ API, and giving it to someone makes possible to the second user get your personal information, school that you are going to, etc.

# contribution
feel free to fork this repo make changes and make a pull request :)
