"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const _service_1 = require("./_service");
const discord_js_1 = require("discord.js");
const cmd = new command_1.command({
    name: 'check',
    run: async (client, msg, args) => {
        const name = args.shift();
        const url = args.shift();
        _service_1.ServiceMonitor.downloadCheck(url, (err, res) => {
            if (err) {
                msg.channel.send(`Error occured during checking download link.\`\`\`${err}\`\`\``);
                return;
            }
            if (res.statuscode == 200) {
                const content_len = parseInt(res.headers["content-length"]);
                const embed = new discord_js_1.MessageEmbed()
                    .setTitle(`Download Link **(${name})**`)
                    .setDescription(`Download available\nSize: ${(content_len / (1024 * 1024)).toFixed(2)}mb\n[Click here to download](${url})`)
                    .setFooter(`${name} | ${url}`)
                    .setColor('#2ae85d')
                    .setTimestamp(new Date());
                msg.channel.send(embed);
            }
            else if (res.statuscode == 404) {
                const embed = new discord_js_1.MessageEmbed()
                    .setTitle(`Download Link **(${name})**`)
                    .setDescription(`Download not available...`)
                    .setFooter(`${name} | ${url}`)
                    .setColor('#eb2d36')
                    .setTimestamp(new Date());
                msg.channel.send(embed);
            }
        });
    },
    security: [],
    aliases: [],
    parents: ['service', 'download'],
    branches: [],
    category: '',
    description: '',
    usage: ['<name>', '<url>'],
    //init : (client: myClient) => {},
    allow_args: (msg, args) => {
        if (args.length < 2)
            return false;
        if (!_service_1.ServiceMonitor.isUrl(args[1])) {
            msg.channel.send('URL is not valid.');
            return false;
        }
        return true;
    },
});
exports.cmd = cmd;
