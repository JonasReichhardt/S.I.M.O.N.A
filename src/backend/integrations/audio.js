import child_process from 'child_process'

export default class Audio {
    static async play(file, duration) {
        child_process.exec("sh integrations/audio.sh", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    }
}