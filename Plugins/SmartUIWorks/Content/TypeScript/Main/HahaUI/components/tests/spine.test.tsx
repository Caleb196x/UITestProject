import * as React from 'react';
import raptor_pro from '../../assets/raptor-pro.json';
import raptor_pro_atlas from '../../assets/raptor.atlas';
import xinzhangjie from '../../assets/ui_xinzhangjie.json';
import { Spine } from 'reactUMG';
import { useRef, useState } from 'react';

export const SpineUIExample = () => {
    const spineRef = useRef<Spine>(null);
    const [index, setIndex] = useState(2);
    const anims = ['enter', 'idle', 'attack', 'death'];

    const handleChangeAnimation = () => {

        setIndex((prevIndex) => {
            console.log('change animation ' + anims[prevIndex] + ' ' + prevIndex);
            spineRef.current?.nativePtr.SetAnimation(0, anims[prevIndex], true);
            const newIndex = (prevIndex + 1) % anims.length;
            console.log('new index: ' + newIndex);
            return newIndex;
        });
    }

    return (
        <canvas>
            <Spine ref={spineRef} style={{width: '400px', height: '400px',
                justifySelf: 'center', positionAnchor: 'center center'}}
                skel={xinzhangjie} initAnimation='enter' />
            <button
                style={{positionAnchor: 'center center', top: '-20px', left: '-50px'}}
                onClick={handleChangeAnimation}>Change Animation
            </button>
        </canvas>
    );
};