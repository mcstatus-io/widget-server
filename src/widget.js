import path from 'path';
import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs/promises';
import humanizeDuration from 'humanize-duration';

const CANVAS_WIDTH = 860;
const CANVAS_HEIGHT = 240;
const TEXT_OFFSET_Y = 62;

let defaultIconImage;

export const registerFonts = () => {
    registerFont(path.join('assets', 'fonts', 'Ubuntu-Regular.ttf'), {
        family: 'UbuntuRegular',
    });

    registerFont(path.join('assets', 'fonts', 'Ubuntu-Bold.ttf'), {
        family: 'UbuntuBold',
    });

    registerFont(path.join('assets', 'fonts', 'UbuntuMono-Regular.ttf'), {
        family: 'UbuntuMono'
    });
};

export const loadDefaultIcon = async () => {
    const data = await fs.readFile(path.join('assets', 'images', 'default-icon.png'));

    defaultIconImage = await loadImage(data);
};

export const generateJavaWidget = async (status, options) => {
    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    const ctx = canvas.getContext('2d', { alpha: true });

    console.log('a');

    ctx.patternQuality = 'nearest';

    console.log('a');

    // Background
    {
        ctx.beginPath();
        ctx.fillStyle = options.dark ? '#232323' : '#F2F2F2';
        ctx.strokeStyle = options.dark ? '#3A3A3A' : '#D9D9D9';
        ctx.lineWidth = 5;

        if (options.rounded) {
            ctx.roundRect(2, 2, CANVAS_WIDTH - 4, CANVAS_HEIGHT - 4, 16);
        } else {
            ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        ctx.fill();

        if (options.border) ctx.stroke();
    }

    // Icon
    {
        let icon = defaultIconImage;

        if (status.online && status.icon !== null && status.icon.length > 0) {
            try {
                icon = await loadImage(status.icon);
            } catch {
                // Ignore
            }
        }

        ctx.drawImage(icon, (CANVAS_HEIGHT - 192) / 2, (CANVAS_HEIGHT - 192) / 2, 192, 192);
    }

    // Status Bubble
    {
        ctx.beginPath();
        ctx.fillStyle = status.online ? '#2ECC71' : '#E63946';
        ctx.arc(CANVAS_HEIGHT + 5, TEXT_OFFSET_Y, 10, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    // Status Text
    {
        ctx.beginPath();
        ctx.font = '36px "UbuntuBold"';
        ctx.fillStyle = status.online ? '#2ECC71' : '#E63946';
        ctx.fillText(status.online ? 'Online' : 'Offline', CANVAS_HEIGHT + 25, TEXT_OFFSET_Y + 12);
    }

    // Address
    {
        ctx.beginPath();
        ctx.font = '32px "UbuntuMono"';
        ctx.fillStyle = options.dark ? '#CCCCCC' : '#555555';
        ctx.fillText(status.host + (status.port !== 25565 ? ':' + status.port : ''), CANVAS_HEIGHT - 5, TEXT_OFFSET_Y + 50);
    }

    // Players
    {
        let players = 'Unknown players';

        if (status.online) {
            players = `${status.players?.online ?? 0} players`;

            if (status.players?.max) {
                players = `${status.players.online}/${status.players.max} players`;
            }
        }

        ctx.beginPath();
        ctx.font = '32px "UbuntuRegular"';
        ctx.fillStyle = options.dark ? '#CCCCCC' : '#555555';
        ctx.fillText(players, CANVAS_HEIGHT - 5, TEXT_OFFSET_Y + 95);
    }

    // Last Checked
    {
        ctx.beginPath();
        ctx.font = '24px "UbuntuRegular"';
        ctx.fillStyle = options.dark ? '#888888' : '#A0A0A0';
        ctx.fillText(`Last checked ${humanizeDuration(Date.now() - status.retrieved_at, { largest: 1, round: true })} ago`, CANVAS_HEIGHT - 5, TEXT_OFFSET_Y + 130);
    }

    // Watermark
    {
        ctx.beginPath();
        ctx.font = '16px "UbuntuRegular"';
        ctx.fillStyle = options.dark ? '#888888' : '#A0A0A0';
        ctx.textAlign = 'end';
        ctx.fillText('\u00A9 mcstatus.io', CANVAS_WIDTH - 16, CANVAS_HEIGHT - 18);
    }

    return canvas.toBuffer();
};