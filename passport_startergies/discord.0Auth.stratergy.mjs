import  passport  from "passport";
import Strategy from "passport-discord";
import dotenv from "dotenv"
import { DiscordUser } from "../mongoose/scheemas/discord.user.mjs";

dotenv.config();


passport.serializeUser((user,done)=>{
    console.log("inside Serialise User");
    done(null,user._id.toString());
});

passport.deserializeUser(async (id,done)=>{
    try {
        const findUser = await DiscordUser.findById(id);
        if (!findUser) throw new Error("User not found");
        return done(null,findUser);
        
    } catch (error) {
        done(error,null)
        
    }
});



export default passport.use(
    new Strategy({
        clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope:["identify","guilds","email"],
    },
    async (accessToken,refreshToken,profile,done) => {

       let FindUser;
       try {

        FindUser = await DiscordUser.findOne({discordId:profile.id});

       } catch (error) {
        return done(error,null);
        
       }
       try {
        if(!FindUser){
            const newUser = new DiscordUser({
                username:profile.username,
                discordId:profile.id,
            });
            const newSavedUser = await newUser.save();
            return done(null,newSavedUser);

        }
        return done(null,FindUser);
        
       } catch (error) {
        console.log(error)
        return done(error,null);
        
       }
        


    }

    )
);
