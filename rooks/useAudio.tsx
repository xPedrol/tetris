import {useEffect, useState} from "react";

type UseAudioProps = {
    volume?: number;
    currentTime?: number;
}
const useAudio = (url: string, props?: UseAudioProps) => {
    const [audio] = useState(typeof Audio !== 'undefined' ? new Audio(url) : null);
    const [playing, setPlaying] = useState(false);
    const toggle = () => setPlaying(!playing);
    const stop = () => setPlaying(false);
    const start = () => setPlaying(true);
    const restart = () => {
        if (audio) {
            audio.currentTime = 0;
        }
    };
    useEffect(() => {
        console.log('useAudio: useEffect');
            if (audio) {
                playing ? audio.play() : audio.pause();
            }
        },
        [playing]
    );
    useEffect(() => {
        if (audio) {
            audio.volume = props?.volume ?? 0.1;
            audio.currentTime = props?.currentTime ?? 0;
            audio.addEventListener('ended', () => setPlaying(false));
            return () => {
                audio.removeEventListener('ended', () => setPlaying(false));
            };
        }
    }, []);

    return {playing, toggle, start, stop, restart};
};

export default useAudio;