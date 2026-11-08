// Run the same development client with enough heap for the full acceptance catalog.
const {spawn}=require('node:child_process');
const child=spawn(process.execPath,['--max-old-space-size=8192',require.resolve('expo/bin/cli'),'start','--dev-client','--clear','--port','8082','--ios',...process.argv.slice(2)],{stdio:'inherit',env:process.env});
child.on('exit',code=>process.exit(code??1));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
