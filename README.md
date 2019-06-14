# Basic LoL teams generator
This is a very basic discord bot that will generate a red and a blue side team for a given voice channel.
## Usage
* `maketeams`: This command will generate two random teams of the users in the voice channel of the caller.

* `moveteams`: This command will move the generated teams to different voice channels

* `blueid <id>`: Sets the id of the voice channel that the blue side team should be moved to upon calling `moveteams`

* `redid <id>`: Sets the id of the voice channel that the red side team should be moved to upon calling `moveteams` 

Note that voice channel ids can be copied when developer mode is active (via discord app settings).
## Installation
1.  Create auth.json with valid credentials. An example is below. 
2. `npm install package.json`
3. `npm install discord.js`
4. `node bot.js`
### auth.json example
Auth token can be created via the developer portal on discord.
```json
{
  "token" : "<your_token>"
}
```