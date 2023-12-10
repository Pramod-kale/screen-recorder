import React, { useEffect, useState } from 'react'

import './ScreenRecorder.scss'


import { ReactComponent as Chevron } from '../assets/chevron.svg'
import { ReactComponent as Camera } from '../assets/camera.svg'
import { ReactComponent as CameraDisable } from '../assets/camera-disable.svg'
import { ReactComponent as Mic } from '../assets/mic-disable.svg'
import { ReactComponent as MicDisable } from '../assets/mic.svg'
import { ReactComponent as Record } from '../assets/recording.svg'
import { ReactComponent as Setting } from '../assets/settings.svg'
import { ReactComponent as Arrow } from '../assets/arrow.svg'


type Props = {}

const ScreenRecorder = (props: Props) => {

    const videoFormats = ['mp4', 'mov', 'wmv', 'webm']
    const [counter, setCounter] = useState(0)

    const [toggleRecorder, setToggleRecorder] = useState<boolean>(false);
    const [settingsToggle, setSettingsToggle] = useState<boolean>(false);
    const [recording, setRecording] = useState<boolean>(false);
    const [recorderConfig, setRecorderConfig] = useState({
        audio: false,
        videoFormat: videoFormats[counter],
    })

    const handleCounter = async (index: number) => {
        if (index >= 0 && index < videoFormats.length) {
            setCounter(index)
            setRecorderConfig(prev => ({ ...prev, videoFormat: videoFormats[index] }))

        }
    }


    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

    const startRecording = async () => {
        const recorderChunks: Blob[] = [];
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    frameRate: { ideal: 30, max: 60 },
                },
                audio: recorderConfig.audio,
                cursor: 'always',
            } as any)


            const newMediaRecorder = new MediaRecorder(stream);
            setMediaRecorder(newMediaRecorder);

            newMediaRecorder.ondataavailable = (event: any) => {
                if (event.data.size > 0) {
                    recorderChunks.push(event.data);
                }
            };

            newMediaRecorder.onstop = () => {
                const blob = new Blob(recorderChunks, { type: `video/${recorderConfig.videoFormat}` });
                recorderChunks.length = 0;

                const filename = prompt('Enter filename');
                if (filename) {
                    const dataDownloadUrl = URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = dataDownloadUrl;
                    a.download = `${filename}.${recorderConfig.videoFormat}`;
                    a.click();

                    URL.revokeObjectURL(dataDownloadUrl);
                }
            };
            newMediaRecorder.start();
            setRecording(true);
            setToggleRecorder(false);
        } catch (error) {
            console.log(error)
        }

    };


    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setRecording(false);
        }
    };

    useEffect(() => {
        return () => {

            if (mediaRecorder) {
                mediaRecorder.stop();
            }
        };
    }, [mediaRecorder]);

    // useEffect(() => {

    //     const listDevices = async () => {
    //         const devices = await navigator.mediaDevices?.enumerateDevices?.();
    //         if (devices) {

    //             const audio = [];
    //             for (const device of devices) {
    //                 switch (device.kind) {

    //                     case 'audioinput': audio.push(device); break;
    //                 }
    //             }
    //             setAudioDevices(audio)
    //             return audio;
    //         } else {
    //             throw new Error('Media Devices API is not supported.');
    //         }
    //     };
    //     listDevices()
    // }, [])



    return (
        <div id='ScreenRecorder' className='screen-recorder-component'
            style={{ transform: `translateX(${toggleRecorder ? '0%' : '0%'})` }}
        >
            <div className="container">
                {/* <div className="toggle-icon icons-container"  >
                    <Chevron
                        className='icons'
                        onClick={() => setToggleRecorder(!toggleRecorder)}
                        style={{ transform: `rotate(${toggleRecorder ? '180deg' : '0deg'})` }}
                    />
                </div> */}

                <div className='play-pause icons-container '>
                    <Record
                        onClick={recording ? stopRecording : startRecording}
                        className={`${recording && 'recording'} icons`}
                    />
                </div>
                {/* <div className="camera icons-container ">
                    <Camera className='icons' />
                </div> */}
                <div className="mic icons-container " onClick={() => setRecorderConfig(prev => ({ ...prev, audio: !recorderConfig.audio }))}>
                    {recorderConfig.audio ? <Mic className='icons' /> : <MicDisable className='icons' />}
                </div>
                <div className="setting icons-container" onMouseEnter={() => setSettingsToggle(true)} onMouseLeave={() => setSettingsToggle(false)}>
                    <Setting className='icons' />

                    {
                        settingsToggle &&
                        <div className="setting-dialogue" onMouseLeave={() => setSettingsToggle(false)}>
                            <div className="options">
                                <div className="header">Video format</div>
                                <div className="option-carousal"> <Arrow className='arrow-left' onClick={() => handleCounter(counter - 1)} /> {recorderConfig.videoFormat} <Arrow className='arrow-right' onClick={() => handleCounter(counter + 1)} />  </div>
                            </div>
                            {/* <hr />


                            <div className="options">
                                <div className="header">Audio source</div>
                                <div className="option-carousal"> <Arrow className='arrow-left' /> mp4 <Arrow className='arrow-right' />  </div>
                            </div>

                            <hr />
                            <div className="options">
                                <div className="header">Video location</div>
                                <div className="option-carousal"> <Arrow className='arrow-left' /> mp4 <Arrow className='arrow-right' />  </div>
                            </div>
                            <div className="options">
                                <div className="header">Video border radius</div>
                                <div className="option-carousal"> <Arrow className='arrow-left' /> mp4 <Arrow className='arrow-right' />  </div>
                            </div> */}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ScreenRecorder