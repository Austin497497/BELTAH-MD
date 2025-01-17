const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYUt5UDZWR25ieEFad3BNMSt3ME5nL0k2c2NWS29oUDRsRVQ1VWdpRFFIdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUExENlEyZDZXUDRIeWtPRlhLc3QyTXpKeXVQZ2h5RVh3TW4yc1VwcTV6ST0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJzRG80UnUrS0VWdDZBTk1TajJuZjB5MzhCYkpkakxWVGk2eG15NWw2SlhZPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJXVFp2eDRuZ2VCdFcyUFUrWEVkZUhnaXUvdjYyRy9uSlB5M3VEbldqK3pRPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlFLa2MrRFZ5U1hPTnUzQ3k1eXpkSG9tUTZlVjVMQ0UrTHo2OE5Za1VOblU9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjM4Wm11bTIzam1PajhWS1V1cGdoaDVnN3JSc0VTb21odHQ5L05XbEZObUk9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZ01DbkZtZG1ja2Z4UE9adm96bHF3ZTBJelUxYThwcndWdlNiUGQvY3BtND0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiV2xrYlBtWEFRUVV2N0tRUjVPWkFLZTB5UlNtc2gzMmJYb2ViWTJ5MktXST0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InptbU5GS3lmUGt6R0FNakkzdHFQQnRDdWZiRXp3TWVJUm5iY0JadDhBcURnOWxucFJpNm5ZNGI4YWx2VzF5WGxyK1dMYS9WTWwrcGRORXREYWhlOGlnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjQ5LCJhZHZTZWNyZXRLZXkiOiJoVXZkb0N2ZzZHT3MxejJ5YkFpMUtteWpVQTdTbjl4Y0EvYUJUSEd2UnRBPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6NjEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjo2MSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJhV0FIRXZxY1RnU3J0TUdEd3JaVzV3IiwicGhvbmVJZCI6ImRmM2Q4YjQyLTk5NTgtNGI0ZS1iNzBiLTlkYmFlN2IzMjQxMSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ0M3h2VzE4V3JSeE9KMjdHOFZHd2pGUWhKVUU9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiT1N2SG9pQ2hHM211UkcwSE1CcjZuZVQwMVp3PSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkxCTlI3UVFTIiwibWUiOnsiaWQiOiIyNTQ3NTc3MjU2NTY6OUBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSnFVeE1NRUVNdlZxTHdHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiWUEzS0Uya0o2VloyNC9Ydi9vYkl2VGNGQTYzN1BSc25uSmpBa2x4TDEwWT0iLCJhY2NvdW50U2lnbmF0dXJlIjoic0xCNWVRUWYwUDJ5aHordFNvdjQ1UUhkK0hyQUtCbFdtWGRJWnJudTJML0puQ29yUjdQWVZoOHZoTXZhWmJUb2tHbkFrUXg3Q1VYbXBnL3NoY1kvRFE9PSIsImRldmljZVNpZ25hdHVyZSI6IlVCemtNWFFDTHVqNmZVaTN1QXdpY3ppdWhTOXBFSUUxWlhmZktiMFlxOVU2UzNOWXNETVZjQkYrTjZnK0pKN3ltNjhmYzhLSXNtSmNaK3BycUtwSWpBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0NzU3NzI1NjU2OjlAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCV0FOeWhOcENlbFdkdVAxNy82R3lMMDNCUU90K3owYko1eVl3SkpjUzlkRyJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTczNzEwODE4NCwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFNaFEifQ==',
    PREFIXE: process.env.PREFIX || ".",
    GITHUB : process.env.GITHUB|| 'https://github.com/Huaweike/BELTAH-MD',
    OWNER_NAME : process.env.OWNER_NAME || "★DRACO★",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "254757725656",
    ANTICALL: process.env.ANTICALL || "non",
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    AUTOREAD_MESSAGES: process.env.AUTOREAD_MESSAGES || "non",
    AUTO_REACT: process.env.AUTO_REACTION || "non",
    GURL: process.env.GURL  || "https://whatsapp.com/channel/0029VaRHDBKKmCPKp9B2uH2F",
    WEBSITE :process.env.GURL || "https://whatsapp.com/channel/0029VaRHDBKKmCPKp9B2uH2F",
    CAPTION : process.env.CAPTION || "ᴘᴏᴡᴇʀᴇᴅ ʙʏ BELTAH-MD",
    BOT : process.env.BOT_NAME || 'BELTAH-MD',
    URL : process.env.BOT_MENU_LINKS || '',
    MODE: process.env.PUBLIC_MODE || "yes",
    TIMEZONE: process.env.TIMEZONE || "Africa/Nairobi", 
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME || null,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY || null,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || 'recording',
    //GPT : process.env.OPENAI_API_KEY || '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',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    CHATBOT : process.env.PM_CHATBOT || 'yes',  
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
