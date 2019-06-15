const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Saves current blue and redside teams for use with moveteams
let current_blue = [];
let current_red = [];

// For configuration because a db would be overkill right now
let config = {
    'blue_side_voice_id': '587725079887216641',
    'red_side_voice_id': '588464110027407370',
    'initial_voice_id': ''
};

// When receiving a message
client.on('message', msg => {
    console.log(current_red, current_blue);

    if (msg.content === 'maketeams') {
        // Init side arrays
        current_red = [];
        current_blue = [];
        try {
            // Get voice channel of message sending user
            const vchan = msg.member.voiceChannel;
            config.initial_voice_id = vchan.id;

            // Get members of voice channel
            let member_list = [];
            vchan.members.forEach(function (guildMember, _) {
                member_list.push([guildMember.user.username, guildMember.user.id]);
            });
            // Random shuffle
            shuffle(member_list);
            // Split random shuffled array in half
            let array_half_len = Math.ceil(member_list.length / 2);
            let blue_side = member_list.splice(0, array_half_len);
            let red_side = member_list;

            // Get names and print message with teams
            let blue_names = [];
            blue_side.forEach(function (value) {
                blue_names.push(value[0]);
                current_blue.push(value[1]);
            });
            let red_names = [];
            red_side.forEach(function (value) {
                red_names.push(value[0]);
                current_red.push(value[1]);
            });

            msg.reply("\n**Blue side:** " + blue_names.join(", ") + "\n**Red side:** " + red_names.join(", "));
        } catch (e) {
            console.log(e);
            msg.reply("Please join a voice channel.")
        }

        // console.log(blue_side);
        // console.log(red_side);

    } else if (msg.content.startsWith("moveteams")) {
        // Get ids for channels from config (hardcoded for our server as default)
        let blue_vchan_id = config.blue_side_voice_id;
        let red_vchan_id = config.red_side_voice_id;

        if (current_blue.length < 1) {
            msg.reply("Blue side needs at minimum 1 player");
            return
        }

        if (current_red.length < 1) {
            msg.reply("Red side needs at minimum 1 player");
            return
        }
        try {
            moveTeam(msg, current_blue, blue_vchan_id)
            moveTeam(msg, current_red, red_vchan_id)
        } catch (err) {
            console.log(err)
            msg.reply("Please specify the blue/red side voice channel id with 'blueid id' and 'redid id'")
        }

    } else if (msg.content.startsWith("blueid")) {
        // Config for setting blue and red side
        config.blue_side_voice_id = msg.content.split(" ")[1];
        console.log(config.blue_side_voice_id)
        msg.reply("Set blue side voice channel to " + client.channels.get(config.blue_side_voice_id).name);
    } else if (msg.content.startsWith("redid")) {
        config.red_side_voice_id = msg.content.split(" ")[1];
        console.log(config.red_side_voice_id)
        msg.reply("Set red side voice channel to " + client.channels.get(config.red_side_voice_id).name)
    } else if (msg.content === 'moveback') {
        if (config.initial_voice_id === '') {
            msg.reply("Please call maketeams before calling moveback")
        }
        moveTeam(msg, current_red, config.initial_voice_id)
        moveTeam(msg, current_blue, config.initial_voice_id)
    }
});

function moveMember(msg, member_id, vchan_id) {
    msg.guild.member(member_id).setVoiceChannel(vchan_id).catch(function (err) {
        console.log(err);
        return new Error(err)
    }).catch(function (err) {
        return err
    })
}

function moveTeam(msg, team_member_ids, vchan_id) {
    team_member_ids.forEach(function (member_id) {
        console.log("Trying to move player with id " + member_id + " to Voicechannel with id " + vchan_id);
        err = moveMember(msg, member_id, vchan_id)
        if (err instanceof Error) {
            throw err
        }
    });
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

client.login(auth.token);