# Fast English
> A retro-game-ish-like English test that teaches through repetition.

You can view a live version of the app [here](https://cdn.rawgit.com/conradoqg/fastenglish/62554ad3/index.html).

## Contribute

### For Developers

Send a pull request to this repository, updating the `data/questions.json` with your new questions.

### For English Ninjas

Open a issue [here](https://github.com/conradoqg/fastenglish/issues) suggesting new questions.

### Issues

When you find issues, please report them [here](https://github.com/conradoqg/fastenglish/issues).

## Deploying your own version

### Steps
1. Create a [Firebase](http://firebase.google.com) account and update the HTML files with your firebase config;
2. Set the rule bellow to the main database, replacing the `<admin_uid>` with an UID of an admin user;
```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null && (auth.uid == '<admin_uid>')",
    "questions": {
      ".indexOn": ["level"]
    }
  }
}
```
3. Add your domain to the firebase database;
4. Serve the app with `npm start`;
5. Access the `admin` menu inside `options` to login (using admin e-mail and password) and populate the database;

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code
to be distributed under the MIT license. You are also implicitly verifying that
all code is your original work.

## License

Copyright (c) 2016-2016, Conrado Quilles Gomes. (MIT License)

See LICENSE for more info.