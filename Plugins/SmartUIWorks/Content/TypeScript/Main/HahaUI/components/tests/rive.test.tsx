import * as React from 'react';
import { Rive } from 'reactUMG';
import { useRef } from 'react';
import dance from '../../assets/dance.riv';

export const RiveUIExample = () => {
    const riveRef = useRef<Rive>(null);

    return (
        <canvas>
            <Rive ref={riveRef} style={{width: '400px', height: '400px',
                justifySelf: 'center', positionAnchor: 'center center'}}
                rive={dance} />
        </canvas>
    );
};