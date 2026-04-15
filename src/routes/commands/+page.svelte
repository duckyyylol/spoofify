<script>
    import { getUserData, Markdown } from "duckylib";

</script>
<Markdown widthPercent={100} content={`## Glossary   
> - **Aliases/Alias** - An alternative name for a command that provides the same functionality. **!sr** is an alias for **!songrequest**    
> 
> 
> - **Arguments **- Text you supply after the main command to influence what the command does. (i.e. /ban &lt;user&gt;, where the &lt;user&gt; argument is the username of the user you are banning)
> 
> 
> - **Placeholders **- Denoted by text _&lt;surrounded in angle brackets&gt;_ placeholders are meant to be **fully replaced** by the intended argument (i.e. &lt;user&gt; becomes @username, not &lt;@username&gt;)
   
   
## Commands   

#### \`!songrequest\`   
> Adds a song to the queue based on a search query.   
>
> > - **Aliases: ** **!sr**, **!addsong**, **!play**, **!request**    
> > - **Usage: **!songrequest &lt;song&gt;   
> > - **Example: **!request hotel california   
   
#### \`!nowplaying\`  
> Displays the current playing track   
>
> > - **Aliases: ** **!np**, **!song**, **!currentsong**, **!whatsplaying** 
> > - **Usage: **!nowplaying   
> > - **Example: **!np   
   
#### \`!queue\`   
> Displays the size of the track queue   
>
> > - **Aliases: ** **!q**, **!songlist**, **!tracklist**  
> > - **Usage: **!queue   
> > - **Example: **!tracklist   
   
${getUserData() !== null ? `#### \`!togglesr\`   
> Toggles the !songrequest command on/off   
> 
> > - **Aliases: ** **!togglecommand**    
> > - **Usage: **!togglesr   
> > - **Example: **!togglecommand   
   
#### \`!addreward\`   
> Add any channel point redemption as a song request redeem.   
>
> > - **Aliases: None**   
> > - **Usage: **!addreward   
> > - **Example: **!addreward   
   
#### \`!removereward\`   
> Remove any channel point redemption as a song request redeem.   
>
> > - **Aliases: ** **!delreward**, **!remreward**    
> > - **Usage: **!removereward   
> > - **Example: **!delreward` : ""}`} />